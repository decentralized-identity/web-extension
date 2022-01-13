
# DID User Agent Extension

This an EARLY ALPHA of an extension that augments a Web browser with low-level DID functionality, DOM API prollyfills, and a generic wallet-like DID User Agent UI that allows for management of DIDs, credentials, and datastore interactions.

The following features being developed (subject to change):

- [x] HTTP Header to provide awareness of DID features to servers.
- [x] `navigator.did.supportedMethods` for dynamic awareness of supported DID Methods.
- [x] `navigator.did.resolve()` - resolve the DID Documents of supported DID implementations.
- [ ] `navigator.did.requestAccess()`:
  - [x] Request disclosure of a DID + signed challenge for authentication.
  - [ ] Request a grant of datastore permissions (capabilities model is pending).
- [ ] `navigator.did.requestCredentials()` - request presentation of Verifiable Credentials via Presentation Exchange evaluation and fulfillment.
- [ ] `navigator.did.issueCredentials()` - initiate a credential issuance flow via Credential Manifest request and fulfillment. (effectively a proxy of Hub-based credential issuance Actions).
- [ ] Identity Hub interactions for Permissions, Actions, Collections, and Profile interfaces.
