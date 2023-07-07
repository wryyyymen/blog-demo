const express = require("express");
const multer = require("multer");
const app = express();
const port = 8060
const path = require('path')
const {db} = require('./db/DBUtils')

app.use(express.json())

//跨域请求
app.use(function(req,res,next){
    //设置允许跨域的域名,*代表允许任意域名 
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200);//让options尝试
    else next();
})

app.use(express.json())
//指定上传文件的储存目录
const update = multer({
    dest:"./public/upload/temp"
})
app.use(update.any())
//指定静态资源路径
app.use(express.static(path.join(__dirname,"public")))

//category/_token/add
const ADMIN_TOKEN_PATH = "/_token"
app.all("*",async(req,res,next) => {
    if(req.path.indexOf(ADMIN_TOKEN_PATH) > -1){
        let {token} = req.headers;
        console.log(token);

        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql,[token])
        if(adminResult.rows.length == 0 || adminResult.err != null){
            res.send({
                code:403,
                msg:'请先登录'
            })
            return
        }else{
            next()
        }
    }else{
        next()
    }
})

app.use('/test',require("./router/TestRouter"))
app.use('/admin',require("./router/AdminRouter"))
app.use('/category',require("./router/CategoryRouter"))
app.use("/blog",require("./router/BlogRouter"))
app.use("/upload",require("./router/UploadRouter"))

app.get('/',(req,res)=>{
    res.send('Hello')
})



app.listen(port,()=>{
    console.log(`启动成功: http://localhost:${port}`);
})