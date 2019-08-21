

actions = {
  close: function(){
    prompt.close()
  }
}

function invokeActions(e){
  let node = e.target;
  let action = node.getAttribute('action');
  if (action) {
    action.trim().split(/\s+/).forEach(z => {
      if (actions[z]) actions[z]();
    })
  }
}

document.addEventListener('click', invokeActions);