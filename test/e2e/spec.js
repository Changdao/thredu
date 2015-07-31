// spec.js
describe('Thredu Course List', function() {

    beforeEach(function() {
        browser.get('http://localhost:3000/course#/');
    });

    it('should have a title', function() {
        
        expect(browser.getTitle()).toEqual('THREDU course');

    });


    it('senario can work', function() {
        element(by.cssContainingText('.panel-button', 'new')).click();
        
        expect(element(by.model('course.hours')).isPresent()).toBe(true);

    });

});

// spec.js
describe('Thredu Course New', function() {

    beforeEach(function() {
        browser.get('http://localhost:3000/course#/new');
    });

    it('should have a title', function() {
        
        expect(browser.getTitle()).toEqual('THREDU course');

    });


    it('can save course', function() {
        element(by.model('course.name')).sendKeys('Course Name');
        element(by.model('course.desc')).sendKeys('Course Desc');
        element(by.model('course.hours')).sendKeys('30');
        element(by.buttonText('save')).click();
        expect(element(by.buttonText('Close')).isPresent()).toBe(true);
        element(by.buttonText('Close')).click();
        expect(element(by.cssContainingText('.panel-button','new')).isPresent()).toBe(true);

    });

});



