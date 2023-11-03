'use strict';
import type {
  BrokerOptions,
  CallingOptions,
  Errors,
  ServiceBroker,
} from 'moleculer';
import type { UserJWTPayload } from '../services/types';
import moment from 'moment';
import kleur from 'kleur';
import { config } from '../services/lib/settings';
import 'moleculer-repl';

/**
 * Moleculer ServiceBroker configuration file
 *
 * More info about options:
 *     https://moleculer.services/docs/0.14/configuration.html
 *
 *
 * Overwriting options in production:
 * ================================
 *    You can overwrite any option with environment variables.
 *    For example to overwrite the "logLevel" value, use `LOGLEVEL=warn` env var.
 *    To overwrite a nested parameter, e.g. retryPolicy.retries, use `RETRYPOLICY_RETRIES=10` env var.
 *
 *    To overwrite broker’s deeply nested default options, which are not presented in "moleculer.config.js",
 *    use the `MOL_` prefix and double underscore `__` for nested properties in .env file.
 *    For example, to set the cacher prefix to `MYCACHE`, you should declare an env var as `MOL_CACHER__OPTIONS__PREFIX=mycache`.
 *  It will set this:
 *  {
 *    cacher: {
 *      options: {
 *        prefix: "mycache"
 *      }
 *    }
 *  }
 */
