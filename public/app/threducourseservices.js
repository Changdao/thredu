'use strict';

var threduCourseService = angular.module('threduCourseService',['ngResource']);

threduCourseService.factory('Course',['$resource',function($resource){

    var Course = $resource('/api/course/:id',{},{
            query:{method:'GET',params:{id:''},isArray:true}
        });

        var protoGet = Course.get;
        Course.get = function(params){
            var result =  protoGet(params);
            result.$promise.then(function(){
                
            });
            return result;
        };
        return Course;
}]);


threduCourseService.factory('Question',['$resource',function($resource){

    var Question = $resource('/api/course/:cid/question',{},{
            query:{method:'GET',params:{cid:''},isArray:true}
        });

        /*var protoGet = Course.get;
        Course.get = function(params){
            var result =  protoGet(params);
            result.$promise.then(function(){
                
            });
            return result;
        };*/
        return Question;
}]);


threduCourseService.factory('CourseSession',['$resource',function($resource){

    var CourseSession = $resource('/api/course/:cid/session',{},{
            query:{method:'GET',params:{cid:''},isArray:true}
        });

        /*var protoGet = Course.get;
        Course.get = function(params){
            var result =  protoGet(params);
            result.$promise.then(function(){
                
            });
            return result;
        };*/
        return CourseSession;
}]);