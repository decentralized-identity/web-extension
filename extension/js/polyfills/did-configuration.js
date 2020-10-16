
(function(){

  let configuration;
  let supportedProtocols = { https: true };

  window.getConfiguration = function getConfiguration(loc = location){
    return configuration ? configuration : new Promise((resolve, reject) => {
      if (loc.hostname !== 'localhost' && !supportedProtocols[loc.protocol.split(':')[0]]) {
        reject('unsupported value: protocol of calling origin must be https');
      }
      fetch(loc.origin + '/.well-known/did-configuration')
        .then(async response => {
          if (response.status > 399) reject('DID Configuration resource not found');
          resolve(await response.json());
        })
        .catch(e => reject(e));
    });
  }

  configuration = getConfiguration().catch(e => console.log(e));

  registerIntent({
    'getDIDConfiguration': getConfiguration
  });

})();