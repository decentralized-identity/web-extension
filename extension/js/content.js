
(async function(){

  const root = document.documentElement;
  const {default: uuid} = await import('/extension/js/modules/uuid.js');
  const {default: DOM} = await import('/extension/js/modules/dom.js');
  const {default: DID} = await import('/extension/js/modules/did.js');
  const {default: Data} = await import('/extension/js/modules/data.js');
  const {default: Storage} = await import('/extension/js/modules/storage.js');
  const {default: ExtensionFrame} = await import('/extension/js/modules/extension-frame.js');

  var sidebarInstance;
  var sidebarOpen = false;

  function openSidebar(options = {}){
    if (sidebarOpen) {
      throw 'OperationError: DID interaction in progress, cannot initiate another until the previous interaction is finished';
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

  async function getAllowedConnection(msg, options = {}){
    if (msg.from !== 'page') return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw 'NotAllowedError: DID interactions are only permitted in secure contexts (https, localhost)';
    }
    let cxn = await DID.getConnection(location.origin);
    if (options.permission && cxn.permissions[options.permission] === false) {
      return false;
    }
    return cxn;
  }

  EXT.addMessageHandlers({
    'did_resolution': {
      untrusted: true,
      action: async (message) => {
        return await DID.resolve(message.props.did);
      }
    },
    'did_request': {
      untrusted: true,
      action: async (message) => {
        let cxn = await getAllowedConnection(message, { permission: 'did_request' });
        if (cxn === false) throw 'AbortError: No DID was returned';
        else if (cxn && cxn.did) {
          let clientNonce = uuid.generate();
          return {
            did: cxn.did,
            nonce: clientNonce,
            jws: await DID.sign(cxn.did, message.props.nonce + clientNonce)
          }
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
    'credential_offer': {
      untrusted: true,
      action: async (message) => {
        let cxn = getAllowedConnection(message, { permission: 'credential_offers' });
        await Data.validateObject(message.props.vc).catch(e => { throw e });
        if (!message.props.vc || cxn === false) throw 'AbortError: Credential was not accepted';
        EXT.addMessageHandlers({
          'credential_offer_config': {
            action: () => {
              return {
                uri: location.origin,
                vc: message.props.vc
              };
            }
          }
        });
        return await new Promise((resolve, reject) => {
          try {
            openSidebar({
              src: '/extension/views/offer-credential/index.html',
              onLoad(sidebar) {
                EXT.addMessageHandlers({
                  'credential_offer_response': {
                    action: async (message) => {
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
                reject('AbortError: Credential was not accepted');
                sidebarInstance = null;
              }
            })
          }
          catch (e){ reject(e) }
        }).finally(() => {
          EXT.removeMessageHandlers('did_request_config', 'credential_offer_response');
        })
      }
    },
    'sidebar_close': {
      action: (message) => {
        sidebarClose();
      }
    }
  });

})()