// conf.js
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/index.spec.js'],
    onPrepare: function() {
         browser.manage().window().setSize(1600, 1000);
    }

 }
