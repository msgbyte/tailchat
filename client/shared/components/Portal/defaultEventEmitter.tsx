export class DefaultEventEmitter {
  // 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget
  listeners: any = {};

  emit(type: string, ...args: any[]) {
    if (!(type in this.listeners)) {
      return;
    }
    const stack = this.listeners[type];
    for (let i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
      const func = stack[i];

      if (typeof func === 'function') {
        func(...args);
      }
    }
  }

  addListener(type: string, callback: (...args: any[]) => any) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(callback);
  }

  removeListener(type: string, callback: (...args: any[]) => any): any {
    if (!(type in this.listeners)) {
      return;
    }
    const stack = this.listeners[type];
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return this.removeListener(type, callback);
      }
    }
  }
}
