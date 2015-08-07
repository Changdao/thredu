var qr = require('qr-image');
console.log(qr);
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://thredu:thredu@localhost:5432/thredu');


var User = sequelize.define('user',{
    firstname:{type:Sequelize.STRING,field:'firstname'},
    lastname:{type:Sequelize.STRING,field:'lastname'},
    password:{type:Sequelize.STRING,field:'password'},
    lastlat:{type:Sequelize.FLOAT,field:'lastlat'},
    lastlng:{type:Sequelize.FLOAT,field:'lastlng'}
});


var Course =  sequelize.define('course',{
            name:{type:Sequelize.STRING,field:"name"},
            desc:{type:Sequelize.TEXT,field:"desc"},
            hours:{type:Sequelize.INTEGER,field:"hours"},
            currentSession:{type:Sequelize.INTEGER,field:"currentsession"},
            image:{type:Sequelize.TEXT,field:'image'}
      },
            {freezeTableName: true }); 
User.hasMany(Course,{as:'Courses'});



var Question = sequelize.define('question',{
    sn:{type:Sequelize.INTEGER,field:'sn'},
    desc:{type:Sequelize.TEXT,field:'desc'},
    option1:{type:Sequelize.STRING,field:'o1'},
    option2:{type:Sequelize.STRING,field:'o2'},
    option3:{type:Sequelize.STRING,field:'o3'},
    option4:{type:Sequelize.STRING,field:'o4'},
    option5:{type:Sequelize.STRING,field:'o5'},
    option6:{type:Sequelize.STRING,field:'o6'},
    active:{type:Sequelize.BOOLEAN,field:'active'}
});

var Session = sequelize.define('coursesession',{
    isCurrent:{type:Sequelize.BOOLEAN,field:'iscurrent'},
    state:{type:Sequelize.STRING,field:'state',defaultValue:3}, //1:EARLY,2:BOOK,3:CURRENT,4:CLOSED
    city:{type:Sequelize.STRING,field:'city'},
    desc:{type:Sequelize.STRING,field:'desc'},
    startAt:{type:Sequelize.DATE,field:'start'},
    address:{type:Sequelize.STRING,field:'address'},
    lng:{type:Sequelize.FLOAT,field:"lng"},
    lat:{type:Sequelize.FLOAT,field:"lat"},
    currentQuestion:{type:Sequelize.INTEGER,field:"currentquestion"},
    qr:{type:Sequelize.TEXT,field:'qr'}
});

var QuestionAnswer = sequelize.define('answer',{
    questionId:{type:Sequelize.INTEGER,field:'questionId'},
    sessionId:{type:Sequelize.INTEGER,field:'sessionId'},
    answer:{type:Sequelize.INTEGER,field:'answer'}
});

Course.hasMany(Question,{as:"Questions"});
Course.hasMany(Session,{as:'Sessions'});

Question.belongsTo(Course);

Session.belongsTo(Course);

var force = false;

User.sync({force:force})
.then(function(obj){
    return Course.sync({force:force});
}).then(function(){
    return Session.sync({force:force});
}).then(function(){
    return Question.sync({force:force});
}).then(function(){
    return QuestionAnswer.sync({force:force});
});

Course.openSession = function(courseId,session){
    
    var course = null;
    return sequelize.transaction(function(tr){
        var sessObj = null;
        return Course.findById(courseId).then(function(obj){
            course = obj;
            return Session.findById(course.currentSession);
        }).then(function(previousSession){
            if(previousSession)previousSession.update({isCurrent:false,transaction:tr});
            return course;
        }).then(function(obj){
            session.isCurrent = true;
            return Session.create(session,{transaction:tr});
        }).then(function(_sessObj_){
            var qrImage = qr.imageSync('http://www.aihangyun.com/session/'+_sessObj_.id, { type: 'svg' });
            return _sessObj_.update({qr:qrImage},{transaction:tr});
        }).then(function(_sessObj_){
            sessObj = _sessObj_;
            return course.addSession(sessObj,{transaction:tr});
        }).then(function(){
            return course.update({currentSession:sessObj.id},{transaction:tr});
        }).then(function(){
            return course.getSessions({transaction:tr});
        })
    });
};

Course.closeSession = function(courseId,sessionId){
    var course = null;
    return Course.findById(courseId).then(function(obj){
        course = obj;
        console.log(obj);
        return course.update({currentSession:0});
    }).then(function(){

        return Session.findById(sessionId);
    }).then(function(sessionObj){
        console.log(sessionObj);
        if(!sessionObj) throw new Error('Can not find session with id:'+sessionId);
        return sessionObj.update({isCurrent:false});
    }).then(function(){
        return course.getSessions();
    });
};


exports.Course = Course;
exports.Session = Session;
exports.User = User;
exports.Question = Question;
exports.QuestionAnswer = QuestionAnswer;


