declare global {
  interface Window {
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: any;
    msRequestAnimationFrame: any;
  }
}
class SmoothScroll {
  private el: any;
  private endCallback: () => {};
  constructor() {}

  _scroll(start, end, step) {
    let d = 0;
    if (start === end) {
      this.endCallback && this.endCallback();
      return;
    } else if (start > end) {
      d = start - step < end ? end : start - step;
    } else {
      d = start + step > end ? end : start + step;
    }
    if (this.el === window) {
      window.scrollTo(start, d);
    } else {
      this.el.scrollTop = d;
    }
    window.requestAnimationFrame(() => this._scroll(d, end, step));
  }

  public scrollTo(el, from = 0, to = 0, duration = 500, endCallback) {
    this.el = el;
    this.endCallback = endCallback;
    if (!window.requestAnimationFrame) {
      // requestAnimationFrame 集中 在一次重绘或者回流中完成
      window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 20);

    this._scroll(from, to, step);
  }
}
export default new SmoothScroll();
