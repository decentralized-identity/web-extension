
import { ExtensionMessenger as Messenger } from '/extension/js/modules/extension-messenger.js';
import DIDMethods from '/extension/js/did-methods/config.mjs';

const NavigatorInterfaces = {
  'api': {
    enumerable: true,
    writeable: false,
    configurable: false,
    value: property => NavigatorInterfaces[property].metadata
  },
  'supportedMethods': {
    metadata: {
      version: '0.0.1'
    },
    enumerable: true,
    writeable: false,
    configurable: false,
    value: Object.keys(DIDMethods.supportedMethods)
  },
  'resolve': {
    metadata: {
      version: '0.0.1'
    },
    enumerable: true,
    writeable: false,
    configurable: false,
    value: async (didUri) => {
      let response = await Messenger.send({
        topic: 'resolveIdentifier',
        to: 'content',
        callback: true,
        data: {
          identifier: didUri
        }
      }).promise;

      if (response.error) throw response.error
      else if (response.result) return {
        result: response.result
      }
    }
  },
  'requestAccess': {
    metadata: {
      version: '0.0.1'
    },
    enumerable: true,
    writeable: false,
    configurable: false,
    value: (params = {}) => {
      let did = params.identifier;
      return Messenger.send({
        topic: 'requestAccess',
        to: 'content',
        callback: true,
        data: {
          identifier: did || {
            supportedMethods: params?.identifier?.supportedMethods || ['ion', 'key'],
            challenge: did?.challenge || '123'
          },
          datastore: params?.datastore
        }
      }).promise
    }
  },
  'requestCredentials': {
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
