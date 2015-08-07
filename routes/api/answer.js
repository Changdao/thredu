var QuestionAnswer = require('../model/model').QuestionAnswer;
var Course = require('../model/model').Course;
var Session = require('../model/model').Session;

exports.answer = function(req,res){
    var sessionId = req.params['sid'];
    var questionId = req.params['qid'];
    Session.findOne({where:{id:sessionId}}).then(function(obj){
        console.log(obj);
        var answer={};
        answer.sessionId=Number(sessionId);
        answer.questionId = Number(questionId);
        answer.answer = req.body['answer'];
        return QuestionAnswer.create(answer);
    }).then(function(obj){
        res.send(obj);
    }).catch(function(error){
        console.log(error);
        res.status(401);
        res.send(error);
    });
};