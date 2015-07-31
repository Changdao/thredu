var QuestionAnswer = require('../model/model').QuestionAnswer;
var Course = require('../model/model').Course;

exports.answer = function(req,res){
    var courseId = req.params['id'];
    var sessionId = req.param['sid'];
    var questionId = req.param['qid'];
    Course.findOne({where:{id:courseId}}).then(function(obj){
        var answer={};
        answer.sessionId=sessionId;
        answer.questionid = questionId;

        QuestionAnswer.create(answer).then(function(obj){
            res.send(obj);
        }).catch(function(error){
            res.status(401);
            res.send(error);
        });
    }).catch(function(error){
        console.log(error);
    });
    

}