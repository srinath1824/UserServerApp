const express =  require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://test:test@mongocluster-fdyrb.mongodb.net/test?retryWrites=true&w=majority";
let userFilter;


function checkUser(req, res, next) {
    let users;
    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        let dbo = db.db("userData");
    dbo.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        users = result;
        userFilter = users.filter(user => {
            return user.username == req.body.username;
        });
        next();
    });
    db.close();
});
}

app.post('/login', checkUser, (request,response) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("userData");
    if(userFilter.length > 0) {
        response.send("Username already exists");
    } else {
        let myobj = { username: request.body.username, password: request.body.password };
            dbo.collection("users").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                response.send(res.ops[0]);
            });
        }
    db.close();
});
});

app.get('/users', (req,res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("userData");
        dbo.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    db.close();
});
});

app.post('/profile', checkUser, (request,response) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("userData");
        let myobj = { 
            firstname: request.body.firstname, 
            lastname: request.body.lastname,
            age: request.body.age,
            email: request.body.email,
            phone: request.body.phone
        };
            dbo.collection("profile").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                response.send(res.ops[0]);
            });
    db.close();
});
});

app.listen(5000, () => {
    console.log("server is running on port 5000")
})