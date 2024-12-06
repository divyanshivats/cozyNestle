const express = require("express")
const app = express();
const router = express.Router();
// posts 
router.get("/", (req,res) => {
    res.send("GET for posts");
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