export const defaultBrokerConfig: BrokerOptions = {
  // Namespace of nodes to segment your nodes on the same network.
  namespace: 'tailchat',
  // Unique node identifier. Must be unique in a namespace.
  nodeID: undefined,
  // Custom metadata store. Store here what you want. Accessing: `this.broker.metadata`
  metadata: {},

  // Enable/disable logging or use custom logger. More info: https://moleculer.services/docs/0.14/logging.html
  // Available logger types: "Console", "File", "Pino", "Winston", "Bunyan", "debug", "Log4js", "Datadog"
  logger: [
    {
      type: 'Console',
      options: {
        // Using colors on the output
        colors: true,
        // Print module names with different colors (like docker-compose for containers)
        moduleColors: false,
        // Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
        // formatter: 'full',
        formatter(type, args, bindings, { printArgs }) {
          return [
            kleur.grey(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`),
            `${this.levelColorStr[type]}`,
            ...printArgs(args),
          ];
        },
        // Custom object printer. If not defined, it uses the `util.inspect` method.
        objectPrinter: null,
        // Auto-padding the module name in order to messages begin at the same column.
        autoPadding: false,
      },
    },
    {
      type: 'File',
      options: {
        level: {
          GATEWAY: 'debug',
          '**': false,
        },
        filename: 'gateway-{nodeID}.log',
      },
    },
    {
      type: 'File',
      options: {
        level: {
          GATEWAY: false,
          '**': 'debug',
        },
        filename: '{date}-{nodeID}.log',
      },
    },
  ],
  // Default log level for built-in console logger. It can be overwritten in logger options above.
  // Available values: trace, debug, info, warn, error, fatal
  logLevel: 'info',

  // Define transporter.
  // More info: https://moleculer.services/docs/0.14/networking.html
  // Note: During the development, you don't need to define it because all services will be loaded locally.
  // In production you can set it via `TRANSPORTER=nats://localhost:4222` environment variable.
  transporter: undefined, // "process.env.TRANSPORTER"

  // Define a cacher.
  // More info: https://moleculer.services/docs/0.14/caching.html
  cacher: {
    type: 'Redis',
    options: {
      // Prefix for keys
      prefix: 'TC',
      // Redis settings
      redis: config.redisUrl,
    },
  },

  // Define a serializer.
  // Available values: "JSON", "Avro", "ProtoBuf", "MsgPack", "Notepack", "Thrift".
  // More info: https://moleculer.services/docs/0.14/networking.html#Serialization
  serializer: 'JSON',

  // Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
  requestTimeout: config.runner.requestTimeout,

  // Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
  retryPolicy: {
    // Enable feature
    enabled: false,
    // Count of retries
    retries: 5,
    // First delay in milliseconds.
    delay: 100,
    // Maximum delay in milliseconds.
    maxDelay: 1000,
    // Backoff factor for delay. 2 means exponential backoff.
    factor: 2,
    // A function to check failed requests.
    check: ((err: Errors.MoleculerError) => err && !!err.retryable) as any,
  },

  // Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
  maxCallLevel: 100,

  // Number of seconds to send heartbeat packet to other nodes.
  heartbeatInterval: 10,
  // Number of seconds to wait before setting node to unavailable status.
  heartbeatTimeout: 30,

  // Cloning the params of context if enabled. High performance impact, use it with caution!
  contextParamsCloning: false,

  // Tracking requests and waiting for running requests before shuting down. More info: https://moleculer.services/docs/0.14/context.html#Context-tracking
  tracking: {
    // Enable feature
    enabled: false,
    // Number of milliseconds to wait before shuting down the process.
    shutdownTimeout: 5000,
  },

  // Disable built-in request & emit balancer. (Transporter must support it, as well.). More info: https://moleculer.services/docs/0.14/networking.html#Disabled-balancer
  disableBalancer: false,

  // Settings of Service Registry. More info: https://moleculer.services/docs/0.14/registry.html
  registry: {
    // Define balancing strategy. More info: https://moleculer.services/docs/0.14/balancing.html
    // Available values: "RoundRobin", "Random", "CpuUsage", "Latency", "Shard"
    strategy: 'RoundRobin',
    // Enable local action call preferring. Always call the local action instance if available.
    preferLocal: true,
  },

  // Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
  circuitBreaker: {
    // Enable feature
    enabled: false,
    // Threshold value. 0.5 means that 50% should be failed for tripping.
    threshold: 0.5,
    // Minimum request count. Below it, CB does not trip.
    minRequestCount: 20,
    // Number of seconds for time window.
    windowTime: 60,
    // Number of milliseconds to switch from open to half-open state
    halfOpenTime: 10 * 1000,
    // A function to check failed requests.
    check: ((err: Errors.MoleculerError) => err && err.code >= 500) as any,
  },

  // Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
  bulkhead: {
    // Enable feature.
    enabled: false,
    // Maximum concurrent executions.
    concurrency: 10,
    // Maximum size of queue
    maxQueueSize: 100,
  },

  // Enable action & event parameter validation. More info: https://moleculer.services/docs/0.14/validating.html
  validator: true,

  errorHandler: undefined,

  // Enable/disable built-in metrics function. More info: https://moleculer.services/docs/0.14/metrics.html
  metrics: {
    enabled: config.enablePrometheus,
    // Available built-in reporters: "Console", "CSV", "Event", "Prometheus", "Datadog", "StatsD"
    reporter: [
      {
        type: 'Prometheus',
        options: {
          // HTTP port
          port: 13030,
          // HTTP URL path
          path: '/metrics',
          // Default labels which are appended to all metrics labels
          defaultLabels: (registry) => ({
            namespace: registry.broker.namespace,
            nodeID: registry.broker.nodeID,
          }),
        },
      },
    ],
  },

  // Enable built-in tracing function. More info: https://moleculer.services/docs/0.14/tracing.html
  tracing: {
    enabled: true,
    // Available built-in exporters: "Console", "Datadog", "Event", "EventLegacy", "Jaeger", "Zipkin"
    exporter: {
      type: 'Console', // Console exporter is only for development!
      options: {
        // Custom logger
        logger: null,
        // Using colors
        colors: true,
        // Width of row
        width: 100,
        // Gauge width in the row
        gaugeWidth: 40,
      },
    },
  },

  // Register custom middlewares
  middlewares: [],

  // Register custom REPL commands.
  // Reference: https://moleculer.services/docs/0.14/moleculer-repl.html#Custom-commands
  replDelimiter: 'tc $',
  replCommands: [
    {
      // NOTICE: 这个方法不要在原始上下文中使用，会造成其他用户使用不正常(登录成功后会拦截所有的call函数)
      command: 'login',
      description: 'Auto login or register tailchat user for cli test',
      options: [{ option: '-u, --username', description: 'Username' }],
      alias: null,
      allowUnknownOptions: null,
      parse: null,
      action(broker: ServiceBroker, args) {
        const username = args.options.username ?? 'localtest';
        const password = 'localtest';
        console.log(`开始尝试登录测试账号 ${username}`);
        return broker
          .call('user.login', { username, password })
          .catch((err) => {
            if (err.name === 'EntityError') {
              // 未注册
              console.log('正在注册新的测试账号');
              return broker.call('user.register', { username, password });
            }

            console.error('未知的错误:', err);
          })
          .then((user: any) => {
            const token = user.token;
            const userId = user._id;
            const originCall = broker.call.bind(broker);

            console.log('登录成功');
            console.log('> userId:', userId);
            console.log('> token:', token);

            (broker.call as any) = function (
              actionName: string,
              params: unknown,
              opts?: CallingOptions
            ): Promise<unknown> {
              return originCall(actionName, params, {
                ...opts,
                meta: {
                  ...(opts.meta ?? {}),
                  user: {
                    _id: userId,
                    nickname: user.nickname,
                    email: user.email,
                    avatar: user.avatar,
                  } as UserJWTPayload,
                  token,
                  userId,
                },
              });
            };
          });
      },
    },
  ],
  /*
	// Called after broker created.
	created : (broker: ServiceBroker): void => {},
	// Called after broker started.
	started: async (broker: ServiceBroker): Promise<void> => {},
	stopped: async (broker: ServiceBroker): Promise<void> => {},
	 */
};
