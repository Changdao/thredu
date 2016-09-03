var express = require('express');
var router = express.Router();
var User = require('./model/model').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Thredu course',session:(req.session||{}) });
});

router.post('/signin',function(req,res){
    email=req.body['email'];
    password = req.body['password'];
    User.findOne({where:{email:email}}).then(function(user){
        if(user&&password == user.password)
        {
            req.session.user = user;
            res.send(user);
        }
        else throw new Error('用户名／密码错误');
    }).catch(function(error){
        res.status(401);
        res.send(error);
    });
    
});

module.exports = router;
