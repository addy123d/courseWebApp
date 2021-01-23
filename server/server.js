// Initialisations !
// ADD Dependency - Express, Mongoose, Express-Session
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const ejs = require("ejs");
const {
    redirectLogin,
    redirectHome
 } = require("./middleware/middleware");

// Port and Host
const port = 5500;
const host = '127.0.0.1';

// Calling express app !
const app = express();

// Session Configuration !
const sess = {
    name: "User",
    resave: false,
    saveUninitialized: true,
    secret: "mySecret",
    cookie: {}
  }


if (app.get('env') === "production") {
    sess.cookie.secure = false;
    sess.cookie.maxAge = 60 * 60;
    sess.cookie.sameSite = true;
};

app.use(session(sess));


// Data transfer configurations !
app.use(express.json());   // Data is parsed into format :- JSON (Javascript Object Notation)
app.use(express.urlencoded({extended: false})); 

// Views configuration !
app.set("view engine","ejs");


// Bring Route files from routes folder !
const auth = require("./routes/auth");
const course = require("./routes/course");

// Bring url !
const url = require("./setup/config").url;

// Database Connection !
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
};

mongoose.connect(url,options)
    .then(function(){
        console.log("Database Connected Successfully !")
    })
    .catch(function(error){
        console.log(`Something went wrong ! - ${error}`);
    });

// Bring Courses Table !
const Course = require("./tables/Courses");

// Routes
app.get("/",redirectLogin,function(request,response){

    Course.find()
        .then(function(courses){
            response.render("courses",{ courses });
        })
        .catch(function(error){
            console.log(`Error : ${error}`);
        });

});

// Authentication Route !
app.use("/auth",redirectHome,auth);
app.use("/course",redirectLogin,course);

//@type - GET
//@access - Private
//@route - /logout
app.get("/logout",redirectLogin,function(request,response){
    request.session.destroy(function(error){
        if(error){
            response.redirect("/");
        }else{
            response.redirect("/auth/register");
        }
    });
});


// Listen to port 5500 !
app.listen(port,host,function(){
    console.log(`Server is running at port ${port}`);
});


