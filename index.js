var express = require('express');
var app = express();

//set view pages in views
//set public floder as root
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'))

//setting
//body-paser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0-qkovx.mongodb.net/buoi07?retryWrites=true&w=majority', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log("connect err", err)
    } else {
        console.log("connect success")
    }
}
);

//port 
app.listen(3000)

app.get('/', function (req, res) {
    res.send('hello')
})

var Cap1 = require("./models/cap1")
var Cap2 = require("./models/cap2")

//save cap1
app.get('/cap1/:name',function(req,res){
    var TheThao = new Cap1({
        name: req.params.name,
        mang: []
    })
    // res.send(TheThao)
    TheThao.save(function(err){
        if (err){
            console.log("Save cap1 error:", err);
            res.json({kq:0})
            
        } else {
            console.log("Save cap1 thanh cong:");
            res.json({kq:1})        
        }
    })
})

//save cap2
app.get('/cap2/:name/:idc1',function(req,res){
    var BongDa = new Cap2({
        name: req.params.name
    })
    BongDa.save(function(err){
        if (err){
            console.log("Save cap2 error:", err);
            res.json({kq:0})
            
        } else {
            console.log("Save cap2 thanh cong:");
            Cap1.findOneAndUpdate(
                //tim cai gi
                {_id: req.params.idc1},
                //lam gi voi cai tim duoc: update id cua Bong Da (Cap2) vao mang cua The Thao (Cap1)
                {$push: {mang: BongDa._id}},
                //Bat loi error
                function(err){
                    if (err){
                        console.log("Update mang cap1 error:", err);
                        res.json({kq:0})
                        
                    } else {
                        console.log("Update mang cap1 thanh cong:");
                        res.json({kq:1})        
                    }
                }
            )       
        }
    })
})


//
app.get('/list/cap1',function(req,res){
    Cap1.aggregate(
        //tim cai gi
        [{
            $lookup: {
                from: 'cap2', //collection tren server
                localField: 'mang', //
                foreignField: '_id',
                as: 'danhsach'
            }
        }],
        function(err,mang){
            res.send(mang)
        }
    );
})
