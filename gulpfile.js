
const fs = require('fs-extra');
const gulp = require('gulp');

async function compileContentScript(){
  return Promise.all([
      './extension/js/content.js',
      './extension/js/polyfills/web-extensions.js',
      './extension/js/utils.js',
      './extension/js/polyfills/navigator.js'
    ].map(file => fs.promises.readFile(file, 'utf8'))).then(files => {
      let content = files.shift();
      return fs.outputFile('extension/js/compiled/content.js', `
        let pageScript = document.createElement('script');
        pageScript.async = false;
        pageScript.textContent = '(' + (function(){ ${files.join(';')} }).toString() + ')()';
        document.documentElement.prepend(pageScript);
        ${content}
      `);   
    });
}

gulp.task('compile', compileContentScript);

gulp.task('watch', () => gulp.watch([
  'extension/js/content.js',
  'extension/js/polyfills/web-extensions.js',
  'extension/js/utils.js',
  'extension/js/polyfills/navigator.js'
], gulp.parallel('compile')));