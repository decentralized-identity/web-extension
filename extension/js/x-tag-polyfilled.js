(function(){

  'use strict';
   
  var n=window.Document.prototype.createElement,p=window.Document.prototype.createElementNS,aa=window.Document.prototype.importNode,ba=window.Document.prototype.prepend,ca=window.Document.prototype.append,da=window.DocumentFragment.prototype.prepend,ea=window.DocumentFragment.prototype.append,q=window.Node.prototype.cloneNode,r=window.Node.prototype.appendChild,t=window.Node.prototype.insertBefore,u=window.Node.prototype.removeChild,v=window.Node.prototype.replaceChild,w=Object.getOwnPropertyDescriptor(window.Node.prototype,
  "textContent"),y=window.Element.prototype.attachShadow,z=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),A=window.Element.prototype.getAttribute,B=window.Element.prototype.setAttribute,C=window.Element.prototype.removeAttribute,D=window.Element.prototype.getAttributeNS,E=window.Element.prototype.setAttributeNS,F=window.Element.prototype.removeAttributeNS,G=window.Element.prototype.insertAdjacentElement,H=window.Element.prototype.insertAdjacentHTML,fa=window.Element.prototype.prepend,
  ha=window.Element.prototype.append,ia=window.Element.prototype.before,ja=window.Element.prototype.after,ka=window.Element.prototype.replaceWith,la=window.Element.prototype.remove,ma=window.HTMLElement,I=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),na=window.HTMLElement.prototype.insertAdjacentElement,oa=window.HTMLElement.prototype.insertAdjacentHTML;var pa=new Set;"annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" ").forEach(function(a){return pa.add(a)});function qa(a){var b=pa.has(a);a=/^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/.test(a);return!b&&a}var ra=document.contains?document.contains.bind(document):document.documentElement.contains.bind(document.documentElement);
  function J(a){var b=a.isConnected;if(void 0!==b)return b;if(ra(a))return!0;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return!(!a||!(a.__CE_isImportDocument||a instanceof Document))}function K(a){var b=a.children;if(b)return Array.prototype.slice.call(b);b=[];for(a=a.firstChild;a;a=a.nextSibling)a.nodeType===Node.ELEMENT_NODE&&b.push(a);return b}
  function L(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
  function M(a,b,c){for(var f=a;f;){if(f.nodeType===Node.ELEMENT_NODE){var d=f;b(d);var e=d.localName;if("link"===e&&"import"===d.getAttribute("rel")){f=d.import;void 0===c&&(c=new Set);if(f instanceof Node&&!c.has(f))for(c.add(f),f=f.firstChild;f;f=f.nextSibling)M(f,b,c);f=L(a,d);continue}else if("template"===e){f=L(a,d);continue}if(d=d.__CE_shadowRoot)for(d=d.firstChild;d;d=d.nextSibling)M(d,b,c)}f=f.firstChild?f.firstChild:L(a,f)}};function N(){var a=!(null===O||void 0===O||!O.noDocumentConstructionObserver),b=!(null===O||void 0===O||!O.shadyDomFastWalk);this.h=[];this.a=[];this.f=!1;this.shadyDomFastWalk=b;this.C=!a}function P(a,b,c,f){var d=window.ShadyDom;if(a.shadyDomFastWalk&&d&&d.inUse){if(b.nodeType===Node.ELEMENT_NODE&&c(b),b.querySelectorAll)for(a=d.nativeMethods.querySelectorAll.call(b,"*"),b=0;b<a.length;b++)c(a[b])}else M(b,c,f)}function sa(a,b){a.f=!0;a.h.push(b)}function ta(a,b){a.f=!0;a.a.push(b)}
  function Q(a,b){a.f&&P(a,b,function(c){return R(a,c)})}function R(a,b){if(a.f&&!b.__CE_patched){b.__CE_patched=!0;for(var c=0;c<a.h.length;c++)a.h[c](b);for(c=0;c<a.a.length;c++)a.a[c](b)}}function S(a,b){var c=[];P(a,b,function(d){return c.push(d)});for(b=0;b<c.length;b++){var f=c[b];1===f.__CE_state?a.connectedCallback(f):T(a,f)}}function U(a,b){var c=[];P(a,b,function(d){return c.push(d)});for(b=0;b<c.length;b++){var f=c[b];1===f.__CE_state&&a.disconnectedCallback(f)}}
  function V(a,b,c){c=void 0===c?{}:c;var f=c.D,d=c.upgrade||function(g){return T(a,g)},e=[];P(a,b,function(g){a.f&&R(a,g);if("link"===g.localName&&"import"===g.getAttribute("rel")){var h=g.import;h instanceof Node&&(h.__CE_isImportDocument=!0,h.__CE_registry=document.__CE_registry);h&&"complete"===h.readyState?h.__CE_documentLoadHandled=!0:g.addEventListener("load",function(){var k=g.import;if(!k.__CE_documentLoadHandled){k.__CE_documentLoadHandled=!0;var l=new Set;f&&(f.forEach(function(m){return l.add(m)}),
  l.delete(k));V(a,k,{D:l,upgrade:d})}})}else e.push(g)},f);for(b=0;b<e.length;b++)d(e[b])}
  function T(a,b){try{var c=b.ownerDocument,f=c.__CE_registry;var d=f&&(c.defaultView||c.__CE_isImportDocument)?W(f,b.localName):void 0;if(d&&void 0===b.__CE_state){d.constructionStack.push(b);try{try{if(new d.constructorFunction!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{d.constructionStack.pop()}}catch(k){throw b.__CE_state=2,k;}b.__CE_state=1;b.__CE_definition=d;if(d.attributeChangedCallback&&b.hasAttributes()){var e=d.observedAttributes;
  for(d=0;d<e.length;d++){var g=e[d],h=b.getAttribute(g);null!==h&&a.attributeChangedCallback(b,g,null,h,null)}}J(b)&&a.connectedCallback(b)}}catch(k){X(k)}}N.prototype.connectedCallback=function(a){var b=a.__CE_definition;if(b.connectedCallback)try{b.connectedCallback.call(a)}catch(c){X(c)}};N.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;if(b.disconnectedCallback)try{b.disconnectedCallback.call(a)}catch(c){X(c)}};
  N.prototype.attributeChangedCallback=function(a,b,c,f,d){var e=a.__CE_definition;if(e.attributeChangedCallback&&-1<e.observedAttributes.indexOf(b))try{e.attributeChangedCallback.call(a,b,c,f,d)}catch(g){X(g)}};
  function ua(a,b,c,f){var d=b.__CE_registry;if(d&&(null===f||"http://www.w3.org/1999/xhtml"===f)&&(d=W(d,c)))try{var e=new d.constructorFunction;if(void 0===e.__CE_state||void 0===e.__CE_definition)throw Error("Failed to construct '"+c+"': The returned value was not constructed with the HTMLElement constructor.");if("http://www.w3.org/1999/xhtml"!==e.namespaceURI)throw Error("Failed to construct '"+c+"': The constructed element's namespace must be the HTML namespace.");if(e.hasAttributes())throw Error("Failed to construct '"+
  c+"': The constructed element must not have any attributes.");if(null!==e.firstChild)throw Error("Failed to construct '"+c+"': The constructed element must not have any children.");if(null!==e.parentNode)throw Error("Failed to construct '"+c+"': The constructed element must not have a parent node.");if(e.ownerDocument!==b)throw Error("Failed to construct '"+c+"': The constructed element's owner document is incorrect.");if(e.localName!==c)throw Error("Failed to construct '"+c+"': The constructed element's local name is incorrect.");
  return e}catch(g){return X(g),b=null===f?n.call(b,c):p.call(b,f,c),Object.setPrototypeOf(b,HTMLUnknownElement.prototype),b.__CE_state=2,b.__CE_definition=void 0,R(a,b),b}b=null===f?n.call(b,c):p.call(b,f,c);R(a,b);return b}
  function X(a){var b=a.message,c=a.sourceURL||a.fileName||"",f=a.line||a.lineNumber||0,d=a.column||a.columnNumber||0,e=void 0;void 0===ErrorEvent.prototype.initErrorEvent?e=new ErrorEvent("error",{cancelable:!0,message:b,filename:c,lineno:f,colno:d,error:a}):(e=document.createEvent("ErrorEvent"),e.initErrorEvent("error",!1,!0,b,c,f),e.preventDefault=function(){Object.defineProperty(this,"defaultPrevented",{configurable:!0,get:function(){return!0}})});void 0===e.error&&Object.defineProperty(e,"error",
  {configurable:!0,enumerable:!0,get:function(){return a}});window.dispatchEvent(e);e.defaultPrevented||console.error(a)};function va(){var a=this;this.a=void 0;this.w=new Promise(function(b){a.g=b})}va.prototype.resolve=function(a){if(this.a)throw Error("Already resolved.");this.a=a;this.g(a)};function wa(a){var b=document;this.g=void 0;this.b=a;this.a=b;V(this.b,this.a);"loading"===this.a.readyState&&(this.g=new MutationObserver(this.A.bind(this)),this.g.observe(this.a,{childList:!0,subtree:!0}))}function xa(a){a.g&&a.g.disconnect()}wa.prototype.A=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||xa(this);for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,f=0;f<c.length;f++)V(this.b,c[f])};function Y(a){this.j=new Map;this.l=new Map;this.u=new Map;this.o=!1;this.s=new Map;this.i=function(b){return b()};this.c=!1;this.m=[];this.b=a;this.v=a.C?new wa(a):void 0}Y.prototype.B=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructor getters must be functions.");ya(this,a);this.j.set(a,b);this.m.push(a);this.c||(this.c=!0,this.i(function(){return za(c)}))};
  Y.prototype.define=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");ya(this,a);Aa(this,a,b);this.m.push(a);this.c||(this.c=!0,this.i(function(){return za(c)}))};function ya(a,b){if(!qa(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(W(a,b))throw Error("A custom element with name '"+(b+"' has already been defined."));if(a.o)throw Error("A custom element is already being defined.");}
  function Aa(a,b,c){a.o=!0;var f;try{var d=c.prototype;if(!(d instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var e=function(m){var x=d[m];if(void 0!==x&&!(x instanceof Function))throw Error("The '"+m+"' callback must be a function.");return x};var g=e("connectedCallback");var h=e("disconnectedCallback");var k=e("adoptedCallback");var l=(f=e("attributeChangedCallback"))&&c.observedAttributes||[]}catch(m){throw m;}finally{a.o=!1}c={localName:b,
  constructorFunction:c,connectedCallback:g,disconnectedCallback:h,adoptedCallback:k,attributeChangedCallback:f,observedAttributes:l,constructionStack:[]};a.l.set(b,c);a.u.set(c.constructorFunction,c);return c}Y.prototype.upgrade=function(a){V(this.b,a)};
  function za(a){if(!1!==a.c){a.c=!1;for(var b=[],c=a.m,f=new Map,d=0;d<c.length;d++)f.set(c[d],[]);V(a.b,document,{upgrade:function(k){if(void 0===k.__CE_state){var l=k.localName,m=f.get(l);m?m.push(k):a.l.has(l)&&b.push(k)}}});for(d=0;d<b.length;d++)T(a.b,b[d]);for(d=0;d<c.length;d++){for(var e=c[d],g=f.get(e),h=0;h<g.length;h++)T(a.b,g[h]);(e=a.s.get(e))&&e.resolve(void 0)}c.length=0}}Y.prototype.get=function(a){if(a=W(this,a))return a.constructorFunction};
  Y.prototype.whenDefined=function(a){if(!qa(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.s.get(a);if(b)return b.w;b=new va;this.s.set(a,b);var c=this.l.has(a)||this.j.has(a);a=-1===this.m.indexOf(a);c&&a&&b.resolve(void 0);return b.w};Y.prototype.polyfillWrapFlushCallback=function(a){this.v&&xa(this.v);var b=this.i;this.i=function(c){return a(function(){return b(c)})}};
  function W(a,b){var c=a.l.get(b);if(c)return c;if(c=a.j.get(b)){a.j.delete(b);try{return Aa(a,b,c())}catch(f){X(f)}}}window.CustomElementRegistry=Y;Y.prototype.define=Y.prototype.define;Y.prototype.upgrade=Y.prototype.upgrade;Y.prototype.get=Y.prototype.get;Y.prototype.whenDefined=Y.prototype.whenDefined;Y.prototype.polyfillDefineLazy=Y.prototype.B;Y.prototype.polyfillWrapFlushCallback=Y.prototype.polyfillWrapFlushCallback;function Z(a,b,c){function f(d){return function(e){for(var g=[],h=0;h<arguments.length;++h)g[h]=arguments[h];h=[];for(var k=[],l=0;l<g.length;l++){var m=g[l];m instanceof Element&&J(m)&&k.push(m);if(m instanceof DocumentFragment)for(m=m.firstChild;m;m=m.nextSibling)h.push(m);else h.push(m)}d.apply(this,g);for(g=0;g<k.length;g++)U(a,k[g]);if(J(this))for(g=0;g<h.length;g++)k=h[g],k instanceof Element&&S(a,k)}}void 0!==c.prepend&&(b.prepend=f(c.prepend));void 0!==c.append&&(b.append=f(c.append))};function Ba(a){Document.prototype.createElement=function(b){return ua(a,this,b,null)};Document.prototype.importNode=function(b,c){b=aa.call(this,b,!!c);this.__CE_registry?V(a,b):Q(a,b);return b};Document.prototype.createElementNS=function(b,c){return ua(a,this,c,b)};Z(a,Document.prototype,{prepend:ba,append:ca})};function Ca(a){function b(f){return function(d){for(var e=[],g=0;g<arguments.length;++g)e[g]=arguments[g];g=[];for(var h=[],k=0;k<e.length;k++){var l=e[k];l instanceof Element&&J(l)&&h.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)g.push(l);else g.push(l)}f.apply(this,e);for(e=0;e<h.length;e++)U(a,h[e]);if(J(this))for(e=0;e<g.length;e++)h=g[e],h instanceof Element&&S(a,h)}}var c=Element.prototype;void 0!==ia&&(c.before=b(ia));void 0!==ja&&(c.after=b(ja));void 0!==ka&&
  (c.replaceWith=function(f){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var g=[],h=0;h<d.length;h++){var k=d[h];k instanceof Element&&J(k)&&g.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)e.push(k);else e.push(k)}h=J(this);ka.apply(this,d);for(d=0;d<g.length;d++)U(a,g[d]);if(h)for(U(a,this),d=0;d<e.length;d++)g=e[d],g instanceof Element&&S(a,g)});void 0!==la&&(c.remove=function(){var f=J(this);la.call(this);f&&U(a,this)})};function Da(a){function b(d,e){Object.defineProperty(d,"innerHTML",{enumerable:e.enumerable,configurable:!0,get:e.get,set:function(g){var h=this,k=void 0;J(this)&&(k=[],P(a,this,function(x){x!==h&&k.push(x)}));e.set.call(this,g);if(k)for(var l=0;l<k.length;l++){var m=k[l];1===m.__CE_state&&a.disconnectedCallback(m)}this.ownerDocument.__CE_registry?V(a,this):Q(a,this);return g}})}function c(d,e){d.insertAdjacentElement=function(g,h){var k=J(h);g=e.call(this,g,h);k&&U(a,h);J(g)&&S(a,h);return g}}function f(d,
  e){function g(h,k){for(var l=[];h!==k;h=h.nextSibling)l.push(h);for(k=0;k<l.length;k++)V(a,l[k])}d.insertAdjacentHTML=function(h,k){h=h.toLowerCase();if("beforebegin"===h){var l=this.previousSibling;e.call(this,h,k);g(l||this.parentNode.firstChild,this)}else if("afterbegin"===h)l=this.firstChild,e.call(this,h,k),g(this.firstChild,l);else if("beforeend"===h)l=this.lastChild,e.call(this,h,k),g(l||this.firstChild,null);else if("afterend"===h)l=this.nextSibling,e.call(this,h,k),g(this.nextSibling,l);
  else throw new SyntaxError("The value provided ("+String(h)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");}}y&&(Element.prototype.attachShadow=function(d){d=y.call(this,d);if(a.f&&!d.__CE_patched){d.__CE_patched=!0;for(var e=0;e<a.h.length;e++)a.h[e](d)}return this.__CE_shadowRoot=d});z&&z.get?b(Element.prototype,z):I&&I.get?b(HTMLElement.prototype,I):ta(a,function(d){b(d,{enumerable:!0,configurable:!0,get:function(){return q.call(this,!0).innerHTML},set:function(e){var g=
  "template"===this.localName,h=g?this.content:this,k=p.call(document,this.namespaceURI,this.localName);for(k.innerHTML=e;0<h.childNodes.length;)u.call(h,h.childNodes[0]);for(e=g?k.content:k;0<e.childNodes.length;)r.call(h,e.childNodes[0])}})});Element.prototype.setAttribute=function(d,e){if(1!==this.__CE_state)return B.call(this,d,e);var g=A.call(this,d);B.call(this,d,e);e=A.call(this,d);a.attributeChangedCallback(this,d,g,e,null)};Element.prototype.setAttributeNS=function(d,e,g){if(1!==this.__CE_state)return E.call(this,
  d,e,g);var h=D.call(this,d,e);E.call(this,d,e,g);g=D.call(this,d,e);a.attributeChangedCallback(this,e,h,g,d)};Element.prototype.removeAttribute=function(d){if(1!==this.__CE_state)return C.call(this,d);var e=A.call(this,d);C.call(this,d);null!==e&&a.attributeChangedCallback(this,d,e,null,null)};Element.prototype.removeAttributeNS=function(d,e){if(1!==this.__CE_state)return F.call(this,d,e);var g=D.call(this,d,e);F.call(this,d,e);var h=D.call(this,d,e);g!==h&&a.attributeChangedCallback(this,e,g,h,d)};
  na?c(HTMLElement.prototype,na):G&&c(Element.prototype,G);oa?f(HTMLElement.prototype,oa):H&&f(Element.prototype,H);Z(a,Element.prototype,{prepend:fa,append:ha});Ca(a)};var Ea={};function Fa(a){function b(){var c=this.constructor;var f=document.__CE_registry.u.get(c);if(!f)throw Error("Failed to construct a custom element: The constructor was not registered with `customElements`.");var d=f.constructionStack;if(0===d.length)return d=n.call(document,f.localName),Object.setPrototypeOf(d,c.prototype),d.__CE_state=1,d.__CE_definition=f,R(a,d),d;var e=d.length-1,g=d[e];if(g===Ea)throw Error("Failed to construct '"+f.localName+"': This element was already constructed.");d[e]=Ea;
  Object.setPrototypeOf(g,c.prototype);R(a,g);return g}b.prototype=ma.prototype;Object.defineProperty(HTMLElement.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});window.HTMLElement=b};function Ga(a){function b(c,f){Object.defineProperty(c,"textContent",{enumerable:f.enumerable,configurable:!0,get:f.get,set:function(d){if(this.nodeType===Node.TEXT_NODE)f.set.call(this,d);else{var e=void 0;if(this.firstChild){var g=this.childNodes,h=g.length;if(0<h&&J(this)){e=Array(h);for(var k=0;k<h;k++)e[k]=g[k]}}f.set.call(this,d);if(e)for(d=0;d<e.length;d++)U(a,e[d])}}})}Node.prototype.insertBefore=function(c,f){if(c instanceof DocumentFragment){var d=K(c);c=t.call(this,c,f);if(J(this))for(f=
  0;f<d.length;f++)S(a,d[f]);return c}d=c instanceof Element&&J(c);f=t.call(this,c,f);d&&U(a,c);J(this)&&S(a,c);return f};Node.prototype.appendChild=function(c){if(c instanceof DocumentFragment){var f=K(c);c=r.call(this,c);if(J(this))for(var d=0;d<f.length;d++)S(a,f[d]);return c}f=c instanceof Element&&J(c);d=r.call(this,c);f&&U(a,c);J(this)&&S(a,c);return d};Node.prototype.cloneNode=function(c){c=q.call(this,!!c);this.ownerDocument.__CE_registry?V(a,c):Q(a,c);return c};Node.prototype.removeChild=function(c){var f=
  c instanceof Element&&J(c),d=u.call(this,c);f&&U(a,c);return d};Node.prototype.replaceChild=function(c,f){if(c instanceof DocumentFragment){var d=K(c);c=v.call(this,c,f);if(J(this))for(U(a,f),f=0;f<d.length;f++)S(a,d[f]);return c}d=c instanceof Element&&J(c);var e=v.call(this,c,f),g=J(this);g&&U(a,f);d&&U(a,c);g&&S(a,c);return e};w&&w.get?b(Node.prototype,w):sa(a,function(c){b(c,{enumerable:!0,configurable:!0,get:function(){for(var f=[],d=this.firstChild;d;d=d.nextSibling)d.nodeType!==Node.COMMENT_NODE&&
  f.push(d.textContent);return f.join("")},set:function(f){for(;this.firstChild;)u.call(this,this.firstChild);null!=f&&""!==f&&r.call(this,document.createTextNode(f))}})})};var O=window.customElements;function Ha(){var a=new N;Fa(a);Ba(a);Z(a,DocumentFragment.prototype,{prepend:da,append:ea});Ga(a);Da(a);a=new Y(a);document.__CE_registry=a;Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:a})}O&&!O.forcePolyfill&&"function"==typeof O.define&&"function"==typeof O.get||Ha();window.__CE_installPolyfill=Ha;
  }).call(self);
  
