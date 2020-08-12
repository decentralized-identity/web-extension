
let background;
let searchParams = new URLSearchParams(location.search);
let openerID = searchParams.get('opener');
browser.runtime.getBackgroundPage().then(page => background = page);

window.addEventListener('blur', event => {
  if (background.authTabs) {
    browser.tabs.update(background.authTabs[Number(openerID)].auth.id, { active: true, highlighted: true })
  }
});


// var faviconIteration = {
//   step: 0
// }
// let faviconStep = 0;

// anime({
//   targets: faviconIteration,
//   step: 20,
//   loop: true,
//   direction: 'alternate',
//   easing: 'steps(20)',
//   duration: 650,
//   update: function() {
//     let nextStep = Math.round(faviconIteration.step);
//     if (faviconStep !== nextStep) {
//       faviconStep = nextStep;
//       favicon.href = `/extension/images/favicon/user-yellow-${nextStep}.png`;
//       //browser.browserAction.setIcon({ path: favicon.href });
//     }
//   }
// });