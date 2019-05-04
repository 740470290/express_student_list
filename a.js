var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
app.engine('html',require('express-art-template'))
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.use('/public', express.static('public'));

app.get('/stu', function (req, res) {
    fs.readFile('./db.json','utf8',function(err,data){
        console.log(data)
        var data=JSON.parse(data)
        data=data.stus
        console.log(data)
        console.log(JSON.stringify(data))
        if(err)res.end(err)
        res.render('index.html',{
            msgs:data 
        })          
    })
})
app.get('/stu/create', function (req, res) {
    res.render("post.html");
})
app.post('/stu/create', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    var response = {
        "name": req.body.name,
        "pwd": req.body.pwd,
        "age": req.body.age,
        "sex": req.body.sex,
        "date": (new Date()).toLocaleString()
    };
    fs.readFile(__dirname + "/" + "db.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        console.log(response);
        response.id=data.stus.length+1
        data['stus'].push(response)
        let Str_ans = JSON.stringify(data);
        fs.writeFile('db.json', Str_ans, 'utf8', (err) => {
            if (err) throw err;
            console.log('done');
        });
    })
    console.log(response);

res.redirect('/stu');
})

var server = app.listen(8080, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
