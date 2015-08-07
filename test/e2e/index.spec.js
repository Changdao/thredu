describe('Index ',function(){
    var courses = element.all(by.repeater('course in courses'));
    var sessions = element.all(by.repeater('session in sessions'));
    var questions = element.all(by.repeater('question in questions'));
    var aroundSessions = element.all(by.repeater('sesison in aroundSessions'));
    
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
            
        });

        var newButton = element(by.cssContainingText('.panel-button', 'new'));

        var isClickable = EC.elementToBeClickable(newButton);

        browser.wait(isClickable, 2000);
        expect(courses.count()).toBeGreaterThan(0);
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
        browser.get('http://localhost:3000/course#/');
        courses.get(0).$('a').click();
        expect(element(by.buttonText('开讲')).isPresent()).toBe(true);
        
        element(by.buttonText('开讲')).click();
        expect(sessions.count()).toBeGreaterThan(0);

    });

    it('settle should work',function(){

        browser.get('http://localhost:3000/');
        expect(aroundSessions.count()).toBe(1);
    })


})