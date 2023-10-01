const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser");
const HomeRouter=require("./routes/homeRouter")
const SignUpRouter=require("./routes/signUpRoute")
const SDatabase=require("./student")
const ejs=require("ejs")
const Tdatabase=require("./teacher");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const app=express();
const teacher=Tdatabase.find({});
const port=process.env.port || 3000
console.log(port);

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Tdatabase.authenticate()));
passport.use(new LocalStrategy(SDatabase.authenticate()));
passport.serializeUser(Tdatabase.serializeUser());
passport.serializeUser(SDatabase.serializeUser());
passport.deserializeUser(Tdatabase.deserializeUser());
passport.deserializeUser(SDatabase.deserializeUser());

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}




app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.render('login',{title:"Faculty Tracker"});
// })
app.get("/",HomeRouter);
app.get("/signup",SignUpRouter)
app.get("/login",(req,res)=>{
    res.render("login",{title:""});
})
app.post("/signup", async(req,res)=>{
    console.log(req.body.password);
    console.log(req.body.cpassword);
    try{
        const data={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        
        };
        const cpassword1=req.body.cpassword;
        const password1=req.body.password;
        console.log("done");
        if (password1 === cpassword1) {
            await SDatabase.insertMany([data]);
            res.render("login",{title:"Sign Up successfull"});
        }
        else{
            res.render("signup",{title:"",password:"Failer",email:""});
        }
    }
    catch(error){
        res.render("signup",{title:"",password:"Error",email:""});

    }
})
app.post("/login",async (req,res)=>{
    console.log(req.body.email);
   try{
   
       const usermail=await Tdatabase.findOne({email:req.body.email});
    //    console.log(usermail.email);
    // const result2=usermail2.password==req.body.password;
    // // console.log(result2);
    // const result=usermail.password==req.body.password;
    // console.log(result);



       const usermail2=await SDatabase.findOne({email:req.body.email});
    //    const userpassword=await Tdatabase.findOne({email:req.body.password})
       if(usermail){
            const result=usermail.password==req.body.password;
            if(result){
                console.log("Teacher Accepted");
                const data =await Tdatabase.find();
                
                    // if(err) {throw err;}
                    if(isLoggedIn){
                        res.render("teacher",{records:data}); 

                    }
                    
            
                // res.render("teacher");
            }
            else{
                res.status(400).json({error:"Password Doesnt match"});                
            }
       }
       else if(usermail2){
        const result2=usermail2.password==req.body.password;
        if(result2,isLoggedIn){
            console.log("Student Accepted");
       const data =await Tdatabase.find();

            // res.render("student");
            res.render("student",{records:data}); 

        }
        else{
            res.status(400).json({error:"Password Doesnt match"});                
        }

       }
       else{
        console.log("Email not found");
        res.status(400).json({error:"User does not exist"});                


       }
    
   
   
    
} catch(error){
    res.status(400).json({error:"Invalid Credentials"});

}
    
})
app.listen(8000,()=>{
    console.log(port)
});

app.get("/update",(req,res)=>{
    res.render("update")
})
// app.get("/teacher",(req,res)=>{
//     res.render("teacher")
// })
app.post("/update",async (req,res)=>{
    await Tdatabase.findOneAndUpdate({email:req.body.email},{$set:{Availability:req.body.Availability,Location:req.body.Location}})
    // console.log(user.email);
    // user.Update
    const data =await Tdatabase.find();

    res.render("teacher",{records:data});
    // res.redirect("teacher");
})