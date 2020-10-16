

(function(){

  let root = document.documentElement;

  root.appendChild([
    'extension/css/pages.css',
    'extension/js/utils.js',
    'extension/js/polyfills/navigator.js'
  ].reduce((frag, path) => {
    if (path.endsWith('.js')) {
      var element = document.createElement('script');
      element.async = false;
    }
    else {
      var element = document.createElement('link');
      element.rel = 'stylesheet';
      element.type = 'text/css';
    }
    element.src = element.href = browser.runtime.getURL(path);
    frag.appendChild(element);
    return frag;
  }, document.createDocumentFragment()));


  // EXT.addMessageHandlers({
  //   'sidebar_close': (props) => {
  //     console.log('sidebar_close');
  //   }
  // });

  let defaultPath = 'about:blank'
  let credentialExchangePath = 'extension/views/credential-exchange/index.html';
  

  let sidebar = new WebExtensionFrame(defaultPath, {
    id: 'did_ua_extension_sidebar'
  });
  let sidebarIframe = sidebar.element;
  let sidebarOpen = false;

  sidebarIframe.addEventListener('transitionend', e => {
    if (!sidebarOpen) sidebar.src = 'about:blank';
  });

  function toggleSidebar(open, src){
    sidebarOpen = open;
    sidebar.src = src || defaultPath;
    root.contains(sidebarIframe) || root.appendChild(sidebarIframe);
    skipAnimationFrame(() => {
      open ? sidebarIframe.setAttribute('open', '') : sidebarIframe.removeAttribute('open');
    })
  }


  EXT.addMessageHandlers({
    'credential_request': {
      untrusted: true,
      action: (props) => {
        toggleSidebar(true, credentialExchangePath);
      }
    },
    'sidebar_close': {
      action: (props) => {
        toggleSidebar()
      }
    }
  });

  // ['page', 'frame', 'content', 'background'].forEach(env => {
  //   let message = env + '_to_' + EXT.environment;
  //   if (env !== EXT.environment) {
  //     EXT.addMessageHandlers({
  //       [message]: {
  //         untrusted: true,
  //         action: (props) => {
  //           console.log(message + ' message handled');
  //           return message + ' callback sent to ' + env;
  //         }
  //       }
  //     });
  //   }
  // });

  // window.addEventListener('click', e => {

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

  // });



})()