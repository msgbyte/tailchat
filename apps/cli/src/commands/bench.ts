import { CommandModule } from 'yargs';
import { TcBroker } from 'tailchat-server-sdk';
import defaultBrokerConfig from 'tailchat-server-sdk/dist/runner/moleculer.config';
import { config } from 'dotenv';
import _ from 'lodash';
import os from 'os';
import pAll from 'p-all';
import pSeries from 'p-series';
import ora from 'ora';
import prettyMs from 'pretty-ms';
import filesize from 'filesize';

export const benchCommand: CommandModule = {
  command: 'bench',
  describe: 'Benchmark',
  builder: (yargs) =>
    yargs
      .command(
        'message',
        'Stress testing through Tailchat network requests (suitable for pure business testing)',
        (yargs) =>
          yargs
            .option('groupId', {
              describe: 'Group ID',
              demandOption: true,
              type: 'string',
            })
            .option('converseId', {
              describe: 'Converse ID',
              demandOption: true,
              type: 'string',
            })
            .option('userId', {
              describe: 'User ID',
              demandOption: true,
              type: 'string',
            })
            .option('num', {
              describe: 'Test Num',
              type: 'number',
              default: 100,
            })
            .option('parallel', {
              describe: 'Is Parallel',
              type: 'boolean',
              default: false,
            })
            .option('parallelLimit', {
              describe: 'Parallel Limit',
              type: 'number',
              default: Infinity,
            }),

        async (args) => {
          config(); // 加载环境变量

          const broker = new TcBroker({
            ...defaultBrokerConfig,
            transporter: process.env.TRANSPORTER,
            logger: false,
          });
          await broker.start();

          printSystemInfo();

          console.log('===============');

          await startBenchmark<number>({
            parallel: args.parallel,
            parallelLimit: args.parallelLimit,
            number: args.num,
            task: async (i) => {
              const start = process.hrtime();
              await broker.call(
                'chat.message.sendMessage',
                {
                  converseId: args.converseId,
                  groupId: args.groupId,
                  content: `benchmessage ${i + 1}`,
                },
                {
                  meta: {
                    userId: args.userId,
                  },
                }
              );
              const usage = calcUsage(start);

              return usage;
            },
            onCompleted: (res) => {
              console.log(`Test Num: \t${res.length}`);
              console.log(`Max Usage: \t${prettyMs(Math.max(...res, 0))}`);
              console.log(`Min Usage: \t${prettyMs(Math.min(...res, 0))}`);
              console.log(`Average time: \t${prettyMs(_.mean(res))}`);
            },
          });

          await broker.stop();
        }
      )
      .demandCommand(),
  handler() {},
};

/**
 * 打印系统信息
 */
function printSystemInfo() {
  console.log(`Host: \t${os.hostname()}`);
  console.log(`System: \t${os.type()} - ${os.release()}`);
  console.log(`Architecture: \t${os.arch()} - ${os.version()}`);
  console.log(`CPU: \t${os.cpus().length}`);
  console.log(`Memory: \t${filesize(os.totalmem(), { base: 2 })}`);
}

function calcUsage(startTime: [number, number]) {
  const diff = process.hrtime(startTime);
  const usage = (diff[0] + diff[1] / 1e9) * 1000;

  return usage;
}

interface BenchmarkOptions<T> {
  parallel: boolean; // 是否并发
  parallelLimit?: number; // 并发上限, 默认不限制(Infinity)
  task: (index: number) => Promise<T>;
  number?: number;
  onCompleted: (res: T[]) => void;
}
/**
 * 开始一次基准测试
 */
async function startBenchmark<T>(options: BenchmarkOptions<T>) {
  const {
    parallel,
    parallelLimit = Infinity,
    task,
    number = 100,
    onCompleted,
  } = options;

  const spinner = ora();

  spinner.info(
    `Test mode: ${
      parallel ? `parallel, parallel limit ${parallelLimit}` : `serial`
    }`
  );
  spinner.info(`Number of tasks to execute: ${number}`);
  spinner.start('Benchmark in progress...');
  try {
    const startTime = process.hrtime();
    let res: (T | false)[] = [];
    if (parallel) {
      res = await pAll<T | false>(
        [
          ...Array.from({ length: number }).map(
            (_, i) => () => task(i).catch(() => false as const)
          ),
        ],
        {
          concurrency: parallelLimit,
        }
      );
    } else {
      res = await pSeries<T | false>([
        ...Array.from({ length: number }).map(
          (_, i) => () => task(i).catch(() => false as const)
        ),
      ]);
    }

    const allUsage = calcUsage(startTime);
    const succeed = res.filter((i): i is T => Boolean(i));
    const failed = res.filter((i) => !Boolean(i));
    spinner.succeed(`Benchmarking is complete, usage: ${prettyMs(allUsage)}`);
    console.log(`Success/Failed: ${succeed.length}/${failed.length}`);
    console.log(`TPS: ${res.length / (allUsage / 1000)}`);

    onCompleted(succeed);
  } catch (err) {
    console.error(err);
    spinner.fail(`A problem with benchmarking`).stop();
  }
}
