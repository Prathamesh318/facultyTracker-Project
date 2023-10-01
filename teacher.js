const mongoose=require('mongoose');
const bodyParser=require("body-parser");
const express=require("express")


const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/FacultyProject",{useNewUrlParser:true}).then(()=>{
    console.log("mongo connected");
})
.catch(()=>{
    console.log("Failed to connect");
})

const loginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    Subject:{
        type:String,
        required:true
    },
    Availability:{
        type:String,
        required:true
    },
    Location:{
        type:String,
        required:true
    }
})
loginSchema.plugin(passportLocalMongoose);


const teacher= new mongoose.model("TeacherDatabase",loginSchema);


module.exports=(teacher);