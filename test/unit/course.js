'use strict';

describe('threduCourseApp', function() {
    beforeEach(module('threduCourseApp'));
    beforeEach(module('threduCourseControllers'));


    it('should provide a version', inject(function(mode, version) {
        console.log(version);
        console.log(mode);
        expect(version).toEqual('v1.0.1');
        expect(mode).toEqual('app');
    }));

    describe("threduCourseDetailCtrl",function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/api/course/mock_course_id_001').
                respond({id:1,name: 'TEST COURSE',desc:'TEST COURSE DESC',hours:30});

            $httpBackend.expectGET('/api/course/mock_course_id_001/question').
                respond([{sn:3,desc:'q1',o1:'o1'}]);

            scope = $rootScope.$new();
            ctrl = $controller('threduCourseDetailCtrl', {$scope: scope,$routeParams:{id:'mock_course_id_001'}});
        }));


        it("Course should have instance", function() {
            //expect(ctrl).not.toBe(undefined);
            //expect(scope.school).toBe(undefined);
            $httpBackend.flush();
            expect(scope.course.name).toBe("TEST COURSE");
            expect(scope.course.desc).toBe("TEST COURSE DESC");
            expect(scope.course.hours).toBe(30);
        });

        it("Question List should have instances", function() {
            //expect(ctrl).not.toBe(undefined);
            //expect(scope.school).toBe(undefined);
            $httpBackend.flush();
            expect(scope.questions.length).toBe(1);
            expect(scope.questions[0].sn).toBe(3);
            expect(scope.questions[0].o1).toBe('o1');

        });

        

    });

    describe("threduCourseDetailCtrl interactive",function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/api/course/mock_course_id_001').
                respond({id:1,name: 'TEST COURSE',desc:'TEST COURSE DESC',hours:30});

            $httpBackend.expectGET('/api/course/mock_course_id_001/question').
                respond([{sn:3,desc:'q1',o1:'o1'}]);

            scope = $rootScope.$new();
            ctrl = $controller('threduCourseDetailCtrl', {$scope: scope,$routeParams:{id:'mock_course_id_001'}});
        }));

        it("Question could be add",function(){
            $httpBackend.flush();
            $httpBackend.expectPOST('/api/course/1/question').respond({sn:1,desc:'q2',o1:'1'});
            scope.nq={sn:1,desc:'q2',o1:'1'};
            scope.saveQuestion();
            $httpBackend.flush();
            expect(scope.questions.length).toBe(2);
        });

    });
    
    describe("threduCourseListCtrl",function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/api/course').
                respond([{name: 'TEST COURSE',desc:'TEST COURSE DESC',hours:30}]);

            // $httpBackend.expectGET('/api/course/mock_course_id_001/question').
            //     respond([{sn:3,desc:'q1',o1:'o1'}]);
            scope = $rootScope.$new();
            ctrl = $controller('threduCourseListCtrl', {$scope: scope,$routeParams:{id:'mock_course_id_001'}});
        }));


        it("Course List should have instances", function() {
            //expect(ctrl).not.toBe(undefined);
            //expect(scope.school).toBe(undefined);
            $httpBackend.flush();
            expect(scope.courses.length).toBe(1);
            expect(scope.courses[0].name).toBe("TEST COURSE");
            expect(scope.courses[0].desc).toBe("TEST COURSE DESC");
            expect(scope.courses[0].hours).toBe(30);
        }); 
    });


});
