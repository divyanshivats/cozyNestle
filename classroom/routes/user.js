const express = require("express")
const app = express();
const router = express.Router();

// we wrote common route already so we can remove /users

// index route
router.get("/", (req,res) => {
    res.send("GET for users");
})

// show users
router.get("/:id", (req,res) => {
    res.send("GET for show user")
})

//  post
router.post("/", (req,res) => {
    res.send("POST for users");
}) 

// delete
router.delete("/:id", (req,res) => {
    res.send("delete for show");
}) 

module.exports = router;