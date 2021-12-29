
import('./js/modules/extension-messenger.mjs').then(module => {
  const Messenger = module.default;
  console.log(Messenger.env);
});

let pageScript = document.createElement('script');
    pageScript.type = 'module';
    pageScript.src = chrome.runtime.getURL('extension/page.mjs');
    pageScript.async = false;
    document.documentElement.prepend(pageScript);
