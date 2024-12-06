if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/expressError.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");


const listingRoute = require("./routes/listing")
const reviewRoute = require("./routes/review")
const userRoute = require("./routes/user")

// const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

// connecting database to website
main()
    .then(() =>{
        console.log("connected to DB");
    })
        .catch((err) =>{
            console.log(err);
            
        })
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/boilerplate"); // Set default layout
// used when we are extracting some data(id) from the url
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
})

store.on("error", () => {
    console.log('ERROR in MONGO SESSION STORE', err);
    
})

// using session as a middleware
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
   cookie: {
    expires: Date.now() + 7*24*60*60*1000, // for one week
    maxAge: 7*24*60*60*1000,
    httpOnly : true //for security purpose
   }
};


app.use(session(sessionOptions));
app.use(flash());

// passport -

app.use(passport.initialize());
app.use(passport.session()); // website need the ability to identify the users as they browse from page to page
passport.use(new localStrategy(user.authenticate())); // to get user login or sign (authenticate)

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
 // to store the info not related to user

app.use((req,res,next) => {
    res.locals.success = req.flash("success"); // jo bhi success wala msg aayega that will be saved in locals.sucess
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})


// creating a deo user to test passport
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new user({
//         email: "student@gmail.com",
//         username: "divyanshi"
//     })
//     const registereduser =  await user.register(fakeUser, "password") // to register (user, password, or any callback )
//     res.send(registereduser);
// })

app.use("/home", (req,res) =>{
    res.render('listings/main')
})

app.use("/listings", listingRoute)
app.use("/listings/:id/reviews", reviewRoute)
app.use("/", userRoute)

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { msg: message });
});


app.listen(8080, ()=>{
    console.log("sever is listening to port 8080");
    
})