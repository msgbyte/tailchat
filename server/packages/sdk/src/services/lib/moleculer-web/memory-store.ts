/**
 * Memory store for Rate limiter
 *
 * Inspired by https://github.com/dotcypress/micro-ratelimit/
 *
 * @class MemoryStore
 */
export class MemoryStore {
  hits;
  resetTime;
  timer;

  /**
   * Creates an instance of MemoryStore.
   *
   * @param {Number} clearPeriod
   * @memberof MemoryStore
   */
  constructor(clearPeriod) {
    this.hits = new Map();
    this.resetTime = Date.now() + clearPeriod;

    this.timer = setInterval(() => {
      this.resetTime = Date.now() + clearPeriod;
      this.reset();
    }, clearPeriod);

    this.timer.unref();
  }

  /**
   * Increment the counter by key
   *
   * @param {String} key
   * @returns {Number}
   * @memberof MemoryStore
   */
  inc(key) {
    let counter = this.hits.get(key) || 0;
    counter++;
    this.hits.set(key, counter);
    return counter;
  }

  /**
   * Reset all counters
   *
   * @memberof MemoryStore
   */
  reset() {
    this.hits.clear();
  }
}
