/*
 * moleculer
 * Copyright (c) 2021 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

import http from 'http';
import http2 from 'http2';
import https from 'https';
import queryString from 'qs';
import os from 'os';
import kleur from 'kleur';

import _ from 'lodash';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import { isReadable as isReadableStream } from 'isstream';

import { Errors, ServiceSchema, Utils } from 'moleculer';
const { MoleculerError, MoleculerServerError, ServiceNotFoundError } = Errors;
const match = Utils.match;
import {
  ServiceUnavailableError,
  NotFoundError,
  ForbiddenError,
  RateLimitExceeded,
  ERR_ORIGIN_NOT_ALLOWED,
} from './errors';

import { Alias } from './alias';
import { MemoryStore } from './memory-store';

import {
  removeTrailingSlashes,
  addSlashes,
  normalizePath,
  composeThen,
  generateETag,
  isFresh,
} from './utils';

const MAPPING_POLICY_ALL = 'all';
const MAPPING_POLICY_RESTRICT = 'restrict';

const pkg = {
  name: 'moleculer-web',
  version: '0.10.5',
  repository: {
    type: 'git',
    url: 'https://github.com/moleculerjs/moleculer-web.git',
  },
};

function getServiceFullname(svc) {
  if (svc.version != null && svc.settings.$noVersionPrefix !== true)
    return (
      (typeof svc.version == 'number' ? 'v' + svc.version : svc.version) +
      '.' +
      svc.name
    );

  return svc.name;
}

const SLASH_REGEX = new RegExp(/\./g);

/**
 * Official API Gateway service for Moleculer microservices framework.
 *
 * @service
 */
