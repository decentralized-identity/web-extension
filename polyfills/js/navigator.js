  
  /* Navigator.prototype.did */
  
  if (!navigator.did) {

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
          .then(response => new DIDDocumentResult(did, await response.json()))
          .catch(e => console.log(e));
      },
      async configuration(){
        if (!location.protocol.match(/^(https)$/)) throw 'unsupported value: protocol of calling origin must be https';
        fetch(location.origin + '/.well-known/did-configuration').then(response => {
          let json = await response.json();
          console.log(json);
        })
      }
      async authenticate(requestingDID, props){

        requestingDID
        props.
      }
    };

  }
