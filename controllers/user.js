const user = require("../models/user.js");

module.exports.renderSignUp = (req,res) =>{
    res.render("users/signup.ejs")
};

module.exports.signup = async(req,res) =>{
   
    try{
        let {username, email, password} = req.body;
        const newUser = new user({email, username});
        const registered = await user.register(newUser,password);
        console.log(registered);
        req.login(registered, (req,res,err,next) =>{
            if(err){
                next(err);
            }
        })
        req.flash("success", "Yay! Welcome to CozyNestle")
        res.redirect("/listings");
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    } 

}
module.exports.renderloginform = (req,res) =>{
    res.render("users/login.ejs")
};
module.exports.login =  async (req, res) => {
    const redirectUrl = req.session.redirectUrl || "/listings"; // default to /listings if no redirect URL is set
    delete req.session.redirectUrl; // Clear it from the session
    res.redirect(redirectUrl); 
};
module.exports.logout = (req,res, next) =>{
    req.logOut((err) => {
        if(err){
            return next(err);
        } req.flash("success", "you are logged out")
        res.redirect("/listings");
       
        
    })
}