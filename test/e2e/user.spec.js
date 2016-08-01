describe('User register', function() {

    beforeEach(function() {
        browser.get('http://localhost:3000/#/signin');
    });

    it('should have not signedin', function() {
        
        expect(element(by.model('user.nickname')).getText()).toEqual('');

    });


    it('should can register', function() {
        var EC = protractor.ExpectedConditions;
        browser.get('http://localhost:3000/#/signin');

        element(by.model('user.nickname')).sendKeys('吉东');
        element(by.model('user.email')).sendKeys('jameslau@263.net');
        element(by.model('user.password')).sendKeys('tdwjqkjf');
        element(by.buttonText('创建账号')).click().then(function(){
            var loginLink = element(by.cssContainingText('a','立即登录'));
            var isLoginLinkePresent = EC.elementToBeClickable(loginLink);
            browser.wait(isLoginLinkePresent,3000);
        });

    });
    it('should can login',function(){
        browser.get('http://localhost:3000/#/signin');

        element(by.model('signUser.email')).sendKeys('jameslau@263.net');
        element(by.model('signUser.password')).sendKeys('tdwjqkjf');
        expect(element(by.buttonText('登录')).isPresent()).toBe(true);
        element(by.buttonText('登录')).click().then(function(){

            browser.getCurrentUrl().then(function(data){
                console.log(data);
                expect(browser.getCurrentUrl()).toEqual("http://localhost:3000/#/");
            });
            
        });


    });


});