var threduIndex = angular.module('threduIndex',['ngRoute']);


threduIndex.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/partials/index',
                controller: 'threduIndexCtrl'
            }).
            when('/course/:id',{
                templateUrl:'/partials/course',
                controller:'threduCourseCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
threduIndex.controller('threduCourseCtrl',function($scope,$http,$routeParams){
    $http.get('/api/course/'+$routeParams.id+'/currentQuestion').success(function(data){
        $scope.currentQuestion=data;
    }).error(function(error){
        console.log(error);
    });

    $scope.answer=function(){
        $http.post('/api/course/'+$routeParams+'/question/'+$scope.currentQuestion.id+'/answer',answer).success(function(){
            alert('answer success!');
        }).error(function(error){
            console.log(error);
        });
    };
    
});

threduIndex.controller('threduIndexCtrl',function($scope,$http){

    if ("geolocation" in navigator) {
        /* geolocation is available */
        console.log('geolocation is available');
    } else {
        /* geolocation IS NOT available */
        console.log('geolocation is  not available');
        alert('无法定位您的位置，所以您将看不到当前课程！');
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
            console.log('is here');
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $http.get('/api/course/around',{params:{lng:lng,lat:lat}}).success(function(data){
                $scope.aroundCourses = data;
            }).error(function(error){
            console.log(error);
        })    
    });
    //geolocation api
    
});