const express = require("express");
const router = express.Router();


// Bring Register Table !
const User = require("../tables/Register");

// @type    GET
//@route    /auth/register
// @desc    Registers User
// @access  PUBLIC

router.get("/register",function(request,response){
    response.render("register");
});

// @type     POST
//@route    /auth/registerDetails
// @desc    Save Registration Details into the database !
// @access  PUBLIC

router.post("/registerDetails",function(request,response){
    // Deconstruct all the data from an object !
    const { username, email, password} = request.body;

    // @TODO -  Backend password validation !

    // Create Timestamp !
    const timeStamp = new Date().toLocaleString();

    User.findOne({email})
    .then(function(user){

        // Check if user exists or not !
        if(user){
            // Send response that user exists already !
            response.json({
                emailerror : "User exists already !"
            });

        }else{

            // Save user data into database !
            
            // Create User Object to be stored in database !
            const user = {
                username,email,password,timeStamp
            };

            // Store User Object in database !
            new User(user).save()
            .then(function(user){
                console.log("Data Saved Successfully !");

                // Store data into session !
                request.session.email = user.email;
                request.session.ID = user._id;

                console.log(request.session);

                // Response
                response.json({
                    success : "Registered Successfully !"
                });
            })
            .catch(function(error){
                console.log(`Database Error : ${error} `);
            });
        }
    })
    .catch(function(error){
        console.log(`Error : ${error}`)
    });

}); 

// @type    GET
//@route    /auth/login
// @desc    Registers User
// @access  PUBLIC

router.get("/login",function(request,response){
    response.render("login");
});


// @type     POST
//@route    /auth/loginDetails
// @desc    Sign In  !
// @access  PUBLIC

router.post("/loginDetails",function(request,response){

    // Deconstruct Body Object !
    const { email, password } = request.body;

    // Bring User Table !
    User.findOne({ email : email})
        .then(function(user){

            // Check whether user exists or not !
            if(user){

                // User exists !
                // Now compare password from the database and password from the form !

                if(password === user.password){   //Here user will be an object containing all details as its properties !
                   
                     // Store data into session !
                    request.session.email = user.email;
                    request.session.ID = user._id;

                    // Response !
                    response.json({
                        success : "Successfully Logged In !"
                    });

                    
                }else{
                    response.json({
                        passworderror : "Password not matched !"
                    });
                };


            }else{

                // User Doesn't exists !
                response.json({
                    emailerror : "User is not registered !"
                });
            };

        })
        .catch(function(error){
            console.log(`Error : ${error}`);
        });

});


module.exports = router;
