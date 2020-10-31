
(async function(){

  const root = document.documentElement;
  const {default: DOM} = await import('/extension/js/modules/dom.js');
  const {default: DID} = await import('/extension/js/modules/did.js');
  const {default: Storage} = await import('/extension/js/modules/storage.js');
  const {default: ExtensionFrame} = await import('/extension/js/modules/extension-frame.js');

  var sidebarInstance;
  var sidebarOpen = false;

  function openSidebar(options = {}){
    if (sidebarOpen) {
      throw 'OperationError: DID interaction in progress, cannot initiate another unil the previous interaction is finished';
    }
    sidebarInstance = sidebarInstance || new ExtensionFrame({
      classes: 'did-extension-sidebar',
      onLoad(sidebar){
        if (options.onLoad) options.onLoad(sidebar);
      },
      onHide(sidebar) {
        sidebar.src = null;
        if (root.contains(sidebar.element)) {
          sidebar.element.parentNode.removeChild(sidebar.element);
        }
        sidebarOpen = false;
        if (options.onHide) options.onHide(sidebar);
      }
    });
    sidebarInstance.src = options.src;
    root.contains(sidebarInstance.element) || root.appendChild(sidebarInstance.element);
    DOM.skipAnimationFrame(() => sidebarInstance.show());
    sidebarOpen = true;
  }

  function sidebarClose(){
    if (sidebarInstance) sidebarInstance.hide();
  }

  EXT.addMessageHandlers({
    'did_request': {
      untrusted: true,
      action: async (message) => {
        if (message.from !== 'page') return;
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          throw 'NotAllowedError: DID interactions are only permitted in secure contexts (https, localhost)';
        }
        let peer = await DID.getPeer(location.origin);
        if (peer) {
          if (peer.permissions.did_request === false) throw 'AbortError: No DID was returned';
          if (peer.did) return peer.did.uri;
        }
        EXT.addMessageHandlers({
          'did_request_config': {
            action: () => {
              return {
                uri: location.origin,
                nonce: message.props.nonce
              }
            }
          }
        });
        return await new Promise((resolve, reject) => {
          try {
            openSidebar({
              src: '/extension/views/did-request/index.html',
              onLoad(sidebar) {
                EXT.addMessageHandlers({
                  'did_response': {
                    action: async (message) => {
                      console.log(message);
                      if (message.frame == sidebar.name) {
                        resolve(message.props);
                        sidebar.hide();
                        sidebarInstance = null;
                      }
                    }
                  }
                });
              },
              onHide(){
                reject('AbortError: No DID was returned');
                sidebarInstance = null;
              }
            })
          }
          catch (e){ reject(e) }
        }).finally(() => {
          EXT.removeMessageHandlers('did_request_config', 'did_response');
        })
      }
    },
    'credential_request': {
      untrusted: true,
      action: (message) => {
        openSidebar('/extension/views/presentation-exchange/index.html')
      }
    },
    'sidebar_close': {
      action: (message) => {
        sidebarClose();
      }
    }
  });

})()