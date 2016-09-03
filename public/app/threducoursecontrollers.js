var threduCourseControllers = angular.module('threduCourseControllers', ['threduCourseService','ui.bootstrap','ngAHAmap','ngAnimate']);


threduCourseControllers.controller('threduCourseListCtrl', function($scope,$http,$window,$location, Course) {
    $scope.courses = Course.query();

    $scope.delete = function(obj){
        obj.$remove({id:obj._id},function(){
            $location.url('/courses');
        });
    }

    $scope.deleteAll = function(obj){
        $http.delete('/api/course/all').success(function(){
            $scope.courses=[];    
        }).error(function(error){
            console.log(error);
        });
        
    };

});


threduCourseControllers.controller('threduCourseDetailCtrl',function($scope,$routeParams,$modal,$location,Course,$http,$amap,Question,CourseSession,$sce,$window){

    $scope.course = Course.get({id:$routeParams.id});
    $scope.course.$promise.then(function(data){
        console.log(data);
        console.log($scope.course);
        console.log('id:'+$scope.course.id);
    });

    $scope.questions = Question.query({cid:$routeParams.id});
    $scope.questions.$promise.then(function(){
        //console.log($scope.questions);
        $scope.sessions = CourseSession.query({cid:$routeParams.id});
        $scope.sessions.$promise.then(function(data){
            //console.log(data);
            extractCurrentSession(data);
        });
    });

    $scope.renderHtml = function(html_code)
    {
        return $sce.trustAsHtml(html_code);
    };
    

    var extractCurrentSession = function(data){
        //应该改成使用course.currentSession 来获取currentSession
        //session.isCurrent 是为了效率
        //course.currentSession 也是为乐效率
        //都是不符合范式的。

        for(var i =0;i<data.length;i++){
            var obj = data[i];
            if(obj.isCurrent)
            {
                    $scope.currentSession = obj;
                    return 
            }
        }
        //如果没有session.isCurrent, currentSession =null
        //todo: 更一致的行为应该是course.currentSession
        $scope.currentSession = null;
    };

    


    $scope.nq={};

    $amap.map($scope,'mapCurrent');

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
    $scope.questionEditMark = "+";
    $scope.questionEditing = false;
    $scope.newQuestion = function(){
        $scope.questionEditing = !$scope.questionEditing;
        $scope.questionEditMark = $scope.questionEditing?"X":"+";
        $scope.nq={};
    };
    $scope.isToasting = false;
    $scope.clearToast = function(){
        $scope.$apply(function(){$scope.isToasting = false;});
    };
    $scope.saveQuestion = function(){
        var isNew = !$scope.nq.id;
        $http.post('/api/course/'+$scope.course.id+'/question',$scope.nq).then(function(data){
            if(isNew)
            {
                $scope.questions.unshift(data.data);
                $scope.nq={};    
            }
            else
            {
                //todo: toast
                $scope.isToasting=true;
                $window.setTimeout($scope.clearToast,2500);
            }
        }).catch(function(error){
            console.log(error);
        })
    };

    $scope.editQuestion = function(question){
        $scope.questionEditing = true;//!$scope.questionEditing;
        $scope.questionEditMark = $scope.questionEditing?"X":"+";
        $scope.nq = question;
    };

    $scope.deleteQuestion = function(question){
        $http.delete('/api/course/'+$scope.course.id+'/question/'+question.id).success(function(data){
            idx = $scope.questions.indexOf(question);
            if(idx>=0)$scope.questions.splice(idx,1);
        }).error(function(error){
            console.log(error);
        })
    };
    $scope.presentSession = function(){
        //for protractor test purpose.
        
        if(!$scope.longitude )$scope.longitude = 118.326443;
        if(!$scope.latitude)$scope.latitude = 35.065282;

        sessionObj = {
            address : $scope.sessionLocation,
            lng:$scope.longitude,
            lat:$scope.latitude
        };
        $http.post('/api/course/'+$scope.course.id+'/session/present',sessionObj).success(function(data){
            //$scope.$apply(function(){
            $scope.sessions = data;
            extractCurrentSession(data);
            //});

        }).error(function(error){
            console.log(error);
        });
    };
    $scope.closeSession = function(){
        console.log($scope.course);
        if($scope.currentSession)
        {
            $http.post('/api/course/'+$scope.course.id+'/session/close',$scope.currentSession).success(function(data){
                $scope.sessions = data;
                extractCurrentSession(data);
            }).error(function(error){
                console.log(error);
            });
        }
        else
        {
            console.log('Inconsistent state!');
            console.log($scope.currentSession);
        };
    };

    $scope.onSessionLocationKeyPress = function(evt){
        if(event.charCode ==13 &&$scope.map){
            $scope.locateAddress($scope.sessionLocation);
        }
    };
    $scope.isChangeToasting=false;

    $scope.clearChangeToast = function(){
        $scope.$apply(function(){$scope.isChangeToasting=false;});
    };
    $scope.$watch('currentSession.currentQuestion',function(newVal,oldVal){
        if($scope.currentSession&&$scope.currentSession.currentQuestion){
            if(typeof $scope.currentSession.currentQuestion == 'number')
            {
                
                //trick code, the currentQuestion changed, then we guess which is the first, so we change it to the question Object.
                for(var i = 0;i<$scope.questions.length;i++)
                {
                    if($scope.questions[i].id == $scope.currentSession.currentQuestion)
                    {
                        $scope.currentSession.currentQuestion = $scope.questions[i];
                    }
                }
                return;
            };
            if(typeof oldVal == 'number')return;//trick for the bypass the change 
            
            //app.post('/session/:id/question/:qid/setCurrent',course.setCurrentQuestionBySessionId);
            $http.post('/api/session/'+$scope.currentSession.id+'/question/'+$scope.currentSession.currentQuestion.id+'/setCurrent').then(function(data){
                $scope.isChangeToasting = true;
                $window.setTimeout($scope.clearChangeToast, 1500);
            }).catch(function(error){
                console.log(error);
            })    
        }
        
    });

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














