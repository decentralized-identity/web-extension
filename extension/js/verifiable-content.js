
(async function(){

const {default: DID} = await import('/extension/js/modules/did.js');
const {default: DOM} = await import('/extension/js/modules/dom.js');
const {default: CryptoUtils} = await import('/extension/js/modules/crypto-utils.js');

const verifiableElements = {
  'IMG': {
    attr: 'src'
  },
  'SCRIPT': {
    attr: 'src'
  }
};

async function onMutation(element){
  let child = element.children[0];
  let tag = verifiableElements[child ? child.tagName : null];
  if (tag) {
    let source = child.getAttribute(tag.attr);
    let base58Hash = await fetch(source).then(async stream => {
      let digest = await crypto.subtle.digest('SHA-256', await stream.arrayBuffer());
      let utils = await CryptoUtils;
      return utils.base58.encode(new Uint8Array(digest));
    });
    let did = await DID.get(element.getAttribute('did'));
    console.log(base58Hash);
    if (did) {
      let valid = await DID.verify(did.keys.public, base58Hash, element.getAttribute('signature'));
      valid ? element.setAttribute('verified', '') : element.removeAttribute('verified');
      console.log(valid ? 'Yay, the signatures match! 😀' : 'They lie! 👿')
    }
  }
  else {
    // console.log(element, element.textContent);
  }
};

const containerName = 'VERIFIABLE-CONTENT';
const observer = new MutationObserver(function(mutations, observer) {
  for (let mutation of mutations) {
    let target = mutation.target;
    let parent = target.parentNode;
    if (target.tagName === containerName) {
      onMutation(target);
    }
    else if (parent && parent.tagName === containerName) {
      onMutation(parent);
    }
  }
});

observer.observe(document.documentElement, {
  subtree: true,
  childList: true,
  attributeFilter: ['src']
});

document.querySelectorAll('verifiable-content').forEach(node => onMutation(node))

})();