(function(){

  var docElement = document.documentElement;
  (Element.prototype.matches || (Element.prototype.matches = docElement.webkitMatchesSelector ||
                                                             docElement.msMatchesSelector ||
                                                             docElement.oMatchesSelector))

  var regexParseExt = /([\w\-]+)|(::|:)(\w+)(?:\((.+?(?=\)))\))?/g;
  var regexCommaArgs = /,\s*/;
  var regexCamel = /[A-Z]/g;
  var dashLower = c => "-" + c.toLowerCase();

  function delegateAction(node, pseudo, event) {
    var match,
        target = event.target,
        root = event.currentTarget;
    while (!match && target && target != root) {
      if (target.tagName && target.matches(pseudo.args)) match = target;
      target = target.parentNode;
    }
    if (!match && root.tagName && root.matches(pseudo.args)) match = root;
    if (match) pseudo.fn = pseudo.fn.bind(match);
    else return null;
  }

  var xtag = {
    events: {},
    pseudos: {
      delegate: {
        onInvoke: delegateAction
      }
    },
    extensions: {
      rxn: {
        onParse (klass, prop, args, descriptor, key){
          delete klass.prototype[key];
          return false;
        },
        onConstruct (node, property, args, descriptor){
          node.rxn(property, descriptor.value, !!args[1]);
        }
      },
      attr: {
        mixin: (base) => class extends base {
          attributeChangedCallback(attr, last, current){
            var desc = this.constructor.getOptions('attributes')[attr];
            if (desc && desc.set && !desc._skip) {
              desc.set.call(this, current);
              desc._skip = null;
            }
          }
        },
        types: {
          boolean: {
            set: function(prop, val){
              val || val === '' ? this.setAttribute(prop, '') : this.removeAttribute(prop);
            },
            get: function(prop){
              return this.hasAttribute(prop);
            }
          }
        },
        onParse (klass, prop, args, descriptor, key){
          if (descriptor.value) throw 'Attribute accessor "'+ prop +'" was declared as a value, but must be declared as get or set';
          var _prop = prop.replace(regexCamel, dashLower);
          klass.getOptions('attributes')[_prop] = descriptor;
          var type = this.types[args[0]] || {};
          let descSet = descriptor.set;
          let typeSet = type.set || HTMLElement.prototype.setAttribute;
          descriptor.set = function(val){
            if (!descriptor._skip){
              descriptor._skip = true;
              var output;
              if (descSet) output = descSet.call(this, val);
              typeSet.call(this, _prop, typeof output == 'undefined' ? val : output);
              descriptor._skip = null;
            }
          }
          let descGet = descriptor.get;
          let typeGet = type.get || HTMLElement.prototype.getAttribute;
          descriptor.get = function(){
            var output;
            var val = typeGet.call(this, _prop);
            if (descGet) output = descGet.call(this, val);
            return typeof output == 'undefined' ? val : output;
          }
          delete klass.prototype[key];
        },
        onCompiled (klass){
          klass.observedAttributes = Object.keys(klass.getOptions('attributes')).concat(klass.observedAttributes || [])
        }
      },
      event: {
        onParse (klass, property, args, descriptor, key){
          delete klass.prototype[key];
          return false;
        },
        onConstruct (node, property, args, descriptor){
          xtag.addEvent(node, property, descriptor.value);
        }
      },
      template: {
        throttle: {
          frame: function (node, template, queued){
            queued.cancel = cancelAnimationFrame.bind(window, requestAnimationFrame(() => {
              node._render(template, queued);
            }))
          },
          debounce: function (node, template, queued, options){
            queued.cancel = clearTimeout.bind(window, setTimeout(() => {
              node_.render(template, queued);
            }, options.throttle))
          }
        },
        mixin: (base) => class extends base {
          set 'template::attr' (name){
            this.render(name);
          }
          get templates (){
            return this.constructor.getOptions('templates');
          }
          _render (template, queued){
            this.innerHTML = template.call(this);
            this._XTagRender = null;
            if (queued.resolve) queued.resolve(this);
          }
          render (name, options = {}){
            var _name = name || 'default';
            var template = this.templates[_name];
            if (!template) {
              throw new ReferenceError('Template "' + _name + '" undefined for ' + this.nodeName);
            }
            var queued = this._XTagRender;
            if (queued) {
              if (queued.name === _name) return queued.promise;
              else if (queued.cancel) queued.cancel();
            }
            if (this.getAttribute('template') != _name) this.setAttribute('template', _name);
            queued = this._XTagRender = { name: _name };
            var ext = xtag.extensions.template.throttle;
            var throttle = (options.throttle ? ext[options.throttle] || ext.debounce : false);
            if (throttle) {
              return queued.promise = new Promise(resolve => {
                queued.resolve = resolve;
                throttle(this, template, queued, options);
              });
            }
            else {
              this._render(template, queued);
              return Promise.resolve(this);
            }
          }
        },
        onParse (klass, property, args, descriptor){
          klass.getOptions('templates')[property || 'default'] = descriptor.value;
          return false;
        },
        onReady (node, resolve, property, args){
          if (args[0]) {
            if (args[0] === 'ready') node.render(property);
            else node.rxn('firstpaint', () => node.render(property));
          }
          resolve();
        }
      }
    },
    create (name, klass){
      var c = klass || name;
      c.options = Object.assign({}, c.options);
      onParse(c); 
      if (klass && name) customElements.define(name, c);
      return c;
    },
    register (name, klass) {
      customElements.define(name, klass);
    },
    addEvents (node, events){
      let refs = {};
      for (let z in events) refs[z] = xtag.addEvent(node, z, events[z]);
      return refs;
    },
    addEvent (node, key, fn, options){
      var type;
      var stack = fn;
      var ref = options || {};
      ref.data = {};
      key.replace(regexParseExt, (match, name, dots, pseudo, args) => {
        if (name) type = name;
        else if (dots == ':'){
          var pseudo = xtag.pseudos[pseudo];
          var _args = args ? args.split(regexCommaArgs) : [];
          stack = pseudoWrap(pseudo, _args, stack, ref);
          if (pseudo.onParse) pseudo.onParse(node, type, _args, stack, ref);
        }
      });
      node.addEventListener(type, stack, ref);
      ref.type = type;
      ref.listener = stack;
      var event = xtag.events[type];
      if (event) {
        var listener = function(e){
          new Promise(resolve => {
            event.onFilter ? event.onFilter(this, e, ref, resolve) : resolve();
          }).then(() => {
            let fired = '_' + type + 'EventFired';
            if (!e[fired]) {
              e[fired] = true;
              xtag.fireEvent(e.target || this, type);
            }
          })
        }
        ref.attached = event.attach.map(key => {
          return xtag.addEvent(node, key, listener, {capture: true});
        });
        if (event.onAdd) event.onAdd(node, ref);
      }
      return ref;
    },
    removeEvents (node, refs) {
      for (let z in refs) xtag.removeEvent(node, refs[z]);
    },
    removeEvent (node, ref){
      node.removeEventListener(ref.type, ref.listener, ref.capture);
      var event = xtag.events[ref.type];
      if (event && event.onRemove) event.onRemove(node, ref);
      if (ref.attached) ref.attached.forEach(attached => { xtag.removeEvent(node, ref) })
    },
    fireEvent (node, name, obj = {}){
      let options = Object.assign({
        bubbles: true,
        cancelable: true
      }, obj);
      node.dispatchEvent(new CustomEvent(name, options));
    }
  }

  var rxnID = 0;
  function processRxns(node, type){
    var rxn = node.rxns[type];
    var queue = rxn.queue;
    for (let z in queue) {
      queue[z].fn.call(node);
      if (rxn.singleton || !queue[z].recurring) delete queue[z];
    }
    rxn.fired = true;
  }

  function createClass(options = {}){
    var klass;
    klass = class extends (options.native ? Object.getPrototypeOf(document.createElement(options.native)).constructor : HTMLElement) {
      constructor () {
        super();
        if (!this.rxns) this.rxns = {
          ready: { queue: {}, singleton: true },
          firstpaint: { queue: {}, singleton: true },
          render: { queue: {} }
        };
        onConstruct(this);
        new Promise(resolve => onReady(this, resolve)).then(() => {
          processRxns(this, 'ready')
          if (this.readyCallback) this.readyCallback();
        });
      }

      connectedCallback () {
        onConnect(this);
        if (!this.rxns.firstpaint.frame) {
          this.rxns.firstpaint.frame = requestAnimationFrame(() => processRxns(this, 'firstpaint'));
        }
      }
      
      rxn (type, fn, recurring){
        var rxn = this.rxns[type];
        if (rxn.singleton && rxn.fired) fn.call(this);
        else {
          rxn.queue[rxnID++] = { fn: fn, recurring: recurring };
          return rxnID;
        }
      }
      
      cancelRxn (type, id){
        delete this.rxns[type].queue[id];
      }
    };

    klass.options = {
      extensions: {},
      pseudos: {}
    };
    
    klass.getOptions = function(name){
      return this.options[name] || (this.options[name] = Object.assign({}, Object.getPrototypeOf(this).options ? Object.getPrototypeOf(this).options[name] : {}));
    }

    klass.extensions = function extensions(...extensions){
      var exts = this.getOptions('extensions');
      return extensions.reduce((current, extension) => {
        var mixin;
        var extended = current;
        if (!exts[extension.name]) {
          if (typeof extension == 'string') {
            mixin = xtag.extensions[extension].mixin;
          }
          else {
            mixin = extension.mixin;
            exts[extension.name] = extension;
          }
          if (mixin) {
            extended = mixin(current);
            onParse(extended);
          }
        }
        return extended;
      }, this);
    }

    klass.as = function(tag){
      return createClass({
        native: tag
      });
    }

    return klass.extensions('attr', 'event', 'template');
  }

  XTagElement = createClass();

  function pseudoWrap(pseudo, args, fn, detail){
    return function(){
      var _pseudo = { fn: fn, args: args, detail: detail };
      var output = pseudo.onInvoke(this, _pseudo, ...arguments);
      if (output === null || output === false) return output;
      return _pseudo.fn.apply(this, output instanceof Array ? output : arguments);
    };
  }

  function onParse(target){
    var processedProps = {};
    var descriptors = getDescriptors(target);
    var extensions = target.getOptions('extensions');
    var processed = target._processedExtensions = new Map();   
    for (let z in descriptors) {
      let matches = [];
      let property;
      let extension;
      let extensionArgs = [];
      let descriptor = descriptors[z];
      let pseudos = target._pseudos || xtag.pseudos;    
      z.replace(regexParseExt, function(){ matches.unshift(arguments);  });
      matches.forEach(a => function(match, prop, dots, name, args){
        property = prop || property;
        if (args) var _args = args.split(regexCommaArgs);
        if (dots == '::') {
          extensionArgs = _args || [];
          extension = extensions[name] || xtag.extensions[name];
          if (!processed.get(extension)) processed.set(extension, []);
        }
        else if (!prop){
          let pseudo = pseudos[name];
          if (pseudo) {
            for (let y in descriptor) {
              let fn = descriptor[y];
              if (typeof fn == 'function' && pseudo.onInvoke) {
                fn = descriptor[y] = pseudoWrap(pseudo, _args, fn);
                if (pseudo.onParse) pseudo.onParse(target, property, _args, fn);
              }
            }
          }
        }
      }.apply(null, a));
      let attachProperty;
      if (extension) {
        processed.get(extension).push([property, extensionArgs, descriptor]);
        if (extension.onParse) attachProperty = extension.onParse(target, property, extensionArgs, descriptor, z);
      }
      if (!property) delete target.prototype[z];
      else if (attachProperty !== false) {
        let prop = processedProps[property] || (processedProps[property] = {});
        for (let y in descriptor) prop[y] = descriptor[y];
      }
    }
    for (let ext of processed.keys()) {
      if (ext.onCompiled) ext.onCompiled(target, processedProps);
    }
    Object.defineProperties(target.prototype, processedProps);
  }

  function onConstruct (target){
    var processed = target.constructor._processedExtensions;
    for (let [ext, items] of processed) {
      if (ext.onConstruct) items.forEach(item => ext.onConstruct(target, ...item))
    }
  }

  function onReady (target, resolve){
    var processed = target.constructor._processedExtensions;
    for (let [ext, items] of processed) {
      if (ext.onReady) Promise.all(items.map(item => {
        return new Promise(resolve => ext.onReady(target, resolve, ...item))
      })).then(resolve)
    }
  }

  function onConnect (target){
    var processed = target.constructor._processedExtensions;
    for (let [ext, items] of processed) {
      if (ext.onConnect) items.forEach(item => ext.onConnect(target, ...item))
    }
  }

  function getDescriptors(target){
    var descriptors = {};
    var proto = target.prototype;
    Object.getOwnPropertyNames(proto).forEach(key => {
      descriptors[key] = Object.getOwnPropertyDescriptor(proto, key);
    });
    return descriptors;
  }

  if (typeof define === 'function' && define.amd) {
    define(xtag);
    define(XTagElement);
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = { xtag: xtag, XTagElement: XTagElement };
  }
  else {
    window.xtag = xtag;
    window.XTagElement = XTagElement;
  }

})();