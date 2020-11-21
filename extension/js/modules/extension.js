
export default {
  connectAPI(name, methods){
    if (EXT.environment === 'background') {
      EXT.addMessageHandlers({
        [name]: {
          action: async (msg) => {
            return await methods[msg.props.method](...msg.props.args);
          }
        }
      });
    }
    else if (EXT.environment === 'content') {
      for (let z in methods) {
        methods[z] = async function(){
          return EXT.request({
            type: name,
            to: 'background',
            props: {
              method: z,
              args: Object.values(arguments)
            }
          });
        }
      }
    }
  }
}