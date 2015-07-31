//var ObjectID = require('mongodb').ObjectID;
var Course = require('../model/model').Course;
var Session  = require('../model/model').Session;
var Question = require('../model/model').Question;
console.log(Session);

exports.index = function(req, res){
    Course.findAll().then(function(objs){

        res.send(objs);
    });
};

exports.get = function(req,res){
    id = req.params['id'];

    Course.findById(id).then(function(doc){

        res.send(doc||"");

    });
};

exports.post = function(req,res){

    _id= req.body["id"];
    console.log('====>id:'+_id);
    if(_id &&(_id !== "")){
        console.log("it's to update user:"+_id);
        Course.findById(_id).then(function(obj){
            if(obj)obj.update(req.body).then(function(obj){
                res.send('{}');
            });
        });
    }
    else
    {
        Course.upsert(req.body).then(function(obj){
            res.send(obj);
        });

    }
};

exports.delete = function(req,res){
    id = req.params['id'];

    Course.findById(id).then(function(obj){
        if(obj)obj.destroy().then(function(){
            res.send('');
        });
    });

};

/*
app.get('/course/around',course.around);
app.get('/course/getCurrentQuestion',course.getCurrentQuestion);
app.delete('/course/:id/question/:qid',course.deleteQuestion);
app.post('/course/:id/answerQuestion',course.answerQuestion);
app.post('/course/:id/openSession',course.openSession);
app.post('/course/:id/setCurrentQuestion',course.setCurrentQuestion);
app.post('/course/:id/addQuestion',course.addQuestion);
*/

exports.getAround = function(req,res){
    var lat = req.query['lat'];
    var lng = req.query['lng'];

    highlat = Number(lat)+0.01;
    lowlat = Number(lat)-0.01;
    highlng = Number(lng)+0.01;
    lowlng = Number(lng)-0.01;

    Session.findAll({where:{lng:{lt:highlng,gt:lowlng},lat:{lt:highlat,gt:lowlat}},
        include: [{model: Course}]
    }).then(function(objs){
        console.log(objs);
        res.send(objs);
    })
};

exports.openSession = function(req,res){
    var courseId = req.params['id'];
    var session = {}
    session.lat = req.query['lat'];
    session.lng = req.query['lng'];
    var course = null;
    Course.findOne({where:{id:courseId}}).then(function(obj){
        course = obj;
        return obj.addSession(session);
    }).then(function(session){
        return course.update({currentSession:session.id});
    }).then(function(obj){
        res.send('{"code":"200"}');
    }).catch(function(error){
        res.status(401);
        res.send(error);
    });
};

exports.getQuestion = function(req,res){
    var courseId = req.params['id'];
    Course.findById(courseId).then(function(obj){
        return obj.getQuestions();
    }).then(function(objs){
        res.send(objs);
    }).catch(function(error){
        res.status(401);
        res.send(error);
    })
};

exports.deleteQuestion = function(req,res){
    var courseId = req.params['id'];
    console.log('====>delete question: cid:'+courseId +' qid:'+questionId);
    var questionId = req.params['qid'];
    var course;
    Course.findById(courseId).then(function(obj){
        course = obj;
        return Question.findById(questionId);
    }).then(function(obj){
        return course.removeQuestion(obj);
    }).then(function(obj){
        res.send('{"code":"200"}');
    }).catch(function(error){
        res.status(401);
        res.send(error);
    });
};

exports.postQuestion = function(req,res){
    
    var question = req.body;
    var courseId = req.params['id'];
    var courseObj;

    console.log('====>postQuestion for course:'+courseId);
    console.log(req.body);

    Course.findById(courseId).then(function(obj){
        courseObj = obj;
        return Question.create(question);
    }).then(function(obj){
        return courseObj.addQuestion(obj);
    }).then(function(obj){
        console.log('====');
        console.log(obj);
        res.send(obj);
    }).catch(function(error){
        console.log('====')
        console.log(error);
        res.status(401);
        res.send(error);
    });
};

exports.setCurrentQuestion = function(req,res){
    console.log('====>setCurrentQuestion:');
    console.log(req.body);
    var questionId = req.params[':qid'];
    var courseId = req.params['id'];

    Course.findOne({where:{id:courseId}}).then(function(obj){
        return Session.findOne({id:obj.currentSessionId});
    }).then(function(obj){
        return obj.update({currentQuestionId:questionId});
    }).then(function(obj){
        res.send('{"code":"200"}');
    }).catch(function(error){
        res.status(401);
        res.send(error);
    });

} 

exports.getSession = function(req,res){
    var sessionId = req.params['id'];
    Session.findOne({where:{id:sessionId},include: [
                    {model: Course}
                ]}).then(function(obj){
        res.send(obj);
    }).catch(function(error){
        res.status(401);
        res.send('{"code":"200"}');
    });
}








