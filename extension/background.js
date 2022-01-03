

import Messenger from '/extension/js/modules/extension-messenger.js';

const dashboardUrl = chrome.runtime.getURL('/extension/views/dashboard/index.html');


chrome.runtime.onInstalled.addListener(() => {

  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['extension/content.js'],
      })
    });
  });

});


chrome.action.onClicked.addListener(tab => {

  chrome.tabs.query({ url: dashboardUrl }, tabs => {
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id)
    }
    else chrome.tabs.create({
      url: dashboardUrl,
      active: true,
      index: 0
    })
  });

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['extension/content.js']
  });
});


Messenger.addListener('requestIdentifier', (message) => {
  console.log('requestIdentifier: ', message);
  return 'did:ion:123';
});

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