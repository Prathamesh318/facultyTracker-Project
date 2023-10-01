const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser");

const Router=express.Router();

Router.get("/signup",(req,res)=>{
    res.render("signup",{title:"Fill Form",password:"",email:""})
})

module.exports=Router