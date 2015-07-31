// spec.js
describe('Protractor Demo App', function() {
   it('should have a title', function() {
       browser.get('http://localhost:3000/course#/');

           expect(browser.getTitle()).toEqual('THREDU course');
             });
   });
