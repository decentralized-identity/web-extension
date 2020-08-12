  
  // check to see if executing in a page script

(function(){

  window.extensionEnvironment = (() => {
    var extension = window.browser && window.browser.extension;
    if (extension && extension.getBackgroundPage) {
      return extension.getBackgroundPage() === window ? 'background' : 'elevated';
    }
    else return !extension || !extension.onMessage ? 'page' : 'content';
  })();

  function mapDescriptorById(type, ddo){
    let obj = {};
    if (!ddo[type]) (Array.isArray(ddo[type]) ? ddo[type] : [ddo[type]]).forEach(z => {
      obj[z.id.split('#').pop()] = z
    });
    return obj;
  }

  class DIDDocumentResult {
    constructor (did, src){
      this.did = did;
      this.resolverData = src;
      this.document = src.didDocument;
      this.keys = mapDescriptorById('publicKey', this.document);
      this.services = mapDescriptorById('services', this.document);
    }
  };

  if (!navigator.did) {

    if (extensionEnvironment === 'page') {

      Navigator.prototype.did = {
        resolve (did){
          return invokeIntent('resolveDID', did);
        },
        configuration (){
          return invokeIntent('getDIDConfiguration');
        },
        authenticate (props = {}){
          return invokeIntent('authenticateDID', props);
        }
      };

    }
    else {

      const unlinkedDID = 'Domain invoked authentication with a DID that failed configuration verification';
      const RESOLVER_ENDPOINT = null; //'http://localhost:3000/1.0/identifiers/';

      registerIntent({
        'resolveDID': did => {
          return fetch((RESOLVER_ENDPOINT || 'https://beta.discover.did.microsoft.com/1.0/identifiers/') + did)
            .then(async response => new DIDDocumentResult(did, await response.json()))
            .catch(e => console.log(e));
        },
        'authenticateDID': (props = {}) => {
          return invokeIntent('getDIDConfiguration').then(async config => {
            let entry = config.entries && config.entries[props.did];
            if (!entry) throw unlinkedDID;
            await invokeIntent('resolveDID', props.did).then(async ddo => {
              if (!props.mode) { // assume in-browser UI if no alternate mode declared
                return await invokeIntent('openAuthTab')
                                .then(tab => authTab = tab)
                                .catch(e => console.log(e))
              }
            });
          }).catch(e => {
            console.log(e);
          })
        }
      })

    }
  }

})();