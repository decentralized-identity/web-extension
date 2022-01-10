
import { Browser } from '/extension/js/modules/browser.js';
import { ExtensionMessenger as Messenger } from '/extension/js/modules/extension-messenger.js';

const dashboardUrl = chrome.runtime.getURL('/extension/views/dashboard/index.html');

chrome.runtime.onInstalled.addListener(() => {
  
});

chrome.action.onClicked.addListener(tab => {

  chrome.tabs.query({ url: dashboardUrl }, tabs => {  // Open or switch to dashboard tab when browser action is clicked
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id)
    }
    else chrome.tabs.create({
      url: dashboardUrl,
      active: true,
      index: 0
    })
  });

});

chrome.tabs.onRemoved.addListener(tabId => {
  Browser.localStorage.remove('tab:' + tabId);
})

// setTimeout(function(){
//   Messenger.send({
//     topic: 'background > tab',
//     to: 'content',
//     tabs: [170],
//     data: 'calling a specific tab',
//   })

//   Messenger.send({
//     topic: 'background > tabs',
//     to: 'content',
//     data: 'test'
//   })

// }, 5000);

// chrome.runtime.onInstalled.addListener(() => {
//   console.log('installed');
// });

// chrome.action.onClicked.addListener(tab => {
//   console.log(tab);
// });

// chrome.tabs.onCreated.addListener(tab => {
//   console.log(tab);
// })