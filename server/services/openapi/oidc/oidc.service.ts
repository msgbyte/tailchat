import { Provider, Configuration, InteractionResults } from 'oidc-provider';
import { config, TcService, ApiGatewayMixin } from 'tailchat-server-sdk';
import type { IncomingMessage, ServerResponse } from 'http';
import ejs from 'ejs';
import path from 'path';
import assert from 'assert';
import qs from 'qs';
import _ from 'lodash';
import serve from 'serve-static';
import { TcOIDCAdapter } from './adapter';
import { claimUserInfo } from './account';
import type { UserLoginRes } from '../../../models/user/user';

const PORT = process.env.OPENAPI_PORT || config.port + 1;
const ISSUER = config.apiUrl;
const IS_PROXY = process.env.OPENAPI_UNDER_PROXY === 'true';

const configuration: Configuration = {
  adapter: TcOIDCAdapter,
  // ... see /docs for available configuration
  clients: [],
  pkce: {
    methods: ['S256'],
    required: () => false, // TODO: false in test
  },
  claims: {
    profile: ['nickname', 'discriminator', 'avatar'],
  },
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope, claims, rejected) {
        const userInfo = await claimUserInfo(id);

        console.log('[oidc] findAccount', {
          use,
          scope,
          claims,
          rejected,
          userInfo,
        });

        return userInfo;
      },
    };
  },
  cookies: {
    keys: ['__tailchat_oidc'],
  },
  features: {
    devInteractions: {
      enabled: false,
    },
  },
  interactions: {
    url: (ctx, interaction) => `/open/interaction/${interaction.uid}`,
  },
  // TODO
  // ttl.Session
  // renderError
};

function readIncomingMessageData(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      resolve(body);
    });
    req.on('error', () => {
      reject();
    });
  });
}

class OIDCService extends TcService {
  provider = this.createOIDCProvider();

  get serviceName(): string {
    return 'openapi.oidc';
  }

  private createOIDCProvider() {
    const oidc = new Provider(ISSUER, configuration);
    if (IS_PROXY) {
      oidc.proxy = true;
      this.logger.info('is running under proxy.');
    }

    return oidc;
  }

  protected onInit(): void {
    this.registerMixin(ApiGatewayMixin);

    this.registerSetting('port', PORT);
    this.registerSetting('routes', this.getRoutes());
  }

  protected async onStart(): Promise<void> {
    this.initListeners();
  }

  initListeners() {
    function handleClientAuthErrors(
      { headers: { authorization }, oidc: { body, client } },
      err
    ) {
      console.error('handleClientAuthErrors', err);
      if (err.statusCode === 401 && err.message === 'invalid_client') {
        // console.log(err);
        // save error details out-of-bands for the client developers, `authorization`, `body`, `client`
        // are just some details available, you can dig in ctx object for more.
      }
    }
    this.provider.on('authorization.error', handleClientAuthErrors);
    this.provider.on('jwks.error', handleClientAuthErrors);
    this.provider.on('discovery.error', handleClientAuthErrors);
    this.provider.on('end_session.error', handleClientAuthErrors);
    this.provider.on('grant.error', handleClientAuthErrors);
    this.provider.on('introspection.error', handleClientAuthErrors);
    this.provider.on('revocation.error', handleClientAuthErrors);
    this.provider.on('userinfo.error', handleClientAuthErrors);
  }

