
import uuid from '/extension/js/modules/uuid.js';
import '/extension/js/polyfills/web-extensions.js';
let showAttr = 'show-did-extension-sidebar';

export default class ExtensionFrame {
  constructor(options = {}){
    this.onLoad = options.onLoad;
    this.onHide = options.onHide;
    let element = this.element = document.createElement('iframe');
    if (options.id) element.id = options.id;
    element.className += (' ' + (options.classes || ''));
    element.name = this.uuid = uuid.generate();
    this.src = options.src;
    element.addEventListener('load', e => {
      if (this.onLoad) this.onLoad(this);
    });
    element.addEventListener('transitionend', e => {
      if (!this.isOpen && this.onHide) this.onHide(this);
    });
  }
  get src() {
    return this._src;
  }
  set src(url) {
    this.element.src = this._src = !url ? 'about:blank' : url.startsWith('chrome-extension://') ? url : browser.runtime.getURL(url);
  }
  get name(){
    return this.element.name = this.uuid;
  }
  get isOpen() {
    return this.element.hasAttribute(showAttr)
  }
  show(){
    this.element.setAttribute(showAttr, '')
  }
  hide(){
    this.element.removeAttribute(showAttr)
  }
};