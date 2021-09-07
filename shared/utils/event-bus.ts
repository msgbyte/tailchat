/**
 * 独立事件分发工具类
 *
 * @example
 * const event = new EventBus();
 * event.on(() => {
 *   console.log('trigger')
 * })
 * event.fire();
 */
export class EventBus<Args extends unknown[] = []> {
  listeners: ((...args: Args) => void)[] = [];

  fire(...args: Args) {
    this.listeners.forEach((fn) => {
      fn(...args);
    });
  }

  on(fn: (...args: Args) => void) {
    this.listeners.push(fn);
  }

  off(fn: (...args: Args) => void) {
    const index = this.listeners.indexOf(fn);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }
}
