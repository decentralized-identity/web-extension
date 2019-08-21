
if (typeof EXT === 'undefined') (function(){

(function(){

  function assignOptions(props, params = {}, target){
    Object.assign(props, Object.assign({
      view: 'default',
      width: 400,
      height: 500,
    }, params, Object.assign({}, props)));
    if (target) target.props = props;
  }

  Popup = class Popup {
    constructor (props = {}){
      if (props.window) {
        this.window = props.window;
        let params = JSON.parse(new URLSearchParams(location.search).get('popup') || null) || {};
        assignOptions(props, params, this);
      }
      else {
        assignOptions(props, null, this);
        console.log(props);
        var config = {
          type: 'popup',
          width: props.width,
          height: props.height,
          focused: true,
          url: browser.extension.getURL(`extension/views/popup/${props.view || 'default'}/${props.type ? props.type + '/' : '' }index.html?popup=${JSON.stringify(props)}`)
        };
        this.window = browser.windows.getCurrent().then(win => {
          var x, y;
          if (props.center !== false) {
            x = Math.round(win.left + ((win.width / 2) - (props.width / 2)))
            y = Math.round(win.top + ((win.height / 2) - (props.height / 2)));
          }
          config.left = props.left || x;
          config.top = props.top || y;
          return browser.windows.create(config).then(info => {
            this._id = info.id;
            if (this.onCreate) this.onCreate();
          });
        });
      }
    }
    async updateWindow(options = {}) {
      return browser.windows.update(await this.id(), options);
    }
    async id () {
      return this._id || await this.window.then(info => this._id = info.id);
    }
    focus(){
      return this.updateWindow({
        focused: true
      });
    }
    moveTo (x, y){
      return this.updateWindow({
        left: x == null ? null : x,
        top: y == null ? null : y
      });
    }
    async getInfo (){
      return browser.windows.get(await this.id());
    }
    async animateTo (coord, options = {}){
      let info = await this.getInfo();
      return new Promise(resolve => {
        anime(Object.assign({
          targets: info,
          round: 1,
          duration: 400,
          easing: 'easeOutExpo',
          update: () => this.moveTo(info.left, info.top),
          complete: end => resolve(end)
        }, coord, options));
      });
    }
    async close (){
      return browser.windows.remove(await this.id());
    }
  };

  Sheet = class Sheet extends Popup {
    constructor (props){
      assignOptions(props, {
        width: 500,
        height: 300
      });
      super(props);
      if (props.window) {
        //window.addEventListener('blur', () => this.focus());
        this.animateTo({ top: window.innerHeight - window.outerHeight });
      }
    }
    async onCreate(){
      this.moveTo(null, -this.props.height);
    }
    async close (){
      let info = await this.getInfo();
      return this.animateTo({ top: -info.height }).then(end => {
        browser.windows.remove(info.id);
      })
    }
  }

  TrustedPrompt = class TrustedPrompt extends Sheet {
    constructor (props){
      props.view = 'trusted-prompt'
      super(props);
      if (!props.window) browser.browserAction.setBadgeBackgroundColor({ color: '#FFFFFF' });
    }
    static create(options = {}){
      return options.window ? new TrustedPrompt(options) : browser.windows.getAll({
        populate: true,
        windowTypes: ['popup']
      }).then(windows => {
        let existingPrompt = false;
        if (windows.length) {
          existingPrompt = windows.some(win => {
            let tab = win.tabs && win.tabs[0];
            return !tab ? false : !!tab.url.match(browser.extension.getURL('extension/views/popup/trusted-prompt'))
          });
        }
        if (existingPrompt) throw 'Trusted prompt is already open';
        return new TrustedPrompt(options);
      })
    }
  }

  OptionsPage = Object.assign(class OptionsPage {
    constructor(options){
      this.content = (OptionsPage.types[options.type] || {}).content || options.content;
      browser.runtime.onConnect.addListener(port => {
        if (port.name === 'optionspage-' + this.id) {
          port.onDisconnect.addListener(m => this.close());
        }
      });
      browser.runtime.openOptionsPage().then(() => {
        browser.tabs.query({}).then(tabs => {
          this.id = tabs.pop().id;
          OptionsPage.active[tab.id] = this;
        })
      })
    }
    close(){
      delete OptionsPage.active[this.id];
      return browser.tabs.remove(this.id).catch(e => console.log(e));
    }
  }, {
    active: {},
    types: {
      auth: {
        content: `<h1>Hello World!</h1>`
      }
    },
    initialize: function(win){
      let body = win.document.body;
      body.style.width = '1000px';
      body.style.height = '1000px';
      return browser.tabs.query({}).then(tabs => {
        var tab = tabs.pop();
        var page = OptionsPage.active[tab.id];
        if (!page) throw 'matching OptionsPage instance not found';
        body.innerHTML = page.content;
        win.browser.runtime.connect({ name: 'optionspage-' + tab.id });
        return page;
      })    
    }
  });



})();

var storage = browser.storage.local;

EXT = {
  storage: {
    get (...keys){
      return storage.get(keys);
    },
    set (key, value){
      var item = key;
      if (arguments.length > 1){
        item = {};
        item[key] = value;
      }
      return storage.set(key);
    },
    remove (...keys){
      return storage.remove(keys);
    },
    clear() {
      return storage.clear();
    }
  }
};

})();















