/**
 * Created by pc on 2017/4/7.
 */
//引入模块
var express=require("express");
var mysql=require('mysql');
var conn = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password : 'hlh123',
     database : 'kfl'
 })
conn.connect();
// app 是 express 对象的一个实例
var app=express();
// 引入静态文件
app.use(express.static("kfl"));
app.get("/getDishes",function (req,res) {
    var num=req.query.num;
    var index=req.query.index-1;
    var searchText=req.query.searchText;
    var sqlStr;
    if(searchText==""){
       sqlStr="select * from kf_dish limit "+index*num+","+num;
    }else {
        sqlStr="select * from kf_dish where name like '%"+searchText+"%' or material like '%"+searchText+"%'";
    }
    console.log(num,index,searchText,sqlStr);

    //console.log(sqlStr);
    conn.query(sqlStr,function (err, result) {
        if(err) throw err;
        //console.log(result);
        res.send(result);//传送数据给前端
    })

});
app.get("/getDish",function (req, res) {
    var id=req.query.id;//取得前端传过来的菜id
    console.log(id);
    var sqlStr="select * from kf_dish where did="+id;
    console.log(sqlStr);
    conn.query(sqlStr,function (err, result) {
        if(err) throw err;
        res.send(result);
    })
});
app.post("/orderDish",function (req,res) {
    //数据名与数据库定义的名字要一样
    var dish={
         user_name:req.query.username,
         sex:req.query.sex,
         phone:req.query.phone,
         addr:req.query.addr,
         did:req.query.did
    };
   console.log(dish);
    conn.query('insert into kf_order set ? ',dish,function (err, results) {
        if(err) throw err;
        res.send({"result":results.insertId});
    })
});
app.get("/getmyOrders",function (req,res) {
    var phone=req.query.phone;
    var sqlstr="SELECT* from kf_order INNER JOIN kf_dish on kf_order.did=kf_dish.did where phone='"+phone+"'ORDER BY oid desc ";
    console.log(sqlstr)
    conn.query(sqlstr,function (err,result) {
        if(err) throw err;
        res.json(result);
    })

})

app.listen(3000);