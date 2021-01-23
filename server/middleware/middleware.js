// Middlewares !
const redirectLogin = function(request,response,next){
    if(!request.session.ID){
        response.redirect("/auth/register");
    }else{
        next();
    }
};

const redirectHome = function(request,response,next){
    if(request.session.ID){
        response.redirect("/");
    }else{
        next();
    };
};


module.exports = {
    redirectLogin,
    redirectHome
};