  getRoutes() {
    const providerRoute = (req, res) => {
      try {
        this.provider.callback()(req, res);
      } catch (err) {
        console.error('[oidc]', err);
      }
    };

    return [
      {
        // Reference: https://github.com/moleculerjs/moleculer-web/blob/master/examples/file/index.js
        path: '/open',
        // You should disable body parsers
        bodyParsers: {
          json: false,
          urlencoded: false,
        },

        whitelist: [],

        authentication: false,
        authorization: false,

        aliases: {
          /**
           * 授权交互界面
           */
          'GET /interaction/:uid': async (
            req: IncomingMessage,
            res: ServerResponse
          ) => {
            try {
              const details = await this.provider.interactionDetails(req, res);
              const { uid, prompt, params, session } = details;

              const client = await this.provider.Client.find(
                String(params.client_id)
              );

              const promptName = prompt.name;
              const data = {
                logoUri: client.logoUri,
                clientName: client.clientName,
                uid,
                details: prompt.details,
                params,
                session,
                dbg: {
                  params: params,
                  prompt: prompt,
                },
              };

              if (promptName === 'login') {
                this.renderHTML(
                  res,
                  await ejs.renderFile(
                    path.resolve(__dirname, './views/login.ejs'),
                    data
                  )
                );
              } else if (promptName === 'consent') {
                this.renderHTML(
                  res,
                  await ejs.renderFile(
                    path.resolve(__dirname, './views/authorize.ejs'),
                    data
                  )
                );
              } else {
                this.renderError(res, '未知的操作');
              }
            } catch (err) {
              this.renderError(res, err);
            }
          },
          'POST /interaction/:uid/login': async (
            req: IncomingMessage,
            res: ServerResponse
          ) => {
            try {
              const {
                prompt: { name },
              } = await this.provider.interactionDetails(req, res);
              assert.equal(name, 'login');

              const data = await readIncomingMessageData(req);
              const { email, password } = qs.parse(String(data));

              // Find user
              const user: UserLoginRes = await this.broker.call('user.login', {
                email,
                password,
              });

              const result = {
                login: {
                  accountId: String(user._id),
                  ...user,
                },
              };

              await this.provider.interactionFinished(req, res, result, {
                mergeWithLastSubmission: false,
              });
            } catch (err) {
              console.error(err);
              this.renderError(res, err);
            }
          },
          'POST /interaction/:uid/confirm': async (
            req: IncomingMessage,
            res: ServerResponse
          ) => {
            try {
              const interactionDetails = await this.provider.interactionDetails(
                req,
                res
              );
              const {
                prompt: { name, details },
                params,
                session: { accountId },
              } = interactionDetails;
              assert.equal(name, 'consent');

              let { grantId } = interactionDetails;
              const grant = grantId
                ? // we'll be modifying existing grant in existing session
                  await this.provider.Grant.find(grantId)
                : // we're establishing a new grant
                  new this.provider.Grant({
                    accountId,
                    clientId: String(params.client_id),
                  });

              if (Array.isArray(details.missingOIDCScope)) {
                grant.addOIDCScope(details.missingOIDCScope.join(' '));
              }
              if (Array.isArray(details.missingOIDCClaims)) {
                grant.addOIDCClaims(details.missingOIDCClaims);
              }
              if (details.missingResourceScopes) {
                for (const [indicator, scopes] of Object.entries(
                  details.missingResourceScopes
                )) {
                  grant.addResourceScope(indicator, scopes.join(' '));
                }
              }

              grantId = await grant.save();

              const consent: InteractionResults['consent'] = {};
              if (!interactionDetails.grantId) {
                // we don't have to pass grantId to consent, we're just modifying existing one
                consent.grantId = grantId;
              }

              const result: InteractionResults = { consent };
              await this.provider.interactionFinished(req, res, result, {
                mergeWithLastSubmission: true,
              });
            } catch (err) {
              this.renderError(res, err);
            }
          },
          'GET /auth': providerRoute,
          'GET /auth/:uid': providerRoute,
          'POST /token': providerRoute,
          'POST /me': providerRoute,
          'GET /me': providerRoute,
          'GET /jwks': providerRoute,
          'GET /.well-known/openid-configuration': providerRoute,
        },
      },
      {
        // For css file in development
        path: '/',
        authentication: false,
        authorization: false,
        use: [serve('public')],
        whitelist: [],
        autoAliases: false,
      },
    ];
  }

  async renderError(res: ServerResponse, error: any) {
    res.writeHead(500);
    res.end(
      await ejs.renderFile(path.resolve(__dirname, './views/error.ejs'), {
        text: String(error),
      })
    );
  }

  renderHTML(res: ServerResponse, html: string) {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(html);
  }
}
export default OIDCService;
