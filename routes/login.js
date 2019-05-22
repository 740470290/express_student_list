const express = require('express');
const fs = require("fs");
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/login', function (req, res) {
    res.render('login.html')
});
router.get('/admin', function (req, res) {
    if(req.session.userInfo!='admin'){
        return res.send('admin用户才有权限')
    }
    fs.readFile('./db.json','utf8',function(err,data){
        var data=JSON.parse(data);
        data=data.stus;
        res.render('admin.html',{
            msgs:data,
            username:req.session.userInfo
        })
    })
});
router.get('/logout', function (req, res) {
    req.session.isLogin=false;
    req.session.userInfo=null;
    res.redirect('/login');
});
router.post('/login', urlencodedParser, function (req, res) {
    let data = fs.readFileSync('./db.json', 'utf8');
        data = JSON.parse(data).stus;
        const stu=data.find(function (item) {
            return item.name==req.body.name
        });
        !stu&&res.end('fail');
        req.session.isLogin=true;
        req.session.userInfo=stu.name;
        stu.pwd==req.body.pwd && res.redirect('/stu');
        res.end('fail')
});
module.exports=router;

