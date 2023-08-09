import Shepherd from 'shepherd.js';
import { Translate } from './translate';

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
      on: options.position,
    },
    canClickTarget: false,
    beforeShowPromise: buildWatchDom(options.selector),
  };
}

export const steps: Shepherd.Step.StepOptions[] = [
  {
    id: 'start',
    text: Translate.step1,
    beforeShowPromise: buildWatchDom('[data-tc-role=navbar]'), // 仅当主界面出现后才显示欢迎
  },
  buildStepOption({
    id: 'navbar',
    text: Translate.step2,
    selector: '[data-tc-role=navbar]',
    position: 'right',
  }),
  buildStepOption({
    id: 'personal',
    text: Translate.step3,
    selector: '[data-tc-role=navbar-personal]',
    position: 'right',
  }),
  buildStepOption({
    id: 'groups',
    text: Translate.step4,
    selector: '[data-tc-role=navbar-groups]',
    position: 'right',
  }),
  buildStepOption({
    id: 'settings',
    text: Translate.step5,
    selector: '[data-tc-role=navbar-settings]',
    position: 'right',
  }),
  buildStepOption({
    id: 'sidebar',
    text: Translate.step6,
    selector: '[data-tc-role^=sidebar-]',
    position: 'right',
  }),
  buildStepOption({
    id: 'content',
    text: Translate.step7,
    selector: '[data-tc-role^=content-]',
    position: 'right',
  }),
  {
    id: 'end',
    text: Translate.step8,
  },
];
