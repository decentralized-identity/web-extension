
import Messenger from './js/modules/extension-messenger.js';

const NavigatorInterfaces = {
  api: {
    enumerable: false,
    writeable: false,
    configurable: false,
    value: function (property){
      return NavigatorInterfaces[property].metadata;
    }
  },
  requestIdentifier: {
    metadata: {
      version: '0.0.1'
    },
    enumerable: true,
    writeable: false,
    configurable: false,
    value: () => new Promise(resolve => {
      Messenger.send({
        topic: 'requestIdentifier',
        to: 'background',
        callback: response => resolve(response)
      })
    })
  },
  requestCredentials: {
    metadata: {
      version: '0.0.1'
    },
    enumerable: true,
    writeable: false,
    configurable: false,
    value: () => new Promise(resolve => {
      Messenger.send({
        topic: 'requestCredentials',
        to: 'background',
        callback: response => resolve(response)
      })
    })
  }
}

if (!Navigator.prototype.did) Navigator.prototype.did = {};

for (let prop in NavigatorInterfaces) {
  if (!Navigator.prototype.did[prop]){
    Object.defineProperty(Navigator.prototype.did, prop, NavigatorInterfaces[prop])
  }
}
