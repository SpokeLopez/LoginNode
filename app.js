var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middleware/session");
var methodOverride = require("method-override");

var app = express();

app.use("/static",express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

app.use(methodOverride("_method"));
app.use(cookieSession({
    name: 'session',
    keys: ['llave1','llave2']
}));
app.use("/app",session_middleware);
app.use("/app",router_app);
app.set("view engine","jade");
app.get("/",function (req,res) {
    console.log(req.session.user_id);
    res.render("index");
});
app.get("/signup",function (req,res) {
    User.find(function (err,doc) {
        res.render("signup");
        console.log(doc);
    });
});
app.get("/login",function (req,res) {
    res.render("login");
});
app.post("/sessions",function (req,res) {
    User.findOne(
        {
            email:req.body.email,
            password:req.body.password
        },
        function (err,user) {
            req.session.user_id = user._id;
            res.redirect("/app");
        }
    );
});
app.post("/signup",function (req,res) {
    var user = new User({
        name:req.body.name,
        last_name:req.body.lastname,
        age:req.body.age,
        date_of_birth:req.body.date,
        sex:req.body.sex,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        password_confirmation:req.body.password_confirmation
    });
    
    user.save(function (err) {
        if(err){
            res.send(String(err));
        }else{
            res.send("Guardamos sus datos con éxito");
        }
    });
});
app.listen(3030);