//var ObjectID = require('mongodb').ObjectID;
var Course = require('../model/model').Course;
var Session  = require('../model/model').Session;
var Question = require('../model/model').Question;

var Canvas = require('canvas'), Image = Canvas.Image;
var Font = Canvas.Font;
if (!Font) {
    throw new Error('Need to compile with font support');
}

function fontFile(name) {
  return path.join(__dirname, '/pfennigFont/', name);
}

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
        course = req.body;
        console.log(1);
        var  canvas = new Canvas(200, 200), ctx = canvas.getContext('2d'),ctx1 = canvas.getContext('2d');
        var canvas1 = new Canvas(200, 200), ctx1 = canvas1.getContext('2d');
        ctx1.font = '40px STXihei';
        //ctx.rotate(-.1);
        ctx1.fillText(course.name, 10, 100);
        var te = ctx1.measureText(course.name);

        
        //ctx.rotate(-.1);
        var left = (200 - te.width)/2;
        
        ctx.font = '40px STXihei';
        
        ctx.fillText(course.name, left, 100);

        
        /*ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.lineTo(left, 102);
        ctx.lineTo(left + te.width, 102);
        ctx.stroke();*/

        course.image = canvas.toDataURL();

        Course.upsert(course).then(function(obj){
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

exports.deleteAll = function(req,res){
    Course.destroy({where:{name:{ like :"%"}}}).then(function(data){
        console.log(data);
        res.send('{}');
    }).catch(function(error){
        console.log(error);
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

    highlat = Number(lat)+10.01;
    lowlat = Number(lat)-10.01;
    highlng = Number(lng)+10.01;
    lowlng = Number(lng)-10.01;

    Session.findAll({where:{lng:{lt:highlng,gt:lowlng},lat:{lt:highlat,gt:lowlat}},
        include: [{model: Course}]
    }).then(function(objs){
        console.log(objs);
        res.send(objs);
    })
};
exports.getCourseSessions = function (req,res){
    courseId = req.params['id'];
    Course.findById(courseId).then(function(obj){
        return obj.getSessions();
    }).then(function(objs){
        res.send(objs);
    }).catch(function(error){
        console.log(error);
    });
};
exports.openSession = function(req,res){
    var courseId = req.params['id'];
    var session = {}
    session.lat = req.body['lat'];
    session.lng = req.body['lng'];
    session.address = req.body['address'];
    session.startAt = new Date();
    session.desc = req.body['desc']||'未命名';

    console.log(session);
    var course = null;
    //var sessObj = null;

    Course.openSession(courseId,session)
    .then(function(sessionObjs){
        res.send(sessionObjs);
    }).catch(function(error){
        console.log(error);
        res.status(401);
        res.send(error);
    });
  
};

exports.closeSession = function(req,res){
    var courseId = req.params['id'];
    var sessionId = req.body['id'];
    Course.closeSession(courseId,sessionId)
    .then(function(sessionObjs){
        console.log(sessionObjs);
        res.send(sessionObjs);
    }).catch(function(error){
        console.log(error);
        res.status(401);
        res.send(error);
    });
};


exports.getQuestion = function(req,res){
    var courseId = req.params['id'];
    var questionid = req.params['qid'];
    Question.findById(questionid).then(function(obj){
        res.send(obj);
    }).catch(function(error){
        console.log(error);
        res.status(401);
        res.send(erro);
    })
};

exports.getQuestions = function(req,res){
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
    if(req.body.id)
        Question.findById(req.body['id']).then(function(qObj){
            return qObj.update(req.body);
        }).then(function(obj){
            res.send(obj);
        });
    else
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
    var questionId = req.params['qid'];
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

exports.setCurrentQuestionBySessionId = function(req,res){
    console.log('====>setCurrentQuestion:');
    console.log(req.body);
    var questionId = req.params['qid'];
    var sessionId = req.params['id'];

    Session.findById(sessionId).then(function(obj){
        return obj.update({currentQuestion:questionId});
    }).then(function(obj){
        res.send(obj);
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








