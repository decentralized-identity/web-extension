
import DIDMethods from './js/did-methods/config.mjs';

const Rules = [
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "responseHeaders": [
        { "header": "DID-Support", "operation": "set", "value": "1" },
        { "header": "DID-Methods", "operation": "set", "value": Object.keys(DIDMethods.supportedMethods).join(', ') }
      ]
    },
    "condition": { "urlFilter": "*://*/*", "resourceTypes": ["main_frame"] }
  }
];

export default Rules