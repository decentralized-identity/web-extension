
// USE AS FOLLOWS:
// import { windowScrollPolyfill, windowScroll } from '/extension/js/modules/smooth-scroll.js';
// windowScrollPolyfill();

const ease = (k) => {
  return 0.5 * (1 - Math.cos(Math.PI * k));
};
const DURATION = 500;
export const isScrollBehaviorSupported = () => "scrollBehavior" in document.documentElement.style;
export const original = {
  _elementScroll: undefined,
  get elementScroll() {
      return (this._elementScroll || (this._elementScroll = HTMLElement.prototype.scroll ||
          HTMLElement.prototype.scrollTo ||
          function (x, y) {
              this.scrollLeft = x;
              this.scrollTop = y;
          }));
  },
  _elementScrollIntoView: undefined,
  get elementScrollIntoView() {
      return (this._elementScrollIntoView || (this._elementScrollIntoView = HTMLElement.prototype.scrollIntoView));
  },
  _windowScroll: undefined,
  get windowScroll() {
      return (this._windowScroll || (this._windowScroll = window.scroll || window.scrollTo));
  },
};
export const modifyPrototypes = (modification) => {
  const prototypes = [HTMLElement.prototype, SVGElement.prototype, Element.prototype];
  prototypes.forEach((prototype) => modification(prototype));
};
export const now = () => { var _a, _b, _c; return (_c = (_b = (_a = window.performance) === null || _a === void 0 ? void 0 : _a.now) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : Date.now(); };
export const step = (context) => {
  const currentTime = now();
  const elapsed = (currentTime - context.timeStamp) / (context.duration || DURATION);
  if (elapsed > 1) {
      context.method(context.targetX, context.targetY);
      context.callback();
      return;
  }
  const value = (context.timingFunc || ease)(elapsed);
  const currentX = context.startX + (context.targetX - context.startX) * value;
  const currentY = context.startY + (context.targetY - context.startY) * value;
  context.method(currentX, currentY);
  context.rafId = requestAnimationFrame(() => {
      step(context);
  });
};
// https://drafts.csswg.org/cssom-view/#normalize-non-finite-values
export const nonFinite = (value) => {
  if (!isFinite(value)) {
      return 0;
  }
  return Number(value);
};
export const isObject = (value) => {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
};

export const windowScroll = (options) => {
    var _a, _b;
    const originalBoundFunc = original.windowScroll.bind(window);
    if (options.left === undefined && options.top === undefined) {
        return;
    }
    const startX = window.scrollX || window.pageXOffset;
    const startY = window.scrollY || window.pageYOffset;
    const targetX = nonFinite((_a = options.left) !== null && _a !== void 0 ? _a : startX);
    const targetY = nonFinite((_b = options.top) !== null && _b !== void 0 ? _b : startY);
    if (options.behavior !== "smooth") {
        return originalBoundFunc(targetX, targetY);
    }
    const removeEventListener = () => {
        window.removeEventListener("wheel", cancelScroll);
        window.removeEventListener("touchmove", cancelScroll);
    };
    const context = {
        timeStamp: now(),
        duration: options.duration,
        startX,
        startY,
        targetX,
        targetY,
        rafId: 0,
        method: originalBoundFunc,
        timingFunc: options.timingFunc,
        callback: removeEventListener,
    };
    const cancelScroll = () => {
        cancelAnimationFrame(context.rafId);
        removeEventListener();
    };
    window.addEventListener("wheel", cancelScroll, {
        passive: true,
        once: true,
    });
    window.addEventListener("touchmove", cancelScroll, {
        passive: true,
        once: true,
    });
    step(context);
};
export const windowScrollPolyfill = (animationOptions) => {
    if (isScrollBehaviorSupported()) {
        return;
    }
    const originalFunc = original.windowScroll;
    window.scroll = function scroll() {
        if (arguments.length === 1) {
            const scrollOptions = arguments[0];
            if (!isObject(scrollOptions)) {
                throw new TypeError("Failed to execute 'scroll' on 'Window': parameter 1 ('options') is not an object.");
            }
            return windowScroll({ ...scrollOptions, ...animationOptions });
        }
        return originalFunc.apply(this, arguments);
    };
};