import Shepherd from 'shepherd.js';
import { steps } from './steps';
import './style.less';

const KEY = 'plugin:com.msgbyte.intro/hasRun';

if (!window.localStorage.getItem(KEY)) {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shadow-md',
      scrollTo: true,
      arrow: true,
      modalOverlayOpeningRadius: 4,
      modalOverlayOpeningPadding: 4,
      buttons: [
        {
          text: '跳过引导',
          secondary: true,
          action() {
            this.complete();
          },
        },
        {
          text: '下一步',
          action() {
            this.next();
          },
        },
      ],
    },
  });

  tour.on('complete', () => {
    window.localStorage.setItem(KEY, 'true');
  });

  tour.addSteps(steps);

  tour.start();
}
