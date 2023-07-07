const express = require("express")
const router = express.Router()
const {v4:uuidv4} = require("uuid")
const {db,genid} =  require("../db/DBUtils")



router.post("/login",async (req,res) => {
    //验证账号密码
    let {account,password} = req.body;
    let {err,rows} = await db.async.all("select * from `admin` where `account`=? AND `password`=?",[account,password])

    if(err == null && rows.length > 0){
        //生成token并更新数据库
        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"
        
        await db.async.run(update_token_sql,[login_token,rows[0].id])
        
        //返回含token且隐藏密码的用户信息，
        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password = ''

        res.send({
            code:200,
            msg:"登录成功",
            data:admin_info
        })
    }else{
        res.send({
            code:500,
            msg:"登录失败"
        })
    }
})

module.exports = router