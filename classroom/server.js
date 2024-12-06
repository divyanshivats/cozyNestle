const express = require("express")
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/posts.js")
const cookieParser = require("cookie-parser");
const session = require("express-session")



// using session as middleware
const sessionOptions ={secret:  "mysupersecret", 
    resave: false, 
    saveUninitialized: true,
};

app.use(session(sessionOptions))

app.get("/register", (req,res) => {
    let {name ='anonymous'} = req.query;
    res.session.name = name;
    res.redirect("/hello")

})
app.get("/hello", (req,res) => {
    res.send(`hello, ${req.session.name}`)
})

app.get("/test", (req,res) => {
    res.send("test successful")
})

// app.get("/reqcount", (req,res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`u sent a req ${req.session.count} times`)
// })
// app.use(cookieParser("secretcode"));


// app.get("/getsignedcookie", (req,res) =>{
//     res.cookie("made-in", "india", {signed: true});
//     res.send("signed cookie sent");
// })

// app.get("/verify", (req,res) =>{
//     // console.log(req.cookies); /// will not send signed cookies
//     console.log(req.signedCookies);
    
    
// })
// // index route
// app.get("/getcookies", (req,res) => {
//     res.cookie("greet", "hello");
//     res.cookie("madeIn", "India");
//     res.send("sent you cookie")
// })

// // app.greet("/greet", (req,res) => {

// // })



// app.get("/", (req,res) =>{
//     console.dir(req.cookies)
//     console.log('working');
//     res.send("hi, root")
    
// })


// app.use("/users", users); // all the routes requesting  will first try to be matched with all the user 
// // all the routes starting w "/" or write the common path 

// // posts 
// app.use("/posts", posts);

app.listen(3000, () => {
    console.log('server is listening to port 3000');
    
})