
import { Env } from '/extension/js/modules/env.js';
import { Natives } from '/extension/js/modules/natives.js';
import { ExtensionMessenger as Messenger } from '/extension/js/modules/extension-messenger.js';

if (Env.context === 'background') {
  Messenger.addListener('openWindow', async message => {
    return Browser.openWindow(message.data);
  })

  Messenger.addListener('getTabId', async (message, event) => {
    return event?.tab?.id || null;
  })
}

function enforce(env){
  if (Env.context !== env) throw `This method is only available in ${env} contexts`;
}

const Browser = {
  background: {

  },
  content: {
    getTabId(){
      enforce('content');
      return Messenger.send({
        topic: 'getTabId',
        to: 'background',
        callback: true
      }).promise
    },
    async getTabData(){
      return Browser.localStorage.get('tab:' + await Browser.content.getTabId());
    }
  },
  openWindow (params = {}){
    if (Env.context === 'background') {
      return new Promise(resolve => {
        chrome.windows.create(
          Object.assign({}, {
            url: params.url || 'about:blank',
            type: params.type || 'popup',
            focused: params.focused && params.state !== 'fullscreen' && params.state !==  'maximized'
          },
          params.state ? 
            { state: params.state } : 
            Natives.pick(params, ['height', 'width', 'top', 'left'])
        ), async window => {
          if (params.tabData) {
            await Browser.localStorage.set('tab:' + window.tabs[0].id, params.tabData)
          }
          if (params.closeOnBlur) {
            // chrome.windows.onFocusChanged.addListener(function closeOnBlur(){
            //   chrome.windows.onFocusChanged.removeListener(closeOnBlur);
            //   chrome.windows.remove(window.id);
            // })
          }
          resolve(window)
        })
      });
    }
    else {
      return Messenger.send({
        topic: 'openWindow',
        to: 'background',
        callback: true,
        data: params
      }).promise
    }
  },
  localStorage: {
    async get (bucket, defaultValue) {
      return new Promise (resolve => {
        chrome.storage.local.get(bucket, async result => {
          let value = result[bucket];
          if (typeof value === 'undefined' && typeof defaultValue !== 'undefined') {
            value = defaultValue;
            await Browser.localStorage.set(bucket, value);
          }
          resolve(value);
        });
      });
    },
    async getAll () {
      return new Promise (resolve => {
        chrome.storage.local.get(null, async result => resolve(result));
      });
    },
    async set (bucket, value) {
      return new Promise (resolve => {
        chrome.storage.local.set({ [bucket]: value }, () => resolve());
      });
    },
    async remove (entries) {
      let buckets = Array.isArray(entries) ? entries : Array.from(arguments);
      return new Promise (resolve => {
        chrome.storage.local.remove(buckets, () => resolve());
      });
    },
    async modify (bucket, fn, defaultValue) {
      let value = await Browser.localStorage.get(bucket, defaultValue);
      let modified = await fn(value);
      await Browser.localStorage.set(bucket, modified);
      return modified;
    }
  }
}

globalThis.Browser = Browser;

export { Browser };