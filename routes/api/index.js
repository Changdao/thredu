//index.js

'use strict';
var express = require('express');
var app = express();
module.exports = app;

var course = require('./course');
var answer = require('./answer');

app.get('/course/around',course.getAround);
//app.get('/course/getCurrentQuestion',course.getCurrentQuestion);
//app.delete('/course/:id/question/:qid',course.deleteQuestion);
//app.post('/course/:id/answerQuestion',course.answerQuestion);
app.post('/course/:id/openSession',course.openSession);
app.post('/course/:id/question/:qid/setCurrent',course.setCurrentQuestion);
app.post('/course/:id/qestion/:qid/answer',answer.answer);

app.post('/course/:id/question',course.postQuestion);
app.get('/course/:id/question',course.getQuestion);
app.delete('/course/:id/question/:qid',course.deleteQuestion);
app.get('/course/session/:id',course.getSession);

app.get('/course',course.index);
app.post('/course',course.post);
app.get('/course/:id',course.get);
app.delete('/course/:id',course.delete);