export const ApiGatewayMixin: ServiceSchema = {
  // Default service name
  name: 'api',

  // Default settings
  settings: {
    // Exposed port
    port: process.env.PORT || 3000,

    // Exposed IP
    ip: process.env.IP || '0.0.0.0',

    // Used server instance. If null, it will create a new HTTP(s)(2) server
    // If false, it will start without server in middleware mode
    server: true,

    // Routes
    routes: [],

    // Log each request (default to "info" level)
    logRequest: 'info',

    // Log the request ctx.params (default to "debug" level)
    logRequestParams: 'debug',

    // Log each response (default to "info" level)
    logResponse: 'info',

    // Log the response data (default to disable)
    logResponseData: null,

    // If set to true, it will log 4xx client errors, as well
    log4XXResponses: false,

    // Log the route registration/aliases related activity
    logRouteRegistration: 'info',

    // Use HTTP2 server (experimental)
    http2: false,

    // HTTP Server Timeout
    httpServerTimeout: null,

    // Request Timeout. More info: https://github.com/moleculerjs/moleculer-web/issues/206
    requestTimeout: 300000, // Sets node.js v18 default timeout: https://nodejs.org/api/http.html#serverrequesttimeout

    // Optimize route order
    optimizeOrder: true,

    // CallOption for the root action `api.rest`
    rootCallOptions: null,

    // Debounce wait time before call to regenerate aliases when received event "$services.changed"
    debounceTime: 500,
  },

  // Service's metadata
  metadata: {
    $category: 'gateway',
    $description: 'Official API Gateway service',
    $official: true,
    $package: {
      name: pkg.name,
      version: pkg.version,
      repo: pkg.repository ? pkg.repository.url : null,
    },
  },

  actions: {
    /**
     * REST request handler
     */
    rest: {
      visibility: 'private',
      tracing: {
        tags: {
          params: ['req.url', 'req.method'],
        },
        spanName: (ctx) => `${ctx.params.req.method} ${ctx.params.req.url}`,
      },
      timeout: 0,
      handler(ctx) {
        const req = ctx.params.req;
        const res = ctx.params.res;

        // Set pointers to Context
        req.$ctx = ctx;
        res.$ctx = ctx;

        if (ctx.requestID) res.setHeader('X-Request-ID', ctx.requestID);

        if (!req.originalUrl) req.originalUrl = req.url;

        // Split URL & query params
        const parsed = this.parseQueryString(req);
        let url = parsed.url;

        // Trim trailing slash
        if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1);

        req.parsedUrl = url;

        if (!req.query) req.query = parsed.query;

        // Skip if no routes
        if (!this.routes || this.routes.length == 0) return null;

        let method = req.method;
        if (method == 'OPTIONS') {
          method = req.headers['access-control-request-method'];
        }

        // Check aliases
        const found = this.resolveAlias(url, method);
        if (found) {
          const route = found.alias.route;
          // Update URLs for middlewares
          req.baseUrl = route.path;
          req.url = req.originalUrl.substring(route.path.length);
          if (req.url.length == 0 || req.url[0] !== '/')
            req.url = '/' + req.url;

          return this.routeHandler(ctx, route, req, res, found);
        }

        // Check routes
        for (let i = 0; i < this.routes.length; i++) {
          const route = this.routes[i];

          if (url.startsWith(route.path)) {
            // Update URLs for middlewares
            req.baseUrl = route.path;
            req.url = req.originalUrl.substring(route.path.length);
            if (req.url.length == 0 || req.url[0] !== '/')
              req.url = '/' + req.url;

            return this.routeHandler(ctx, route, req, res);
          }
        }

        return null;
      },
    },

    listAliases: {
      rest: 'GET /list-aliases',
      params: {
        grouping: { type: 'boolean', optional: true, convert: true },
        withActionSchema: { type: 'boolean', optional: true, convert: true },
      },
      handler(ctx) {
        const grouping = !!ctx.params.grouping;
        const withActionSchema = !!ctx.params.withActionSchema;

        const actionList = withActionSchema
          ? this.broker.registry.getActionList({})
          : null;

        const res = [];

        this.aliases.forEach((alias) => {
          const obj: any = {
            actionName: alias.action,
            path: alias.path,
            fullPath: alias.fullPath,
            methods: alias.method,
            routePath: alias.route.path,
          };

          if (withActionSchema && alias.action) {
            const actionSchema = actionList.find(
              (item) => item.name == alias.action
            );
            if (actionSchema && actionSchema.action) {
              obj.action = _.omit(actionSchema.action, ['handler']);
            }
          }

          if (grouping) {
            const r = res.find((item) => item.route == alias.route);
            if (r) r.aliases.push(obj);
            else {
              res.push({
                route: alias.route,
                aliases: [obj],
              });
            }
          } else {
            res.push(obj);
          }
        });

        if (grouping) {
          res.forEach((item) => {
            item.path = item.route.path;
            delete item.route;
          });
        }

        return res;
      },
    },

    addRoute: {
      params: {
        route: { type: 'object' },
        toBottom: { type: 'boolean', optional: true, default: true },
      },
      visibility: 'public',
      handler(ctx) {
        return this.addRoute(ctx.params.route, ctx.params.toBottom);
      },
    },

    removeRoute: {
      params: {
        name: { type: 'string', optional: true },
        path: { type: 'string', optional: true },
      },
      visibility: 'public',
      handler(ctx) {
        if (ctx.params.name != null)
          return this.removeRouteByName(ctx.params.name);

        return this.removeRoute(ctx.params.path);
      },
    },
  },

  methods: {
    /**
     * Create HTTP server
     */
    createServer() {
      /* istanbul ignore next */
      if (this.server) return;

      if (
        this.settings.https &&
        this.settings.https.key &&
        this.settings.https.cert
      ) {
        this.server = this.settings.http2
          ? http2.createSecureServer(this.settings.https, this.httpHandler)
          : https.createServer(this.settings.https, this.httpHandler);
        this.isHTTPS = true;
      } else {
        this.server = this.settings.http2
          ? http2.createServer(this.httpHandler)
          : http.createServer(this.httpHandler);
        this.isHTTPS = false;
      }

      // HTTP server timeout
      if (this.settings.httpServerTimeout) {
        this.logger.debug(
          'Override default http(s) server timeout:',
          this.settings.httpServerTimeout
        );
        this.server.setTimeout(this.settings.httpServerTimeout);
      }

      this.server.requestTimeout = this.settings.requestTimeout;
      this.logger.debug(
        'Setting http(s) server request timeout to:',
        this.settings.requestTimeout
      );
    },

    /**
     * Default error handling behaviour
     *
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Error} err
     */
    errorHandler(req, res, err) {
      // don't log client side errors unless it's configured
      if (
        this.settings.log4XXResponses ||
        (err && !_.inRange(err.code, 400, 500))
      ) {
        this.logger.error(
          '   Request error!',
          err.name,
          ':',
          err.message,
          '\n',
          err.stack,
          '\nData:',
          err.data
        );
      }
      this.sendError(req, res, err);
    },

    corsHandler(settings, req, res) {
      // CORS headers
      if (settings.cors) {
        // Set CORS headers to `res`
        this.writeCorsHeaders(settings, req, res, true);

        // Is it a Preflight request?
        if (
          req.method == 'OPTIONS' &&
          req.headers['access-control-request-method']
        ) {
          // 204 - No content
          res.writeHead(204, {
            'Content-Length': '0',
          });
          res.end();

          if (settings.logging) {
            this.logResponse(req, res);
          }

          return true;
        }
      }

      return false;
    },

    /**
     * HTTP request handler. It is called from native NodeJS HTTP server.
     *
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Function} next Call next middleware (for Express)
     * @returns {Promise}
     */
    async httpHandler(req, res, next) {
      // Set pointers to service
      req.$startTime = process.hrtime();
      req.$service = this;
      req.$next = next;

      res.$service = this;
      res.locals = res.locals || {};

      let requestID = req.headers['x-request-id'];
      if (req.headers['x-correlation-id'])
        requestID = req.headers['x-correlation-id'];

      const options = { requestID };
      if (this.settings.rootCallOptions) {
        if (_.isPlainObject(this.settings.rootCallOptions)) {
          Object.assign(options, this.settings.rootCallOptions);
        } else if (_.isFunction(this.settings.rootCallOptions)) {
          this.settings.rootCallOptions.call(this, options, req, res);
        }
      }

      try {
        const result = await this.actions.rest({ req, res }, options);
        if (result == null) {
          // Not routed.

          const shouldBreak = this.corsHandler(this.settings, req, res); // check cors settings first
          if (shouldBreak) {
            return;
          }

          // Serve assets static files
          if (this.serve) {
            this.serve(req, res, (err) => {
              this.logger.debug(err);
              this.send404(req, res);
            });
            return;
          }

          // If not routed and not served static asset, send 404
          this.send404(req, res);
        }
      } catch (err) {
        this.errorHandler(req, res, err);
      }
    },

    /**
     * Handle request in the matched route.
     *
     * @param {Context} ctx
     * @param {Route} route
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Object} foundAlias
     */
    routeHandler(ctx, route, req, res, foundAlias) {
      // Pointer to the matched route
      req.$route = route;
      res.$route = route;

      this.logRequest(req);

      return new this.Promise(async (resolve, reject) => {
        res.once('finish', () => resolve(true));
        res.once('close', () => resolve(true));
        res.once('error', (err) => reject(err));

        try {
          await composeThen.call(this, req, res, ...route.middlewares);
          let params: any = {};

          const shouldBreak = this.corsHandler(route, req, res);
          if (shouldBreak) {
            return resolve(true);
          }

          // Merge params
          if (route.opts.mergeParams === false) {
            params = { body: req.body, query: req.query };
          } else {
            const body = _.isObject(req.body) ? req.body : {};
            Object.assign(params, body, req.query);
          }
          req.$params = params; // eslint-disable-line require-atomic-updates

          // Resolve action name
          let urlPath = req.parsedUrl.slice(route.path.length);
          if (urlPath.startsWith('/')) urlPath = urlPath.slice(1);

          // Resolve internal services
          urlPath = urlPath.replace(this._isscRe, '$');
          let action = urlPath;

          // Resolve aliases
          if (foundAlias) {
            const alias = foundAlias.alias;
            this.logger.debug('  Alias:', alias.toString());

            if (route.opts.mergeParams === false) {
              params.params = foundAlias.params;
            } else {
              Object.assign(params, foundAlias.params);
            }

            req.$alias = alias; // eslint-disable-line require-atomic-updates

            // Alias handler
            return resolve(await this.aliasHandler(req, res, alias));
          } else if (route.mappingPolicy == MAPPING_POLICY_RESTRICT) {
            // Blocking direct access
            return resolve(null);
          }

          if (!action) return resolve(null);

          // Not found alias, call services by action name
          action = action.replace(/\//g, '.');
          if (route.opts.camelCaseNames) {
            action = action.split('.').map(_.camelCase).join('.');
          }

          // Alias handler
          const result = await this.aliasHandler(req, res, {
            action,
            _notDefined: true,
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    },

    /**
     * Alias handler. Call action or call custom function
     * 	- check whitelist
     * 	- Rate limiter
     *  - Resolve endpoint
     *  - onBeforeCall
     *  - Authentication
     *  - Authorization
     *  - Call the action
     *
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Object} alias
     * @returns
     */
    async aliasHandler(req, res, alias) {
      const route = req.$route;
      const ctx = req.$ctx;

      // Whitelist check
      if (alias.action && route.hasWhitelist) {
        if (!this.checkWhitelist(route, alias.action)) {
          this.logger.debug(
            `  The '${alias.action}' action is not in the whitelist!`
          );
          throw new ServiceNotFoundError({ action: alias.action });
        }
      }

      // Rate limiter
      if (route.rateLimit) {
        const opts = route.rateLimit;
        const store = route.rateLimit.store;

        const key = opts.key(req);
        if (key) {
          const remaining = opts.limit - (await store.inc(key));
          if (opts.headers) {
            res.setHeader('X-Rate-Limit-Limit', opts.limit);
            res.setHeader('X-Rate-Limit-Remaining', Math.max(0, remaining));
            res.setHeader('X-Rate-Limit-Reset', store.resetTime);
          }
          if (remaining < 0) {
            throw new RateLimitExceeded();
          }
        }
      }

      // Resolve endpoint by action name
      if (alias.action) {
        const endpoint = this.broker.findNextActionEndpoint(
          alias.action,
          route.callOptions,
          ctx
        );
        if (endpoint instanceof Error) {
          if (!alias._notDefined && endpoint instanceof ServiceNotFoundError) {
            throw new ServiceUnavailableError();
          }

          throw endpoint;
        }

        if (
          endpoint.action.visibility != null &&
          endpoint.action.visibility != 'published'
        ) {
          // Action can't be published
          throw new ServiceNotFoundError({ action: alias.action });
        }

        req.$endpoint = endpoint;
        req.$action = endpoint.action;
      }

      // onBeforeCall handling
      if (route.onBeforeCall) {
        await route.onBeforeCall.call(this, ctx, route, req, res, alias);
      }

      // Authentication
      if (route.authentication) {
        const user = await route.authentication.call(
          this,
          ctx,
          route,
          req,
          res,
          alias
        );
        if (user) {
          this.logger.debug('Authenticated user', user);
          ctx.meta.user = user;
        } else {
          this.logger.debug('Anonymous user');
          ctx.meta.user = null;
        }
      }

      // Authorization
      if (route.authorization) {
        await route.authorization.call(this, ctx, route, req, res, alias);
      }

      // Call the action or alias
      if (_.isFunction(alias.handler)) {
        // Call custom alias handler
        if (
          route.logging &&
          this.settings.logRequest &&
          this.settings.logRequest in this.logger
        )
          this.logger[this.settings.logRequest](
            `   Call custom function in '${alias.toString()}' alias`
          );

        await new this.Promise((resolve, reject) => {
          alias.handler.call(this, req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        if (alias.action)
          return this.callAction(
            route,
            alias.action,
            req,
            res,
            alias.type == 'stream' ? req : req.$params
          );
        else
          throw new MoleculerServerError(
            'No alias handler',
            500,
            'NO_ALIAS_HANDLER',
            { path: req.originalUrl, alias: _.pick(alias, ['method', 'path']) }
          );
      } else if (alias.action) {
        return this.callAction(
          route,
          alias.action,
          req,
          res,
          alias.type == 'stream' ? req : req.$params
        );
      }
    },

    /**
     * Call an action via broker
     *
     * @param {Object} route 		Route options
     * @param {String} actionName 	Name of action
     * @param {HttpRequest} req 	Request object
     * @param {HttpResponse} res 	Response object
     * @param {Object} params		Incoming params from request
     * @returns {Promise}
     */
    async callAction(route, actionName, req, res, params) {
      const ctx = req.$ctx;

      try {
        // Logging params
        if (route.logging) {
          if (
            this.settings.logRequest &&
            this.settings.logRequest in this.logger
          )
            this.logger[this.settings.logRequest](
              `   Call '${actionName}' action`
            );
          if (
            this.settings.logRequestParams &&
            this.settings.logRequestParams in this.logger
          )
            this.logger[this.settings.logRequestParams]('   Params:', params);
        }

        // Pass the `req` & `res` vars to ctx.params.
        if (req.$alias && req.$alias.passReqResToParams) {
          params.$req = req;
          params.$res = res;
        }

        const opts = route.callOptions ? { ...route.callOptions } : {};
        if (params && params.$params) {
          // Transfer URL parameters via meta in case of stream
          if (!opts.meta) opts.meta = { $params: params.$params };
          else opts.meta.$params = params.$params;
        }

        // Call the action
        let data = await ctx.call(req.$endpoint, params, opts);

        // Post-process the response

        // onAfterCall handling
        if (route.onAfterCall)
          data = await route.onAfterCall.call(this, ctx, route, req, res, data);

        // Send back the response
        this.sendResponse(req, res, data, req.$endpoint.action);

        if (route.logging) this.logResponse(req, res, data);

        return true;
      } catch (err) {
        /* istanbul ignore next */
        if (!err) return; // Cancelling promise chain, no error

        throw err;
      }
    },

    /**
     * Encode response data
     *
     * @param {HttpIncomingMessage} req
     * @param {HttpResponse} res
     * @param {any} data
     */
    encodeResponse(req, res, data) {
      return JSON.stringify(data);
    },

    /**
     * Convert data & send back to client
     *
     * @param {HttpIncomingMessage} req
     * @param {HttpResponse} res
     * @param {any} data
     * @param {Object?} action
     */
    sendResponse(req, res, data: any, action) {
      const ctx = req.$ctx;
      const route = req.$route;

      /* istanbul ignore next */
      if (res.headersSent) {
        this.logger.warn('Headers have already sent.', {
          url: req.url,
          action,
        });
        return;
      }

      /* istanbul ignore next */
      if (!res.statusCode) res.statusCode = 200;

      // Status code & message
      if (ctx.meta.$statusCode) {
        res.statusCode = ctx.meta.$statusCode;
      }
      if (ctx.meta.$statusMessage) {
        res.statusMessage = ctx.meta.$statusMessage;
      }

      // Redirect
      if (
        res.statusCode == 201 ||
        (res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.statusCode !== 304)
      ) {
        const location = ctx.meta.$location;
        /* istanbul ignore next */
        if (!location) {
          this.logger.warn(
            `The 'ctx.meta.$location' is missing for status code '${res.statusCode}'!`
          );
        } else {
          res.setHeader('Location', location);
        }
      }

      // Override responseType from action schema
      let responseType;
      /* istanbul ignore next */
      if (action && action.responseType) {
        responseType = action.responseType;
      }

      // Custom headers from action schema
      /* istanbul ignore next */
      if (action && action.responseHeaders) {
        Object.keys(action.responseHeaders).forEach((key) => {
          res.setHeader(key, action.responseHeaders[key]);
          if (key == 'Content-Type' && !responseType)
            responseType = action.responseHeaders[key];
        });
      }

      // Custom responseType from ctx.meta
      if (ctx.meta.$responseType) {
        responseType = ctx.meta.$responseType;
      }

      // Custom headers from ctx.meta
      if (ctx.meta.$responseHeaders) {
        Object.keys(ctx.meta.$responseHeaders).forEach((key) => {
          if (key == 'Content-Type' && !responseType)
            responseType = ctx.meta.$responseHeaders[key];
          else res.setHeader(key, ctx.meta.$responseHeaders[key]);
        });
      }
      if (data == null) return res.end();

      let chunk;
      // Buffer
      if (Buffer.isBuffer(data)) {
        res.setHeader(
          'Content-Type',
          responseType || 'application/octet-stream'
        );
        res.setHeader('Content-Length', data.length);
        chunk = data;
      }
      // Buffer from Object
      else if (_.isObject(data) && (data as any).type == 'Buffer') {
        const buf = Buffer.from(data as any);
        res.setHeader(
          'Content-Type',
          responseType || 'application/octet-stream'
        );
        res.setHeader('Content-Length', buf.length);
        chunk = buf;
      }
      // Stream
      else if (isReadableStream(data)) {
        res.setHeader(
          'Content-Type',
          responseType || 'application/octet-stream'
        );
        chunk = data;
      }
      // Object or Array (stringify)
      else if (_.isObject(data) || Array.isArray(data)) {
        res.setHeader(
          'Content-Type',
          responseType || 'application/json; charset=utf-8'
        );
        chunk = this.encodeResponse(req, res, data);
      }
      // Other (stringify or raw text)
      else {
        if (!responseType) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          chunk = this.encodeResponse(req, res, data);
        } else {
          res.setHeader('Content-Type', responseType);
          if (_.isString(data)) chunk = data;
          else chunk = data.toString();
        }
      }

      // Auto generate & add ETag
      if (
        route.etag &&
        chunk &&
        !res.getHeader('ETag') &&
        !isReadableStream(chunk)
      ) {
        res.setHeader('ETag', generateETag.call(this, chunk, route.etag));
      }

      // Freshness
      if (isFresh(req, res)) res.statusCode = 304;

      if (res.statusCode === 204 || res.statusCode === 304) {
        res.removeHeader('Content-Type');
        res.removeHeader('Content-Length');
        res.removeHeader('Transfer-Encoding');

        chunk = '';
      }

      if (req.method === 'HEAD') {
        // skip body for HEAD
        res.end();
      } else {
        // respond
        if (isReadableStream(data)) {
          //Stream response
          data.pipe(res);
        } else {
          res.end(chunk);
        }
      }
    },

    /**
     * Middleware for ExpressJS
     *
     * @returns {Function}
     */
    express() {
      return (req, res, next) => this.httpHandler(req, res, next);
    },

    /**
     * Send 404 response
     *
     * @param {HttpIncomingMessage} req
     * @param {HttpResponse} res
     */
    send404(req, res) {
      if (req.$next) return req.$next();

      this.sendError(req, res, new NotFoundError());
    },

    /**
     * Send an error response
     *
     * @param {HttpIncomingMessage} req
     * @param {HttpResponse} res
     * @param {Error} err
     */
    sendError(req, res, err) {
      // Route error handler
      if (req.$route && _.isFunction(req.$route.onError))
        return req.$route.onError.call(this, req, res, err);

      // Global error handler
      if (_.isFunction(this.settings.onError))
        return this.settings.onError.call(this, req, res, err);

      // --- Default error handler

      // In middleware mode call the next(err)
      if (req.$next) return req.$next(err);

      /* istanbul ignore next */
      if (res.headersSent) {
        this.logger.warn('Headers have already sent', req.url, err);
        return;
      }

      /* istanbul ignore next */
      if (!err || !(err instanceof Error)) {
        res.writeHead(500);
        res.end('Internal Server Error');

        this.logResponse(req, res);
        return;
      }

      /* istanbul ignore next */
      if (!(err instanceof MoleculerError)) {
        const e = err as any;
        err = new MoleculerError(e.message, e.code || e.status, e.type, e.data);
        err.name = e.name;
      }

      const ctx = req.$ctx;
      let responseType = 'application/json; charset=utf-8';

      if (ctx) {
        if (ctx.meta.$responseType) {
          responseType = ctx.meta.$responseType;
        }
        if (ctx.meta.$responseHeaders) {
          Object.keys(ctx.meta.$responseHeaders).forEach((key) => {
            if (key === 'Content-Type' && !responseType)
              responseType = ctx.meta.$responseHeaders[key];
            else res.setHeader(key, ctx.meta.$responseHeaders[key]);
          });
        }
      }

      // Return with the error as JSON object
      res.setHeader('Content-type', responseType);

      const code =
        _.isNumber(err.code) && _.inRange(err.code, 400, 599) ? err.code : 500;
      res.writeHead(code);
      const errObj = this.reformatError(err, req, res);
      res.end(
        errObj !== undefined ? this.encodeResponse(req, res, errObj) : undefined
      );

      this.logResponse(req, res);
    },

    /**
		 * Reformatting the error object to response
		 * @param {Error} err
		 * @param {HttpIncomingMessage} req
		 * @param {HttpResponse} res
		 @returns {Object}
		 */
    reformatError(err /*, req, res*/) {
      return _.pick(err, ['name', 'message', 'code', 'type', 'data']);
    },

    /**
     * Send 302 Redirect
     *
     * @param {HttpResponse} res
     * @param {String} url
     * @param {Number} status code
     */
    sendRedirect(res, url, code = 302) {
      res.writeHead(code, {
        Location: url,
        'Content-Length': '0',
      });
      res.end();
      //this.logResponse(req, res);
    },

    /**
     * Split the URL and resolve vars from querystring
     *
     * @param {any} req
     * @returns
     */
    parseQueryString(req) {
      // Split URL & query params
      let url = req.url;
      let query = {};
      const questionIdx = req.url.indexOf('?', 1);
      if (questionIdx !== -1) {
        query = queryString.parse(req.url.substring(questionIdx + 1));
        url = req.url.substring(0, questionIdx);
      }
      return { query, url };
    },

    /**
     * Log the request
     *
     * @param {HttpIncomingMessage} req
     */
    logRequest(req) {
      if (req.$route && !req.$route.logging) return;

      if (this.settings.logRequest && this.settings.logRequest in this.logger)
        this.logger[this.settings.logRequest](`=> ${req.method} ${req.url}`);
    },

    /**
     * Return with colored status code
     *
     * @param {any} code
     * @returns
     */
    coloringStatusCode(code) {
      if (code >= 500) return kleur.red().bold(code);
      if (code >= 400 && code < 500) return kleur.red().bold(code);
      if (code >= 300 && code < 400) return kleur.cyan().bold(code);
      if (code >= 200 && code < 300) return kleur.green().bold(code);

      /* istanbul ignore next */
      return code;
    },

    /**
     * Log the response
     *
     * @param {HttpIncomingMessage} req
     * @param {HttpResponse} res
     * @param {any} data
     */
    logResponse(req, res, data) {
      if (req.$route && !req.$route.logging) return;

      let time = '';
      if (req.$startTime) {
        const diff = process.hrtime(req.$startTime);
        const duration = (diff[0] + diff[1] / 1e9) * 1000;
        if (duration > 1000)
          time = kleur.red(`[+${Number(duration / 1000).toFixed(3)} s]`);
        else time = kleur.grey(`[+${Number(duration).toFixed(3)} ms]`);
      }

      if (this.settings.logResponse && this.settings.logResponse in this.logger)
        this.logger[this.settings.logResponse](
          `<= ${this.coloringStatusCode(res.statusCode)} ${
            req.method
          } ${kleur.bold(req.originalUrl)} ${time}`
        );

      /* istanbul ignore next */
      if (
        this.settings.logResponseData &&
        this.settings.logResponseData in this.logger
      ) {
        this.logger[this.settings.logResponseData]('  Data:', data);
      }
    },

    /**
     * Check origin(s)
     *
     * @param {String} origin
     * @param {String|Array<String>} settings
     * @returns {Boolean}
     */
    checkOrigin(origin, settings) {
      if (_.isString(settings)) {
        if (settings.indexOf(origin) !== -1) return true;

        if (settings.indexOf('*') !== -1) {
          // Based on: https://github.com/hapijs/hapi
          // eslint-disable-next-line
          const wildcard = new RegExp(
            `^${_.escapeRegExp(settings)
              .replace(/\\\*/g, '.*')
              .replace(/\\\?/g, '.')}$`
          );
          return origin.match(wildcard);
        }
      } else if (_.isFunction(settings)) {
        return settings.call(this, origin);
      } else if (Array.isArray(settings)) {
        for (let i = 0; i < settings.length; i++) {
          if (this.checkOrigin(origin, settings[i])) {
            return true;
          }
        }
      }

      return false;
    },

    /**
     * Write CORS header
     *
     * Based on: https://github.com/expressjs/cors
     *
     * @param {Object} route
     * @param {HttpIncomingMessage} req
     * @param {HttpResponse} res
     * @param {Boolean} isPreFlight
     */
    writeCorsHeaders(route, req, res, isPreFlight) {
      /* istanbul ignore next */
      if (!route.cors) return;

      const origin = req.headers['origin'];
      // It's not presented, when it's a local request (origin and target same)
      if (!origin) return;

      // Access-Control-Allow-Origin
      if (!route.cors.origin || route.cors.origin === '*') {
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else if (this.checkOrigin(origin, route.cors.origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
      } else {
        throw new ForbiddenError(ERR_ORIGIN_NOT_ALLOWED);
      }

      // Access-Control-Allow-Credentials
      if (route.cors.credentials === true) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      // Access-Control-Expose-Headers
      if (_.isString(route.cors.exposedHeaders)) {
        res.setHeader(
          'Access-Control-Expose-Headers',
          route.cors.exposedHeaders
        );
      } else if (Array.isArray(route.cors.exposedHeaders)) {
        res.setHeader(
          'Access-Control-Expose-Headers',
          route.cors.exposedHeaders.join(', ')
        );
      }

      if (isPreFlight) {
        // Access-Control-Allow-Headers
        if (_.isString(route.cors.allowedHeaders)) {
          res.setHeader(
            'Access-Control-Allow-Headers',
            route.cors.allowedHeaders
          );
        } else if (Array.isArray(route.cors.allowedHeaders)) {
          res.setHeader(
            'Access-Control-Allow-Headers',
            route.cors.allowedHeaders.join(', ')
          );
        } else {
          // AllowedHeaders doesn't specified, so we send back from req headers
          const allowedHeaders = req.headers['access-control-request-headers'];
          if (allowedHeaders) {
            res.setHeader('Vary', 'Access-Control-Request-Headers');
            res.setHeader('Access-Control-Allow-Headers', allowedHeaders);
          }
        }

        // Access-Control-Allow-Methods
        if (_.isString(route.cors.methods)) {
          res.setHeader('Access-Control-Allow-Methods', route.cors.methods);
        } else if (Array.isArray(route.cors.methods)) {
          res.setHeader(
            'Access-Control-Allow-Methods',
            route.cors.methods.join(', ')
          );
        }

        // Access-Control-Max-Age
        if (route.cors.maxAge) {
          res.setHeader('Access-Control-Max-Age', route.cors.maxAge.toString());
        }
      }
    },

    /**
     * Check the action name in whitelist
     *
     * @param {Object} route
     * @param {String} action
     * @returns {Boolean}
     */
    checkWhitelist(route, action) {
      // Rewrite to for iterator (faster)
      return (
        route.whitelist.find((mask) => {
          if (_.isString(mask)) return match(action, mask);
          else if (_.isRegExp(mask)) return mask.test(action);
        }) != null
      );
    },

    /**
     * Resolve alias names
     *
     * @param {String} url
     * @param {string} [method="GET"]
     * @returns {Object} Resolved alas & params
     */
    resolveAlias(url, method = 'GET') {
      for (let i = 0; i < this.aliases.length; i++) {
        const alias = this.aliases[i];
        if (alias.isMethod(method)) {
          const params = alias.match(url);
          if (params) {
            return { alias, params };
          }
        }
      }
      return false;
    },

    /**
     * Add & prepare route from options
     * @param {Object} opts
     * @param {Boolean} [toBottom=true]
     */
    addRoute(opts, toBottom = true) {
      const route = this.createRoute(opts);
      const idx = this.routes.findIndex((r) => this.isEqualRoutes(r, route));
      if (idx !== -1) {
        // Replace the previous
        this.routes[idx] = route;
      } else {
        // Add new route
        if (toBottom) this.routes.push(route);
        else this.routes.unshift(route);

        // Reordering routes
        if (this.settings.optimizeOrder) this.optimizeRouteOrder();
      }

      return route;
    },

    /**
     * Remove a route by path
     * @param {String} path
     */
    removeRoute(path) {
      const idx = this.routes.findIndex((r) => r.opts.path == path);
      if (idx !== -1) {
        const route = this.routes[idx];

        // Clean global aliases for this route
        this.aliases = this.aliases.filter((a) => a.route != route);

        // Remote route
        this.routes.splice(idx, 1);

        return true;
      }
      return false;
    },

    /**
     * Remove a route by name
     * @param {String} name
     */
    removeRouteByName(name) {
      const idx = this.routes.findIndex((r) => r.opts.name == name);
      if (idx !== -1) {
        const route = this.routes[idx];

        // Clean global aliases for this route
        this.aliases = this.aliases.filter((a) => a.route != route);

        // Remote route
        this.routes.splice(idx, 1);

        return true;
      }
      return false;
    },

    /**
     * Optimize route order by route path depth
     */
    optimizeRouteOrder() {
      this.routes.sort((a, b) => {
        let c =
          addSlashes(b.path).split('/').length -
          addSlashes(a.path).split('/').length;
        if (c == 0) {
          // Second level ordering (considering URL params)
          c = a.path.split(':').length - b.path.split(':').length;
        }

        return c;
      });

      this.logger.debug(
        'Optimized path order: ',
        this.routes.map((r) => r.path)
      );
    },

    /**
     * Create route object from options
     *
     * @param {Object} opts
     * @returns {Object}
     */
    createRoute(opts) {
      this.logRouteRegistration(`Register route to '${opts.path}'`);
      const route: any = {
        name: opts.name,
        opts,
        middlewares: [],
      };
      if (opts.authorization) {
        let fn = this.authorize;
        if (_.isString(opts.authorization)) fn = this[opts.authorization];

        if (!_.isFunction(fn)) {
          this.logger.warn(
            "Define 'authorize' method in the service to enable authorization."
          );
          route.authorization = null;
        } else route.authorization = fn;
      }
      if (opts.authentication) {
        let fn = this.authenticate;
        if (_.isString(opts.authentication)) fn = this[opts.authentication];

        if (!_.isFunction(fn)) {
          this.logger.warn(
            "Define 'authenticate' method in the service to enable authentication."
          );
          route.authentication = null;
        } else route.authentication = fn;
      }

      // Call options
      route.callOptions = opts.callOptions;

      // Create body parsers as middlewares
      if (opts.bodyParsers == null || opts.bodyParsers === true) {
        // Set default JSON body-parser
        opts.bodyParsers = {
          json: true,
        };
      }
      if (opts.bodyParsers) {
        const bps = opts.bodyParsers;
        Object.keys(bps).forEach((key) => {
          const opts = _.isObject(bps[key]) ? bps[key] : undefined;
          if (bps[key] !== false && key in bodyParser)
            route.middlewares.push(bodyParser[key](opts));
        });
      }

      // Logging
      route.logging = opts.logging != null ? opts.logging : true;

      // ETag
      route.etag = opts.etag != null ? opts.etag : this.settings.etag;

      // Middlewares
      const mw: any[] = [];
      if (
        this.settings.use &&
        Array.isArray(this.settings.use) &&
        this.settings.use.length > 0
      )
        mw.push(...this.settings.use);

      if (opts.use && Array.isArray(opts.use) && opts.use.length > 0)
        mw.push(...opts.use);

      if (mw.length > 0) {
        route.middlewares.push(...mw);
        this.logRouteRegistration(`  Registered ${mw.length} middlewares.`);
      }

      // CORS
      if (this.settings.cors || opts.cors) {
        // Merge cors settings
        route.cors = Object.assign(
          {},
          {
            origin: '*',
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
          },
          this.settings.cors,
          opts.cors
        );
      } else {
        route.cors = null;
      }

      // Rate limiter (Inspired by https://github.com/dotcypress/micro-ratelimit/)
      const rateLimit = opts.rateLimit || this.settings.rateLimit;
      if (rateLimit) {
        const opts = Object.assign(
          {},
          {
            window: 60 * 1000,
            limit: 30,
            headers: false,
            key: (req) => {
              return (
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress
              );
            },
          },
          rateLimit
        );

        route.rateLimit = opts;

        if (opts.StoreFactory) {
          route.rateLimit.store = new opts.StoreFactory(
            opts.window,
            opts,
            this.broker
          );
        } else {
          route.rateLimit.store = new MemoryStore(opts.window);
        }
      }

      // Handle whitelist
      route.whitelist = opts.whitelist;
      route.hasWhitelist = Array.isArray(route.whitelist);

      // `onBeforeCall` handler
      if (opts.onBeforeCall) route.onBeforeCall = opts.onBeforeCall;

      // `onAfterCall` handler
      if (opts.onAfterCall) route.onAfterCall = opts.onAfterCall;

      // `onError` handler
      if (opts.onError) route.onError = opts.onError;

      // Create URL prefix
      const globalPath =
        this.settings.path && this.settings.path != '/'
          ? this.settings.path
          : '';
      route.path = addSlashes(globalPath) + (opts.path || '');
      route.path = normalizePath(route.path);

      // Create aliases
      this.createRouteAliases(route, opts.aliases);

      // Optimize aliases order
      if (this.settings.optimizeOrder) {
        this.optimizeAliasesOrder();
      }

      // Set alias mapping policy
      route.mappingPolicy = opts.mappingPolicy;
      if (!route.mappingPolicy) {
        const hasAliases =
          _.isObject(opts.aliases) && Object.keys(opts.aliases).length > 0;
        route.mappingPolicy =
          hasAliases || opts.autoAliases
            ? MAPPING_POLICY_RESTRICT
            : MAPPING_POLICY_ALL;
      }

      this.logRouteRegistration('');

      return route;
    },

    /**
     * Create all aliases for route.
     *
     * @param {Object} route
     * @param {Object} aliases
     */
    createRouteAliases(route, aliases) {
      // Clean previous aliases for this route
      this.aliases = this.aliases.filter(
        (a) => !this.isEqualRoutes(a.route, route)
      );

      // Process aliases definitions from route settings
      _.forIn(aliases, (action, matchPath) => {
        if (matchPath.startsWith('REST ')) {
          this.aliases.push(
            ...this.generateRESTAliases(route, matchPath, action)
          );
        } else {
          this.aliases.push(this.createAlias(route, matchPath, action));
        }
      });

      if (route.opts.autoAliases) {
        this.regenerateAutoAliases(route);
      }
    },

    /**
     * Checks whether the routes are same.
     *
     * @param {Object} routeA
     * @param {Object} routeB
     * @returns {Boolean}
     */
    isEqualRoutes(routeA, routeB) {
      if (routeA.name != null && routeB.name != null) {
        return routeA.name === routeB.name;
      }
      return routeA.path === routeB.path;
    },

    /**
     * Generate aliases for REST.
     *
     * @param {Route} route
     * @param {String} path
     * @param {*} action
     *
     * @returns Array<Alias>
     */
    generateRESTAliases(route, path, action) {
      const p = path.split(/\s+/);
      const pathName = p[1];
      const pathNameWithoutEndingSlash = pathName.endsWith('/')
        ? pathName.slice(0, -1)
        : pathName;
      const aliases = {
        list: `GET ${pathName}`,
        get: `GET ${pathNameWithoutEndingSlash}/:id`,
        create: `POST ${pathName}`,
        update: `PUT ${pathNameWithoutEndingSlash}/:id`,
        patch: `PATCH ${pathNameWithoutEndingSlash}/:id`,
        remove: `DELETE ${pathNameWithoutEndingSlash}/:id`,
      };
      let actions = ['list', 'get', 'create', 'update', 'patch', 'remove'];

      if (typeof action !== 'string' && (action.only || action.except)) {
        if (action.only) {
          actions = actions.filter((item) => action.only.includes(item));
        }

        if (action.except) {
          actions = actions.filter((item) => !action.except.includes(item));
        }

        action = action.action;
      }

      return actions.map((item) =>
        this.createAlias(route, aliases[item], `${action}.${item}`)
      );
    },

    /**
     * Regenerate aliases automatically if service registry has been changed.
     *
     * @param {Route} route
     */
    regenerateAutoAliases(route) {
      this.logRouteRegistration(
        `♻ Generate aliases for '${route.path}' route...`
      );

      // Clean previous aliases for this route
      this.aliases = this.aliases.filter(
        (alias) => alias.route != route || !alias._generated
      );

      const processedServices = new Set();

      const services = this.broker.registry.getServiceList({
        withActions: true,
        grouping: true,
      });
      services.forEach((service) => {
        if (!service.settings) return;
        const serviceName = service.fullName || getServiceFullname(service);

        let basePaths = [];
        if (_.isString(service.settings.rest)) {
          basePaths = [service.settings.rest];
        } else if (_.isArray(service.settings.rest)) {
          basePaths = service.settings.rest;
        } else {
          basePaths = [serviceName.replace(SLASH_REGEX, '/')];
        }

        // Skip multiple instances of services
        if (processedServices.has(serviceName)) return;

        for (let basePath of basePaths) {
          basePath = addSlashes(
            _.isString(basePath)
              ? basePath
              : serviceName.replace(SLASH_REGEX, '/')
          );

          _.forIn(service.actions, (action) => {
            if (action.rest) {
              // Check visibility
              if (action.visibility != null && action.visibility != 'published')
                return;

              // Check whitelist
              if (
                route.hasWhitelist &&
                !this.checkWhitelist(route, action.name)
              )
                return;

              let restRoutes = [];
              if (!_.isArray(action.rest)) {
                restRoutes = [action.rest];
              } else {
                restRoutes = action.rest;
              }

              for (const restRoute of restRoutes) {
                let alias = null;

                if (_.isString(restRoute)) {
                  alias = this.parseActionRestString(restRoute, basePath);
                } else if (_.isObject(restRoute)) {
                  alias = this.parseActionRestObject(
                    restRoute,
                    action.rawName,
                    basePath
                  );
                }

                if (alias) {
                  alias.path = removeTrailingSlashes(normalizePath(alias.path));
                  alias._generated = true;
                  this.aliases.push(
                    this.createAlias(route, alias, action.name)
                  );
                }
              }
            }

            processedServices.add(serviceName);
          });
        }
      });

      if (this.settings.optimizeOrder) {
        this.optimizeAliasesOrder();
      }
    },

    /**
     *
     */
    parseActionRestString(restRoute, basePath) {
      if (restRoute.indexOf(' ') !== -1) {
        // Handle route: "POST /import"
        const p = restRoute.split(/\s+/);
        return {
          method: p[0],
          path: basePath + p[1],
        };
      }
      // Handle route: "/import". In this case apply to all methods as "* /import"
      return {
        method: '*',
        path: basePath + restRoute,
      };
    },

    /**
     *
     */
    parseActionRestObject(restRoute, rawName, basePath) {
      // Handle route: { method: "POST", path: "/other", basePath: "newBasePath" }
      return Object.assign({}, restRoute, {
        method: restRoute.method || '*',
        path:
          (restRoute.basePath ? restRoute.basePath : basePath) +
          (restRoute.path ? restRoute.path : rawName),
      });
    },

    /**
     * Optimize order of alias path.
     */
    optimizeAliasesOrder() {
      this.aliases.sort((a, b) => {
        let c =
          addSlashes(b.path).split('/').length -
          addSlashes(a.path).split('/').length;
        if (c == 0) {
          // Second level ordering (considering URL params)
          c = a.path.split(':').length - b.path.split(':').length;
        }

        if (c == 0) {
          c = a.path.localeCompare(b.path);
        }

        return c;
      });
    },

    /**
     * Create alias for route.
     *
     * @param {Object} route
     * @param {String|Object} matchPath
     * @param {String|Object} action
     */
    createAlias(route, path, action) {
      const alias = new Alias(this, route, path, action);
      this.logRouteRegistration('  ' + alias.toString());
      return alias;
    },

    /**
     * Set log level and log registration route related activities
     *
     * @param {*} message
     */
    logRouteRegistration(message) {
      if (
        this.settings.logRouteRegistration &&
        this.settings.logRouteRegistration in this.logger
      )
        this.logger[this.settings.logRouteRegistration](message);
    },
  },

  events: {
    '$services.changed'() {
      this.regenerateAllAutoAliases();
    },
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    if (this.settings.server !== false) {
      if (_.isObject(this.settings.server)) {
        // Use an existing server instance
        this.server = this.settings.server;
      } else {
        // Create a new HTTP/HTTPS/HTTP2 server instance
        this.createServer();
      }

      /* istanbul ignore next */
      this.server.on('error', (err) => {
        this.logger.error('Server error', err);
      });

      this.logger.info('API Gateway server created.');
    }

    // Special char for internal services
    const specChar =
      this.settings.internalServiceSpecialChar != null
        ? this.settings.internalServiceSpecialChar
        : '~';
    this._isscRe = new RegExp(specChar);

    // Create static server middleware
    if (this.settings.assets) {
      const opts = this.settings.assets.options || {};
      this.serve = serveStatic(this.settings.assets.folder, opts);
    }

    // Alias store
    this.aliases = [];

    // Add default route
    if (
      Array.isArray(this.settings.routes) &&
      this.settings.routes.length == 0
    ) {
      this.settings.routes = [
        {
          path: '/',
        },
      ];
    }

    // Process routes
    this.routes = [];
    if (Array.isArray(this.settings.routes))
      this.settings.routes.forEach((route) => this.addRoute(route));

    // Regenerate all auto aliases routes
    const debounceTime =
      this.settings.debounceTime > 0
        ? parseInt(this.settings.debounceTime)
        : 500;
    this.regenerateAllAutoAliases = _.debounce(() => {
      /* istanbul ignore next */
      this.routes.forEach(
        (route) => route.opts.autoAliases && this.regenerateAutoAliases(route)
      );

      this.broker.broadcast('$api.aliases.regenerated');
    }, debounceTime);
  },

  /**
   * Service started lifecycle event handler
   */
  started() {
    if (this.settings.server === false) return this.Promise.resolve();

    /* istanbul ignore next */
    return new this.Promise((resolve, reject) => {
      this.server.listen(this.settings.port, this.settings.ip, (err) => {
        if (err) return reject(err);

        const addr = this.server.address();
        const listenAddr =
          addr.address == '0.0.0.0' && os.platform() == 'win32'
            ? 'localhost'
            : addr.address;
        this.logger.info(
          `API Gateway listening on ${
            this.isHTTPS ? 'https' : 'http'
          }://${listenAddr}:${addr.port}`
        );
        resolve();
      });
    });
  },

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {
    if (this.settings.server !== false && this.server.listening) {
      /* istanbul ignore next */
      return new this.Promise((resolve, reject) => {
        this.server.close((err) => {
          if (err) return reject(err);

          this.logger.info('API Gateway stopped!');
          resolve();
        });
      });
    }

    return this.Promise.resolve();
  },

  bodyParser,
  serveStatic,

  Errors: require('./errors'),
  RateLimitStores: {
    MemoryStore: require('./memory-store'),
  },
};
