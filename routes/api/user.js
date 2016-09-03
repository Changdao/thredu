var User = require('../model/model').User;

exports.register= function(req,res){
    user = req.body;

    User.create(user).then(function(userObj){
        console.log(user);
        res.send(userObj);
    }).catch(function(error){
        console.log(error);
        res.status(401);
        res.send(error);
    });
};