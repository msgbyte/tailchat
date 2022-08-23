import blessed from 'neo-blessed';
import execa from 'execa';
import path from 'path';

/**
 * WIP: 终端管理器
 */

class TailchatServiceDashboard {
  screen: blessed.Widgets.Screen;
  mainBox: blessed.Widgets.BoxElement;
  mainProcess: execa.ExecaChildProcess<string>;

  constructor() {
    this.initElement();
  }

  initElement() {
    this.screen = blessed.screen({
      smartCSR: true,
    });
    this.screen.title = 'my window title';

    this.mainBox = blessed.box({
      top: 0,
      left: 'center',
      width: '100%',
      height: '80%',
      content: 'Hello {bold}world{/bold}!',
      tags: true,
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        border: {
          fg: '#f0f0f0',
        },
      },
      scrollable: true,
    });
    this.screen.append(this.mainBox);

    // Quit on Escape, q, or Control-C.
    this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
      this.mainProcess.kill(0);
      return process.exit(0);
    });

    this.mainBox.focus();
    this.screen.render();
  }

  start() {
    const child = execa('ts-node', ['./runner.ts'], {
      cwd: path.resolve(__dirname, '../'),
    });
    child.stdout.on('data', (data) => {
      this.mainBox.insertBottom(String(data));
      this.screen.render();
    });
    child.stderr.on('data', (data) => {
      this.mainBox.pushLine(String(data));
      this.screen.render();
    });

    this.mainProcess = child;
  }
}

new TailchatServiceDashboard().start();
