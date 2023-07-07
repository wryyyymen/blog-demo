const express = require("express")
const router = express.Router()
const {db,genid} = require("../db/DBUtils")


//列表接口
router.get("/list",async (req,res) => {
    const search_sql = "SELECT * FROM `category`"
    let {err,rows} = await db.async.all(search_sql,[])
    
    if(err==null){
        res.send({
            code:200,
            msg:'查询成功',
            rows 
        }) 
    }else{
        res.send({
            code:500,
            msg:'查询失败'
        })
    }
})

//添加接口
router.post("/_token/add",async (req,res)=>{
    let {name} = req.body
    const insert_sql = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)"
    let {err,rows} = db.async.run(insert_sql,[genid.NextId(),name])

    if(err == null){
        res.send({
            code:200,
            message:'添加成功',
            info:rows
        })
    }else{
        res.send({
            code:500,
            message:"post fail"
        })
    }
})

//修改接口
router.put("/_token/update",async (req,res)=>{
   

    let {id,name} = req.body
    const insert_sql = "UPDATE `category` SET  `name`=? WHERE `id`=? "
    let {err,rows} = db.async.run(insert_sql,[name,id])

    if(err == null){
        res.send({
            code:200,
            message:'修改成功'
        })
    }else{
        res.send({
            code:500,
            message:"put fail"
        })
    }
})

//删除接口
router.delete("/_token/delete",async (req,res)=>{
    let id = req.query.id
    console.log(id);
    const delete_sql = "DELETE FROM `category` WHERE  `id`=?"
    let {err,rows} = db.async.run(delete_sql,[id])
   
    if(err == null){
        res.send({
            code:200,
            message:'删除成功'
        })
    }else{
        res.send({
            code:500,
            message:"post fail"
        })
    }
})

module.exports = router