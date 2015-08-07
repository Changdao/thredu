
describe('Course List', function() {

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


describe('Course New', function() {
    var courses = element.all(by.repeater('course in courses'));

    beforeEach(function() {

        browser.get('http://localhost:3000/course#/');
        element(by.buttonText('deleteAll')).click();

    });

    it('should have a title', function() {
        expect(courses.count()).toBe(0);
        expect(browser.getTitle()).toEqual('THREDU course');

    });


    it('can save course', function() {
        var EC = protractor.ExpectedConditions;
        
        
        browser.get('http://localhost:3000/course#/new');
        element(by.model('course.name')).sendKeys('Course Name');
        element(by.model('course.desc')).sendKeys('Course Desc');
        element(by.model('course.hours')).sendKeys('30');

        var saveButton = element(by.buttonText('save'));
        var isSBClickable = EC.elementToBeClickable(saveButton);
        browser.wait(isSBClickable,3000);
        element(by.buttonText('save')).click();
        var closeButton = element(by.buttonText('Close'));
        var isCBClickable = EC.elementToBeClickable(closeButton);
        browser.wait(isCBClickable,3000);
        element(by.buttonText('Close')).click();
        var newButton = element(by.cssContainingText('.panel-button', 'new'));
        var isNBClickable = EC.elementToBeClickable(newButton);
        browser.wait(isNBClickable,3000);
        expect(courses.count()).toBe(1);
    });

});

describe('Course Session',function(){
    var courses = element.all(by.repeater('course in courses'));
    var sessions = element.all(by.repeater('session in sessions'));
    
    beforeEach(function(){
        browser.get('http://localhost:3000/course#/');
        element(by.buttonText('deleteAll')).click();
        browser.get('http://localhost:3000/course#/new');
        element(by.model('course.name')).sendKeys('Course Name');
        element(by.model('course.desc')).sendKeys('Course Desc');
        element(by.model('course.hours')).sendKeys('30');
        element(by.buttonText('save')).click();
        var EC = protractor.ExpectedConditions;
        var closeButton = element(by.buttonText('Close'));
        var isClickable = EC.elementToBeClickable(closeButton);
        browser.wait(isClickable,5000);

        element(by.buttonText('Close')).click().then(function(data){
            //for headless protractor.
            //the modal dialog will not close as fast as possible.....
            //the the "unknown error: Element is not clickable at point" is thrown 
        });



        var newButton = element(by.cssContainingText('.panel-button', 'new'));



        var isClickable = EC.elementToBeClickable(newButton);



        browser.wait(isClickable, 2000);
        expect(courses.count()).toBeGreaterThan(0);
        //expect(element(by.cssContainingText('.panel-button', 'new')).isPresent()).toBe(true);

    });

    it('should has no session',function(){
        browser.get('http://localhost:3000/course#/');
        expect(courses.count()).toBe(1);
        browser.get('http://localhost:3000/course#/');
        expect(courses.count()).toBe(1);
        //there should be an element 
        courses.get(0).$('a').click();
        expect(sessions.count()).toBe(0);
        
        //expect(sessions.count()).toBeGreaterThan(0);

    });

    it('can open session',function(){
        //expect(element(by.cssContainingText('.panel-button', 'new')).isClickable()).toBe(true);
        expect(courses.count()).toBe(1);
        //browser.get('http://localhost:3000/course#/');
        //console.log(courses.get(0).$('a'));
        //expect(courses.first().$('a')).toBeDefined();

        courses.get(0).$('a').click();
        expect(element(by.buttonText('开讲')).isPresent()).toBe(true);
        element(by.buttonText('开讲')).click();
        //expect(sessions.count()).toBe(0);
        expect(sessions.count()).toBeGreaterThan(0);
    });


    it('can close session',function(){
        expect(courses.count()).toBe(1);
        courses.get(0).$('a').click();
        expect(element(by.buttonText('开讲')).isPresent()).toBe(true);
        element(by.buttonText('开讲')).click();
        expect(element(by.buttonText('开讲')).isDisplayed()).toBe(false);
        expect(sessions.count()).toBeGreaterThan(0);
        expect(element(by.buttonText('结束')).isPresent()).toBe(true);
        element(by.buttonText('结束')).click();
        expect(element(by.buttonText('结束')).isDisplayed()).toBe(false);
        expect(element(by.buttonText('开讲')).isPresent()).toBe(true);
    });

})

describe('Course Session',function(){
    var courses = element.all(by.repeater('course in courses'));
    var sessions = element.all(by.repeater('session in sessions'));
    var questions = element.all(by.repeater('question in questions'));
    
    beforeEach(function(){
        browser.get('http://localhost:3000/course#/');
        element(by.buttonText('deleteAll')).click();
        browser.get('http://localhost:3000/course#/new');
        element(by.model('course.name')).sendKeys('Course Name');
        element(by.model('course.desc')).sendKeys('Course Desc');
        element(by.model('course.hours')).sendKeys('30');
        element(by.buttonText('save')).click();
        var EC = protractor.ExpectedConditions;
        var closeButton = element(by.buttonText('Close'));
        var isClickable = EC.elementToBeClickable(closeButton);
        browser.wait(isClickable,5000);

        element(by.buttonText('Close')).click().then(function(data){
            //for headless protractor.
            //the modal dialog will not close as fast as possible.....
            //the the "unknown error: Element is not clickable at point" is thrown 
        });



        var newButton = element(by.cssContainingText('.panel-button', 'new'));



        var isClickable = EC.elementToBeClickable(newButton);



        browser.wait(isClickable, 2000);
        expect(courses.count()).toBeGreaterThan(0);
        //expect(element(by.cssContainingText('.panel-button', 'new')).isPresent()).toBe(true);

    });

    it('can add question',function(){
        browser.get('http://localhost:3000/course#/');
        expect(courses.count()).toBe(1);
        //there should be an element 
        courses.get(0).$('a').click();
        expect(questions.count()).toBe(0);
        
        element(by.buttonText('+')).click();

        element(by.model('nq.sn')).sendKeys('1');
        element(by.model('nq.desc')).sendKeys('question?');
        element(by.model('nq.option1')).sendKeys('yes');
        element(by.model('nq.option2')).sendKeys('no');

        element(by.buttonText('Save Question')).click().then(function(data)
        {
            expect(questions.count()).toBe(1);
        });

        //expect(sessions.count()).toBeGreaterThan(0);

    });

    it('can open session',function(){
        //expect(element(by.cssContainingText('.panel-button', 'new')).isClickable()).toBe(true);
        expect(courses.count()).toBe(1);
        //browser.get('http://localhost:3000/course#/');
        //console.log(courses.get(0).$('a'));
        //expect(courses.first().$('a')).toBeDefined();

        courses.get(0).$('a').click();
        expect(element(by.buttonText('开讲')).isPresent()).toBe(true);
        element(by.buttonText('开讲')).click();
        //expect(sessions.count()).toBe(0);
        expect(sessions.count()).toBeGreaterThan(0);
    });

})






