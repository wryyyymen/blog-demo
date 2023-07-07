const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const { param } = require("../router/TestRouter")
const Genid = require("../utils/SnowFlake")

let db = new sqlite3.Database(path.join(__dirname,"db.sqlite3"))
const genid = new Genid({WorkerId:1}) 

//像db添加asyns属性
db.async = {}

db.async.all = (sql,params) => {
    return new Promise((resolve,reject) => {
        db.all(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

db.async.run = (sql,params) => {
    return new Promise((resolve,reject) => {
        db.run(sql,params,(err,rows) => {
            resolve({err,rows})
        })
    })
}

module.exports = {db,genid}