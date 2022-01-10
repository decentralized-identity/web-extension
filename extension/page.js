
import { ExtensionMessenger as Messenger } from '/extension/js/modules/extension-messenger.js';

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
    value: () => Messenger.send({
      topic: 'requestIdentifier',
      to: 'content',
      callback: true
    }).promise
  },
  requestCredentials: {
    metadata: {
      version: '0.0.1'
    },
    enumerable: true,
    writeable: false,
    configurable: false,
    value: () => Messenger.send({
      topic: 'requestCredentials',
      to: 'content',
      callback: true
    }).promise
  }
}

if (!Navigator.prototype.did) Navigator.prototype.did = {};

for (let prop in NavigatorInterfaces) {
  if (!Navigator.prototype.did[prop]){
    Object.defineProperty(Navigator.prototype.did, prop, NavigatorInterfaces[prop])
  }
}
