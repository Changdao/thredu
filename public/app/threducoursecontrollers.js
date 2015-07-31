var threduCourseControllers = angular.module('threduCourseControllers', ['threduCourseService','ui.bootstrap']);


threduCourseControllers.controller('threduCourseListCtrl', function($scope,$http,$window,$location, Course) {
    $scope.courses = Course.query();

    $scope.delete = function(obj){
        obj.$remove({id:obj._id},function(){
            $location.url('/courses');
        });
    }

});


threduCourseControllers.controller('threduCourseDetailCtrl',function($scope,$routeParams,$modal,$location,Course,$http,Question){


    $scope.course = Course.get({id:$routeParams.id});

    $scope.questions = Question.query({cid:$routeParams.id});
    $scope.questions.$promise.then(function(){
        //console.log($scope.questions);
    });
    $scope.nq={};

    $scope.dlgSaveSuccess = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'saveSuccess.html',
            controller: 'ModalInstanceCtrl',
            size: size,

            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(){
              $location.url('/');
        });
    }

    $scope.save = function(){
        $scope.course.$save(function(){
            $scope.dlgSaveSuccess();
        });
    };

    $scope.saveQuestion = function(){
        $http.post('/api/course/'+$scope.course.id+'/question',$scope.nq).success(function(data){
            $scope.questions.unshift(data);
            $scope.nq={};
        }).error(function(error){
            console.log(error);
        })
    };

    $scope.deleteQuestion = function(question){
        $http.delete('/api/course/'+$scope.course.id+'/question/'+question.id).success(function(data){
            idx = $scope.questions.indexOf(question);
            if(idx>=0)$scope.questions.splice(idx,1);
        }).error(function(error){
            console.log(error);
        })
    };
});


threduCourseControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

threduCourseControllers.controller('threduCourseNewCtrl',function($scope,$location,$modal,Course){

    $scope.course = new Course();

    $scope.dlgSaveSuccess = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'saveSuccess.html',
                controller: 'ModalInstanceCtrl',
                size: size,

                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(){
                $location.url('/');
            });
        };

    $scope.save = function(){
        $scope.course.$save(function(){
            $scope.dlgSaveSuccess();
        });
    }
});


threduCourseControllers.controller('threduSessionDetailCtrl',function($scope,$routeParams,$location,$modal,Course){

    $http.get('/api/course/session/'+$routeParams.id).success(function(data){
        $scope.session = data;
        $scope.courseId = $scope.session.courseId;
        $http.get('/api/course/'+$scope.session.courseId+'/question').success(function(data){
            $scope.questions = data;
        }).error(function(error){
            console.log(error);
        });
    }).error(function(error){
        console.log(error);
    });

    $scope.setCurrentQuestion = function(question){
        $http.post('/api/course/'+$scope.courseId+'/').success(function(data){
            $scope.session.currentQuestionId = data.id;
        }).error(function(error){
            console.log(error);
        });
    };

});

threduCourseControllers.controller('threduSessionQuestionAnswerCtrl',function($scope,$routeParams){
    var sid = $routeParams.sid;
    var qid = $routeParams.qid;

    $http.get('/api/session/'+sid+'/question/'+qid+'/answer').success(function(data){
        $scope.answers = data;
    }).error(function(error){
        console.log(error);
    })
});














