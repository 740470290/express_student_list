const express = require('express');
const fs = require("fs");
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/', function (req, res) {
    fs.readFile('./db.json','utf8',function(err,data){
        var data=JSON.parse(data);
        data=data.stus;
        res.render('index.html',{
            msgs:data,
            username:req.session.userInfo
        })
    })
});
router.get('/create', function (req, res) {
    res.render("post.html");
});
router.post('/create', urlencodedParser, function (req, res) {
    let data = fs.readFileSync('./db.json', 'utf8');
        data = JSON.parse(data);
        const stu=data.stus.findIndex(function (item) {
            return item.name==req.body.name
        });
        stu!=-1 && res.send('已注册');
    // 输出 JSON 格式
    var response = {
        "name": req.body.name,
        "pwd": req.body.pwd,
        "age": req.body.age,
        "sex": req.body.sex,
        "date": (new Date()).toLocaleString()
    };
    response.id=data.stus.length+1;
    data['stus'].push(response);
    let Str_ans = JSON.stringify(data);
    fs.writeFile('./db.json', Str_ans, 'utf8', (err) => {
        if (err) throw err;
    });
    req.session.isLogin=true;
    req.session.userInfo=req.body.name;
    res.cookie("name",req.body.name);
    res.redirect('/stu');
});
module.exports=router;

