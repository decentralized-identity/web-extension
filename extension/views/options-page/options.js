

// var prompt = new TrustedPrompt({ window: browser.windows.getCurrent() });

var background = window.browser.extension.getBackgroundPage();
var OptionsPage = background.OptionsPage;

OptionsPage.initialize(window).then(page => {
  
});


// actions = {
//   close: function(){
//     browser.tabs.remove(parentTab.id);
//   }
// }

// function invokeActions(e){
//   let node = e.target;
//   let action = node.getAttribute('action');
//   if (action) {
//     action.trim().split(/\s+/).forEach(z => {
//       if (actions[z]) actions[z]();
//     })
//   }
// }

// document.addEventListener('click', invokeActions);



