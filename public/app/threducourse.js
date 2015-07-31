var threduCourseApp = angular.module('threduCourseApp', [
    'ngRoute',
    'threduCourseControllers'
]).value('mode', 'app')
.value('version', 'v1.0.1');



threduCourseApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/partials/course/list',
                controller: 'threduCourseListCtrl'
            }).
            when('/new',{
                templateUrl:'/partials/course/new',
                controller:'threduCourseNewCtrl'
            }).
            when('/:id',{
                templateUrl:'/partials/course/detail',
                controller:'threduCourseDetailCtrl'
            }).when('/session/:id',{
                templateUrl:'/partials/course/session',
                controller:'threduSessionDetailCtrl'
            }).when('/session/:id/question/:qid/answer',{
                templateUrl:'/partials/course/answer',
                controller:'threduSessionQuestionAnswerCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


