const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors')
const app = express();
const MongoClient = require('mongodb');
const url ='mongodb+srv://ramyabtech19:<password>@ecomdb-t8ic5.mongodb.net/test?retryWrites=true&w=majority';

app.set('PORT',process.env.PORT)

app.use(cors());

app.use(bodyparser.json()) //middle ware 


app.get('/view', function (req, res) {
    //res.json(myData)
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("shopDB");
        var usersData = db.collection('products').find().toArray();
        usersData
            .then(function (data) {
                client.close();
                res.json(data);
            })
            .catch(function (err) {
                client.close();
                res.status(500).json({
                    message: "error"
                })
            })

    })
});
app.get('/viewcategory/:id', function (req, res) {
    //console.log(req.params.id)    
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var db = client.db("shopDB");
        var productData = db.collection("products").find({category: req.params.id }).toArray();
        productData.then(function (data) {
            client.close();
            res.json(data);
        })
            .catch(function (err) {
                client.close();
                res.json({
                    message: "error"
                })
            });
    });
});

app.post('/category', function (req, res) {
    console.log(req.body);

    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);

        var db = client.db("shopDB");
        db.collection('products').insertOne(req.body, (err, result) => {
            if (err) throw err;
            client.close();

            res.json({
                message:"success"
            })
        })

    })

})
app.put('/update/:id', function (req, res) {
    console.log(req.params.id);
    let param_id = req.params.id
    console.log(req.body);
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) =>{
        if (err) throw err;
        var db = client.db('shopDB');
        var ObjectId = require('mongodb').ObjectID;
        db.collection('products').updateOne(
            {_id :new ObjectId(param_id)},            
            { $set: {category : req.body.category, prodName: req.body.prodName, price: req.body.price, description: req.body.description,qty: req.body.qty } }, { upsert: true }, (err, result)=>{
                if (err) throw err;
                client.close();
                res.json({
                    message: "updated"
                })
            });

    });
});

app.delete('/delete/:id', function (req, res) {    
    console.log(req.params.id);
    let param_id = req.params.id
    console.log(req.body);
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);

        var db = client.db("shopDB");
        var ObjectId = require('mongodb').ObjectID;
        db.collection('products').findOneAndDelete({ _id :new ObjectId(param_id)}, (err, result) => {
            if (err) throw err;
            client.close();

            res.json({
                message: "Deleted successfully"
            })
        })
    })
})

app.listen(app.get('PORT'), function () {
    console.log(app.get('PORT'))
});


