const express = require('express');
const fs = require("fs");
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/login', function (req, res) {
    const username=req.cookies.name||'未登录';
    res.render('login.html',{username})
});
router.get('/del', function (req, res) {
    const id=req.query.id-1;
    let data = fs.readFileSync('./db.json', 'utf8');
        data = JSON.parse(data);
        data.stus.splice(id,1)
    const len=data.stus.length;
    for(let i=id;i<len;i++){
        data.stus[i].id--
    }
    let Str_ans = JSON.stringify(data);
    fs.writeFile('./db.json', Str_ans, 'utf8', (err) => {
        if (err) throw err;
    });
    res.redirect('/admin');
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
        if(!stu){return res.end('fail')}
        req.session.isLogin=true;
        req.session.userInfo=stu.name;
        res.cookie("name",stu.name,{maxAge: 1e10, httpOnly: true});
        // res.cookie("name",stu.name);
        stu.pwd==req.body.pwd && res.redirect('/stu');
        res.end('fail')
});
module.exports=router;

