
export default {
  ready: new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', e => resolve(e));
  }),
  skipAnimationFrame: fn => requestAnimationFrame(() => requestAnimationFrame(fn)),
  fireEvent(node, type, options = {}){
    return node.dispatchEvent(new CustomEvent(type, Object.assign({
      bubbles: true
    }, options)))
  },
  delegateEvent(type, selector, fn, options = {}){
    let listener = e => {
      let match = e.target.closest(selector);
      if (match) fn(e, match);
    }
    (options.container || document).addEventListener(type, listener, options);
    return listener;
  }
}