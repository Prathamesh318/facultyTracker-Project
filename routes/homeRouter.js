const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser");

const Router=express.Router();

Router.get("/",(req,res)=>{
    res.render("home");
})

// Router.post("/signup")
module.exports=Router