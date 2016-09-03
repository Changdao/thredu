var threduIndex = angular.module('threduIndex',['ngRoute','ngAHAmap']);


threduIndex.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/partials/index/index',
                controller: 'threduIndexCtrl'
            }).when('/session/:id',{
                templateUrl:'/partials/index/session',
                controller:'threduSessionCtrl'
            }).when('/signin',{
                templateUrl:'/partials/index/signin',
                controller:'threduSigninCtrl'
            }).when('/registered',{
                templateUrl:'/partials/index/registered',
                controller:'threduSigninCtrl'
            }).otherwise({
                redirectTo: '/'
            });
    }]);


threduIndex.controller('threduSessionCtrl',function($scope,$http,$routeParams){
    $http.get('/api/session/'+$routeParams.id).then(function(data){
        $scope.session=data.data;
        return $http.get('/api/course/'+$scope.session.course.id+'/question/'+$scope.session.currentQuestion);
    }).then(function(data){
        $scope.question = data.data;
    }).catch(function(error){
        console.log(error);
    });
    $scope.answer = 1;
    $scope.doAnswer=function(){
        console.log($scope.answer);
        $http.post('/api/session/'+$routeParams.id+'/question/'+$scope.question.id+'/answer',{answer:$scope.answer}).then(function(response){
            alert('answer success!');
            console.log(response);
        }).catch(function(error){
            console.log(error);
        });
    };
    
});
threduIndex.controller('threduSigninCtrl',function($scope,$http,$location,$window,$route){
    $scope.user = {agree:false};
    $scope.signUser = {};
    $scope.alert= function(){
        alert('Not implemented!');
    };

    $scope.register = function(){
        $http.post('/api/user',$scope.user).then(function(response){
            console.log(response);
            $scope.signUser = response.data;
            $location.url('/registered');
        }).catch(function(error){
            console.log(error);
        });
    };
    $scope.signin = function(){
        $http.post('/signin',$scope.signUser).then(function(response){
            $location.path("/#/");
        }).catch(function(error){
            console.log(error);
        });
    };

});
threduIndex.controller('threduIndexCtrl',function($scope,$http, $amap,$window){
    $scope.locating = true;
    $scope.aniLocI = 0;
    $scope.animateLocating = function(){

        strs=[".","..","..."];
        ++$scope.aniLocI;
        if($scope.aniLocI==3)$scope.aniLocI=0;
        $scope.$apply(function(){$scope.aniLocS = '正在定位'+strs[$scope.aniLocI];});
        if(!$scope.locating)$window.clearInterval($scope.locatiingIntervalID);
    };
    $scope.locatiingIntervalID = $window.setInterval($scope.animateLocating,500);
    
    $scope.getAroundCourses = function(lng,lat){
        $http.get('/api/course/around',{params:{lng:lng,lat:lat}}).success(function(data){
            $scope.aroundSessions = data;
        }).error(function(error){
            console.log(error);
        });
    };    
    $scope.fixMapLocation = function(){
        if($scope.locating)
        {
            $scope.locating = true;
            $window.clearInterval($scope.locatiingIntervalID);
            $scope.$apply(function(){$scope.aniLocS='定位失败，请手动指定位置。';});
        }
    };
    $window.setTimeout($scope.fixMapLocation, 5000);
    $amap.map($scope,'mapCurrent',{
        onAmapLocationDone:function(obj){
            $scope.$apply(function(){
                $scope.locating = false;   
            });
            lng = obj.lnglat.lng;
            lat = obj.lnglat.lat;
            $scope.getAroundCourses(lng,lat);
        },
        doLocate:true,
        onMapReLocation:function(lng,lat){
            $scope.getAroundCourses(lng,lat);
        }
    });

    //geolocation api
    
});