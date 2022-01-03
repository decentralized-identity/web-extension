
import('./js/modules/extension-messenger.js').then(module => {

  let pageScript = document.createElement('script');
      pageScript.type = 'module';
      pageScript.src = chrome.runtime.getURL('extension/page.ms');
      pageScript.async = false;
      document.documentElement.prepend(pageScript);
  
  const Messenger = module.default;

  // Messenger.addListener('page > content', message => {
  //   console.log('page > content LISTENER:', message);
  //   return 'response from content to page';
  // });

  // Messenger.addListener('background > tab', message => {
  //   console.log('background > tab LISTENER:', message);
  // });

  // Messenger.addListener('background > tabs', message => {
  //   console.log('background > tabs LISTENER:', message);
  // });
  
});
