  
  // check to see if executing in a page script

var PE = {
  "submission_requirements": [
    {
      "name": "Banking Information",
      "purpose": "We need to know if you have an established banking history.",
      "rule": "pick",
      "count": 1,
      "from": "A"
    },
    {
      "name": "Employment Information",
      "purpose": "We need to know that you are currently employed.",
      "rule": "all",
      "from": "B"
    },
    {
      "name": "Citizenship Information",
      "rule": "pick",
      "count": 1,
      "from": "C"
    }
  ],
  "input_descriptors": [
    {
      "id": "banking_input_1",
      "group": ["A"],
      "schema": {
        "uri": ["https://bank-standards.com/customer.json"],
        "name": "Bank Account Information",
        "purpose": "We need your bank and account information."
      },
      "constraints": {
        "limit_disclosure": true,
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:123|did:example:456"
            }
          },
          {
            "path": ["$.credentialSubject.account[*].account_number", "$.vc.credentialSubject.account[*].account_number", "$.account[*].account_number"],
            "purpose": "We need your bank account number for processing purposes",
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.credentialSubject.account[*].routing_number", "$.vc.credentialSubject.account[*].routing_number", "$.account[*].routing_number"],
            "purpose": "You must have an account with a German, US, or Japanese bank account",
            "filter": {
              "type": "string",
              "pattern": "^DE|^US|^JP"
            }
          }
        ]
      }
    },
    {
      "id": "banking_input_2",
      "group": ["A"],
      "schema": {
        "uri": [
          "https://bank-schemas.org/1.0.0/accounts.json",
          "https://bank-schemas.org/2.0.0/accounts.json"
        ],
        "name": "Bank Account Information",
        "purpose": "We need your bank and account information."
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:123|did:example:456"
            }
          },
          { 
            "path": ["$.credentialSubject.account[*].id", "$.vc.credentialSubject.account[*].id", "$.account[*].id"],
            "purpose": "We need your bank account number for processing purposes",
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.credentialSubject.account[*].route", "$.vc.credentialSubject.account[*].route", "$.account[*].route"],
            "purpose": "You must have an account with a German, US, or Japanese bank account",
            "filter": {
              "type": "string",
              "pattern": "^DE|^US|^JP"
            }
          }
        ]
      }
    },
    {
      "id": "employment_input",
      "group": ["B"],
      "schema": {
        "uri": ["https://business-standards.org/schemas/employment-history.json"],
        "name": "Employment History",
        "purpose": "We need to know your work history."
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.jobs[*].active"],
            "filter": {
              "type": "boolean",
              "pattern": "true"
            }
          }
        ]
      }
    },
    {
      "id": "citizenship_input_1",
      "group": ["C"],
      "schema": {
        "uri": ["https://eu.com/claims/DriversLicense.json"],
        "name": "EU Driver's License"
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:gov1|did:example:gov2"
            }
          },
          {
            "path": ["$.credentialSubject.dob", "$.vc.credentialSubject.dob", "$.dob"],
            "filter": {
              "type": "string",
              "format": "date",
              "minimum": "1999-5-16"
            }
          }
        ]
      }
    },
    {
      "id": "citizenship_input_2",
      "group": ["C"],
      "schema": {
        "uri": ["hub://did:foo:123/Collections/schema.us.gov/passport.json"],
        "name": "US Passport"
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.credentialSubject.birth_date", "$.vc.credentialSubject.birth_date", "$.birth_date"],
            "filter": {
              "type": "string",
              "format": "date",
              "minimum": "1999-5-16"
            }
          }
        ]
      }
    }
  ]
};

(function(){

  // function mapDescriptorById(type, ddo){
  //   let obj = {};
  //   if (!ddo[type]) (Array.isArray(ddo[type]) ? ddo[type] : [ddo[type]]).forEach(z => {
  //     obj[z.id.split('#').pop()] = z
  //   });
  //   return obj;
  // }

  // class DIDDocumentResult {
  //   constructor (did, src){
  //     this.did = did;
  //     this.resolverData = src;
  //     this.document = src.didDocument;
  //     this.keys = mapDescriptorById('publicKey', this.document);
  //     this.services = mapDescriptorById('services', this.document);
  //   }
  // };


  // ['page', 'frame', 'content', 'background'].forEach(env => {
  //   let message = env + '_to_' + EXT.environment;
  //   if (env !== EXT.environment) {
  //     EXT.addMessageHandlers({
  //       [message]: {
  //         untrusted: true,
  //         action: (props) => {
  //           console.log(message + ' message handled');
  //           return message + ' callback sent to ' + env;
  //         }
  //       }
  //     });
  //   }
  // });

  //window.addEventListener('click', e => {

  //   ['page', 'frame', 'content', 'background'].forEach(env => {
  //     [true, false].forEach(untrusted => {
  //       let message = EXT.environment + '_to_' + env + (untrusted ? '' : '_block');
  //       if (env !== EXT.environment) {
  //         EXT.sendMessage({
  //           type: message,
  //           to: env,
  //           callback: response => {

  //             console.log(message + ' callback arrived at ' + EXT.environment)
  //           },
  //           error: error => {
  //             console.log(error)
  //           }
  //         });   
  //       }
  //     });
  //   });
  // });

  if (!navigator.did || !navigator.did.dev) {

    if (EXT.environment === 'page') {

      EXT.addMessageHandlers({
        'sidebar_close': (message) => {
          console.log('page sidebar_close', message.props);
          return 'sidebar_close from page handler';
        }
      });

      let didInterfaces = {
        dev: {
          async resolve (did) { // EXAMPLE: did:btcr:x705-jznz-q3nl-srs
            return EXT.request({
              type: 'did_resolution',
              to: 'content',
              props: { did: did }
            })
          },
          configuration (){
            
          },
          authenticate (props = {}){
            
          },
          async requestDid (nonce){
            if (!nonce) throw 'DataError: required nonce parameter is missing';
            return EXT.request({
              type: 'did_request',
              to: 'content',
              props: {
                nonce: nonce
              }
            });
          },
          requestCredentials (presentationDefinition = PE){
            return new Promise ((resolve, reject) => {
              EXT.sendMessage({
                type: 'credential_request',
                to: 'content',
                props: {
                  presentation_definition: PE
                },
                callback: response => {
                  console.log('requestCredentials callback');
                  resolve(response);
                },
                error: error => {
                  reject(error);
                }
              });
            })
          },
          async offerCredential (vc){
            if (!vc) throw 'DataError: you did not pass a credential to offer the user';
            return EXT.request({
              type: 'credential_offer',
              to: 'content',
              props: {
                vc: vc
              }
            });
          },
        }
      };

      if (!navigator.did) {
        Navigator.prototype.did = didInterfaces;
      }
      else if (!navigator.did.dev) {
        for (let interface in didInterfaces) {
          if (!Navigator.prototype.did[interface]) {
            Object.defineProperty(Navigator.prototype.did, interface, {
              enumerable: true,
              value: didInterfaces[interface]
            })
          }
        }
      }
    }
  }

})();