
(function(){

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

  function createOrActivateTab(url){
    browser.tabs.query({
      url: [url, url + '?*'],
      currentWindow: true
    }).then(tabs => {
      if (!tabs.length) browser.tabs.create({ url: url });
      else browser.tabs.update(tabs[0].id, { active: true });
    })
  }

  browser.browserAction.onClicked.addListener(tab => {
    createOrActivateTab(dashboardURL);
  });


  
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