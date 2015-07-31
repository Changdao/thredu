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
            currentSession:{type:Sequelize.INTEGER,field:"currentsession"}


      },
            {freezeTableName: true }); 
User.hasMany(Course,{as:'Courses'});



var Question = sequelize.define('question',{
    sn:{type:Sequelize.INTEGER,field:'sn'},
    desc:{type:Sequelize.TEXT,field:'desc'},
    option1:{type:Sequelize.INTEGER,field:'o1'},
    option2:{type:Sequelize.INTEGER,field:'o2'},
    option3:{type:Sequelize.INTEGER,field:'o3'},
    option4:{type:Sequelize.INTEGER,field:'o4'},
    option5:{type:Sequelize.INTEGER,field:'o5'},
    option6:{type:Sequelize.INTEGER,field:'o6'}
});

var Session = sequelize.define('coursesession',{
    startAt:{type:Sequelize.DATE,field:'start'},
    address:{type:Sequelize.STRING,field:'address'},
    lng:{type:Sequelize.FLOAT,field:"lng"},
    lat:{type:Sequelize.FLOAT,field:"lat"},
    currentQuestion:{type:Sequelize.INTEGER,field:"currentquestion"}
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


User.sync({force:true}).then(function(obj){
    return Course.sync({force:true});
}).then(function(){
    return Session.sync({force:true});
}).then(function(){
    return Question.sync({force:true});
}).then(function(){
    return QuestionAnswer.sync({force:true});
});



exports.Course = Course;
exports.Session = Session;
exports.User = User;
exports.Question = Question;


