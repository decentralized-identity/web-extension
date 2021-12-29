
import Messenger from './js/modules/extension-messenger.mjs';

console.log(Messenger.env);

Messenger.send({
  to: 'background',
  data: 'test'
})