// var runtimeEvents = {};
// var inBackground = browser.extension.getBackgroundPage && window == browser.extension.getBackgroundPage();


  //context: inBackground ? 'background' : location.protocol.match('-extension:') ? 'extension' : 'content',
  //   ready: [DIDManager.ready],


  // if (browser.extension.getBackgroundPage() === window) {
  //   browser.runtime.onMessage.addListener((event, sender) => {
  //     let page = OptionsPage.active[event.optionsPageID];
  //     if (page && event.type === 'optionspage') {
  //       switch(event.action) {
  //         case 'close': page.close();
  //         case 'keepalive': page.count();
  //         case 'content': page.sendContent();  
  //       }
  //     }
  //     return false;
  //   });
  // }




//   protocols: {
//     'did-auth': {
//       trigger: resolve => {
//         const parseProtocol = did => did.match(/^([^:]+)/)[0];
//         window.addEventListener('submit', e => {
//           var uri = e.target.action;
//           if (parseProtocol(uri || '') == 'did-auth') {
//             e.preventDefault();
//             e.cancelBubble = true;
//             resolve({ uri: uri,  origin: location.hostname || location.origin });
//           }
//         }, true);
//       },
//       handler: async (response, port) => {
//         if (await DIDManager.count() > 0) EXT.storage.get('DIDRequestPermissions').then(async permissions => {
//           var permission = permissions[response.origin] || {};
//           if (permission == 'denied') return;
//           EXT.popup({
//             view: 'picker',
//             activity: 'pick-did',
//             callback: function(did) {
//               console.log(response.uri, did);
//             }
//           })
//         })
//       }
//     }
//   },
  // addEvent(tabId, type, fn){
  //   var events = (runtimeEvents[tabId] || (runtimeEvents[tabId] = {}));
  //   (events[type] || (events[type] = [])).push(fn);
  // },
  // removeEvent(tabId, type, fn){
  //   var events = runtimeEvents[tabId];
  //   if (events[type]) events[type] = events[type].filter(listener => listener !== fn)
  // },
  // fireEvent(type, value){
  //   browser.runtime.sendMessage({
  //     event: type,
  //     value: value
  //   });
  // }


// if (EXT.env == 'background') {
//   browser.runtime.onConnect.addListener(port => {
//     var protocol = EXT.protocols[port.name];
//     if (protocol) port.onMessage.addListener(protocol.handler);
//   });
//   // Listen for tabs sending back event-coded messages, and call any matching listeners we have
//   browser.runtime.onMessage.addListener((obj, sender) => {
//     var events = runtimeEvents[sender.tab.id];
//     if (events[obj.event]) {
//       events[obj.event].forEach(fn => fn(obj.value));
//     }
//   });
//   // Clean up events from destroyed windows to prevent memory leaks
//   browser.tabs.onRemoved.addListener(tabId => {
//     delete runtimeEvents[tabId];
//   });
// }
// else if (EXT.env == 'content') {
//   for (let z in EXT.protocols) {
//     let port = browser.runtime.connect({ name: z });
//     EXT.protocols[z].trigger(msg => {
//       port.postMessage(msg);
//     });
//   }
// }

// // Protocol 'did'
// //   browser.tabs.update(sender.tab.id, {
// //     url: browser.extension.getURL('views/profile/profile.html?url=') + msg.url
// //   }).then(val => {
// //     console.log(val);
// //   }).catch(e => console.log(e));

// // Protocol 'hub'
// //   browser.tabs.update(sender.tab.id, {
// //     url: browser.extension.getURL('views/profile/profile.html?url=') + msg.url
// //   }).then(val => {
// //     console.log(val);
// //   }).catch(e => console.log(e));

// EXT.ready = Promise.all(EXT.ready);

