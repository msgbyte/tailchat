import SakanaWidget from 'sakana-widget';
import './main.css'; // copy from sakana-widget/dist/index.css

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.left = '60px';
container.style.bottom = '0px';

document.body.appendChild(container);
new SakanaWidget().setState({ r: 1, y: 1, t: 0, w: 0 }).mount(container);
