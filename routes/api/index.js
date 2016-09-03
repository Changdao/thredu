//index.js

'use strict';
var express = require('express');
var app = express();
module.exports = app;

var course = require('./course');
var answer = require('./answer');
var user = require('./user');

app.get('/course/around',course.getAround);
//app.get('/course/getCurrentQuestion',course.getCurrentQuestion);
//app.delete('/course/:id/question/:qid',course.deleteQuestion);
//app.post('/course/:id/answerQuestion',course.answerQuestion);
app.post('/course/:id/session/present',course.openSession);
app.post('/course/:id/session/close',course.closeSession);
app.post('/course/:id/question/:qid/setCurrent',course.setCurrentQuestion);
app.post('/session/:id/question/:qid/setCurrent',course.setCurrentQuestionBySessionId);
app.post('/session/:sid/question/:qid/answer',answer.answer);

app.post('/course/:id/question',course.postQuestion);
app.get('/course/:id/question',course.getQuestions);
app.get('/course/:id/question/:qid',course.getQuestion);
app.delete('/course/all',course.deleteAll);
app.delete('/course/:id/question/:qid',course.deleteQuestion);

app.get('/course/:id/session',course.getCourseSessions);

app.get('/session/:id',course.getSession);

app.get('/course',course.index);
app.post('/course',course.post);
app.get('/course/:id',course.get);
app.delete('/course/:id',course.delete);

app.post('/user',user.register);




