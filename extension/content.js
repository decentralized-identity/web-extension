
Promise.all([
  import('/extension/js/modules/env.js'),
  import('/extension/js/modules/did.js'),
  import('/extension/js/did-methods/config.js'),
  import('/extension/js/modules/dom.js'),
  import('/extension/js/modules/uuid.js'),
  import('/extension/js/modules/browser.js'),
  import('/extension/js/modules/extension-messenger.js')
]).then(async modules => {

  const Env = modules[0].Env;
  const DID = modules[1].DID;
  const DIDMethods = modules[2].default;
  const DOM = modules[3].DOM;
  const UUID = modules[4].UUID;
  const Browser = modules[5].Browser;
  const Messenger = modules[6].ExtensionMessenger;
 
  let pageScript = document.createElement('script');
      pageScript.type = 'module';
      pageScript.src = Env.baseUrl + '/page.js';
      pageScript.async = false;
      document.documentElement.prepend(pageScript);

  Messenger.addListener('requestAccess', async message => {
    let response = {};
    let params = message.data;
    let identifier = params.identifier;
    let connection = await DID.getConnection(message.origin);
    console.log(identifier, message.origin, connection);

    if (identifier) {
      if (typeof identifier === 'string') {
        if (connection.did !== identifier) {
          return {
            error: 'No connection was found for the identifier provided.'
          }
        }
      }
      else if (connection) {
        if (identifier.challenge) {
          response.identifier = {
            uri: connection.did,
            signature: await DID.sign(connection.did, params.challenge)
          }
        }
        else return {
          error: 'The `challenge` parameter was missing or malformed'
        }
      }
    }
    else return {
      error: 'No identifier access was requested and no existing identifier connection was found. All requests for access must be connected to an identifier.'
    }
    console.log(response.identifier || params.datastore);
    if (!response.identifier || params.datastore) {
      Browser.openWindow({
        url: Env.baseUrl + `/views/request-did/index.html?origin=${message.origin}`,
        width: 500,
        height: 650,
        focused: true,
        closeOnBlur: true,
        tabData: {
          message: message,
          response: response
        }
      });
    }

    else return response;
  });

  
});
