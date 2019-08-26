  
  // check to see if executing in a page script

(function(){

  //console.log('navigator.js: ' + extensionEnvironment);

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

    var extension = window.browser && window.browser.extension;

    if (!extension || !extension.onMessage) {

      Navigator.prototype.did = {
        resolve (did){
          return extensionRequest('navigator.did.resolve', did);
        },
        configuration(){
          return extensionRequest('navigator.did.configuration', location);
        },
        authenticate(did, props){
          return extensionRequest('navigator.did.authenticate', did, props);
        }
      };
    }
    else {

      const RESOLVER_ENDPOINT = null; //'http://localhost:3000/1.0/identifiers/';

      Navigator.prototype.did = {
        resolve (did){
          return fetch((RESOLVER_ENDPOINT || 'https://beta.discover.did.microsoft.com/1.0/identifiers/') + did)
            .then(async response => new DIDDocumentResult(did, await response.json()))
            .catch(e => console.log(e));
        },
        async configuration(){
          if (location.hostname !== 'localhost' && !location.protocol.match(/^(https)$/)) {
            throw 'unsupported value: protocol of calling origin must be https';
          }
          return fetch(location.origin + '/.well-known/did-configuration').then(async function(response){
            return await response.json();
          });
        },
        async authenticate(did, props){
          return navigator.did.configuration().then(config => {
            return extensionRequest('browser.tabs.create', {
              url: browser.extension.getURL('/extension/views/tabs/auth/index.html')
            }).then(result => result)
          });
        }
      };

      registerExtensionIntents({
        'navigator.did.resolve': (did) => navigator.did.resolve(did),
        'navigator.did.configuration': (location) => navigator.did.configuration(location),
        'navigator.did.authenticate': (did, props) => navigator.did.authenticate(did, props)
      })

    }
  }

})();