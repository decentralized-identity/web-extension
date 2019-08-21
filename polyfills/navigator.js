  
  // check to see if executing in a page script

(function(){

  function uuid() { // IETF RFC 4122, version 4
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  if (!navigator.did) {
    if (!browser || !browser.runtime) {

      var invocations = {};

      function invokeMethod(method, args){
        var id = uuid();
        return invocations[id] = new Promise((resolve, reject) => {
          postMessage({
            id: id,
            for: 'did-polyfill-extension',
            method: method,
            args: Array.from(args)
          }, '*');
        });
      }

      window.addEventListener('message', function(e) {
        let data = event.data;
        if (e.source == window && data && data.for === 'did-polyfill-extension') {
          let invocation = invocations[data.id];
          if (invocation) {
            delete invocations[data.id];
            invocation.resolve(...Array.from(data.result));
          }
        }
      });

      Navigator.prototype.did = {
        resolve (did){
          return invokeMethod('navigator.did.resolve', arguments);
        },
        configuration(){
          return invokeMethod('navigator.did.configuration');
        },
        authenticate(requestingDID, props){
          return invokeMethod('navigator.did.authenticate', arguments);
        }
      };
    }
    else {

      const RESOLVER_ENDPOINT = null; //'http://localhost:3000/1.0/identifiers/';

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

      Navigator.prototype.did = {
        async resolve (did){
          return fetch((RESOLVER_ENDPOINT || 'https://beta.discover.did.microsoft.com/1.0/identifiers/') + did)
            .then(async response => new DIDDocumentResult(did, await response.json()))
            .catch(e => console.log(e));
        },
        async configuration(){
          if (location.hostname !== 'localhost' && !location.protocol.match(/^(https)$/)) {
            throw 'unsupported value: protocol of calling origin must be https';
          }
          fetch(location.origin + '/.well-known/did-configuration').then(async function(response){
            let json = await response.json();
            console.log(json);
          })
        },
        async authenticate(requestingDID, props){
          navigator.did.configuration().then(response => {

            console.log(response);
          })
        }
      };

    }
  }

})();