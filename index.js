const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
var cors = require('cors')
const app = express();
const MongoClient = require('mongodb');
const url ='mongodb+srv://ramyabtech19:jaisriram@ecomdb-t8ic5.mongodb.net/test?retryWrites=true&w=majority';
const saltRounds = 10;

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

//REGISTER FORM API
app.post('/register', function (req, res) {
    console.log(req.body);

    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err;
        var db = client.db("shopDB");

        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) throw err;

            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;

                db.collection('users').insertOne({ name: req.body.name, email: req.body.email, password: hash, contact: req.body.contact }, (err, result) => {
                    if (err) throw err;email: req.body.email
                    client.close();

                    res.json({
                        message: "success"
                    })
                })
            })
        })

    })

})

app.post('/login', function (req, res) {
    console.log(req.body)
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err;
        var db = client.db("shopDB");
        db.collection('users').findOne({ email: req.body.email }, (err, user) => {
            if (err) throw err;
            //console.log(user)
            if (!user) {
                res.json({
                    message: "Invalid User"
                })
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) throw err;
                if (result) {

                    res.json({
                        message: "success"
                    })
                }
                else {
                    res.json({
                        message: "Incorrect password"
                    })
                }
            })
        })
    })
});


app.listen(app.get('PORT'), function () {
    console.log(app.get('PORT'))
});


