import Shepherd from 'shepherd.js';

function buildWatchDom(selector: string) {
  return () => {
    return new Promise<void>((resolve) => {
      const findDom = () => {
        if (document.querySelector(selector)) {
          resolve();
        } else {
          setTimeout(() => {
            findDom();
          }, 200);
        }
      };

      findDom();
    });
  };
}

function buildStepOption(options: {
  id: string;
  text: string;
  selector: string;
  position?: Shepherd.Step.StepOptions['attachTo']['on'];
  canClickTarget?: boolean;
}): Shepherd.Step.StepOptions {
  return {
    id: options.id,
    text: options.text,
    attachTo: {
      element: options.selector,
      on: options.position ?? 'auto',
    },
    canClickTarget: false,
    beforeShowPromise: buildWatchDom(options.selector),
  };
}

export const steps: Shepherd.Step.StepOptions[] = [
  {
    id: 'start',
    text: '欢迎使用 Tailchat, 一个插件化的开源IM应用',
    beforeShowPromise: buildWatchDom('[data-tc-role=navbar]'), // 仅当主界面出现后才显示欢迎
  },
  buildStepOption({
    id: 'navbar',
    text: '这是导航栏, 在这里可以切换tailchat的各个主要页面',
    selector: '[data-tc-role=navbar]',
    position: 'right',
  }),
  buildStepOption({
    id: 'personal',
    text: '这是个人信息，在这里可以管理您的好友、插件、以及私信',
    selector: '[data-tc-role=navbar-personal]',
    position: 'right',
  }),
  buildStepOption({
    id: 'groups',
    text: '这是群组列表, 会显示所有已加入的群组，您可以通过点击切换切换群组，也可以点击 + 号按钮来创建群组',
    selector: '[data-tc-role=navbar-groups]',
    position: 'right',
  }),
  buildStepOption({
    id: 'settings',
    text: '这是设置按钮，可以通过此按钮来进行个人信息的变更、系统设置的变更、软件信息等内容',
    selector: '[data-tc-role=navbar-settings]',
    position: 'right',
  }),
  buildStepOption({
    id: 'sidebar',
    text: '这是侧边栏，用于切换内容',
    selector: '[data-tc-role^=sidebar-]',
    position: 'right',
  }),
  buildStepOption({
    id: 'content',
    text: '这是内容区，用于显示主要内容',
    selector: '[data-tc-role^=content-]',
    position: 'right',
  }),
];
