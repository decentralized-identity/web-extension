

import '/extension/js/utils.js';
import DID from '/extension/js/modules/did.js'; // DO NOT REMOVE!!!
import Data from '/extension/js/modules/data.js';
import Tabs from '/extension/js/modules/tabs.js';
import Downloads from '/extension/js/modules/downloads.js';

(function(){

  EXT.data = Data;

  const extensionURL = browser.runtime.getURL('/');
  const dashboardURL = extensionURL + 'extension/views/dashboard/index.html';
  const imageURL = extensionURL + 'extension/images/icons/';
  const darkMode = matchMedia('(prefers-color-scheme: dark)').matches;

  if (darkMode) {
    browser.browserAction.setIcon({
      path: {
        16: imageURL + 'user-16-dark-mode.png',
        24: imageURL + 'user-24-dark-mode.png',
        32: imageURL + 'user-24-dark-mode.png'
      }
    })
  }

  async function parseDidData(dl){
    let url = new URL(dl.finalUrl);
    let obj = await fetch(dl.finalUrl).then(raw => raw.json());
    Data.storeObject(url.origin, obj)
      .then(() => {
        console.log('Works: ', url.origin);
      })
      .catch(e => console.log(e))
  }

  browser.browserAction.onClicked.addListener(tab => {
    Tabs.raiseTab(dashboardURL);
  });

  let didDataRegex = /.*[.did].*.json/;
  Downloads.onFileReady.addListener(async dl => {
    if (dl.title.match(didDataRegex)) parseDidData(dl)
  })









  
  
  // ['page', 'frame', 'content', 'background'].forEach(env => {
  //   [true, false].forEach(untrusted => {
  //   let message = env + '_to_' + EXT.environment + (untrusted ? '' : '_block');
  //   if (env !== EXT.environment) {
  //       EXT.addMessageHandlers({
  //         [message]: {
  //           untrusted: untrusted,
  //           action: (props) => {
  //             console.log(message + ' message handled');
  //             return message + ' callback sent to ' + env;
  //           }
  //         }
  //       });     
  //     }
  //   })
  // });

  // window.sendTestMessages = function(){

  //   ['page', 'frame', 'content', 'background'].forEach(env => {
  //     let message = EXT.environment + '_to_' + env
  //     if (env !== EXT.environment) {
  //       EXT.sendMessage({
  //         type: EXT.environment + '_to_' + env,
  //         to: env,
  //         callback: response => {
  //           console.log(message + ' callback arrived at ' + EXT.environment)
  //         },
  //         error: error => {
  //           console.log(error)
  //         }
  //       });   
  //     }

  //   });

  // };

})();