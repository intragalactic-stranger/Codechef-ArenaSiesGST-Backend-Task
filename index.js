require("dotenv").config()
const express = require('express')
const app = express()
const path = require("path")
const logger = require("morgan")
const mongoose = require("mongoose")
const User = require("./models/user")
const session = require("express-session")
const methodOverride = require('method-override')

const { UserValidation } = require("./validation/users/user.validation")
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(methodOverride('_method'))

//template engine EJS
app.set("view-engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/css",
  express.static(path.join(__dirname, "node_modules/mdb-ui-kit/css")));
app.use("/js",
  express.static(path.join(__dirname, "node_modules/mdb-ui-kit/js")));


//CONNECTED MONGO_DB
const user = require("./models/user")
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true, useCreateIndex: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB connected "))
  .catch(err => console.log(err))



//SIGNUP GET
app.get("/login", (req, res) => {
  res.render("login.ejs")
})

//SIGNUP POST
app.post("/signup",async(req, res) => {
  if(req.body.email){
    req.body.phone=null;
  }
  else(req.body.email=null)

  console.log(req.body)
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone:req.body.phone,
    })
    console.log(user)
    await user.save();
    res.redirect("/login")
  } catch {
    res.redirect("/")

  }

})

//LOGIN GET
app.get("/", (req, res) => {
  res.render("login.ejs")
})

//LOGIN POST
app.post("/signin", async (req, res) => {
  console.log(req.body)
  if(req.body.email){

  
  await User.findOne({ email: req.body.email }).then(data => {
    if (req.body.password == data.password) {
      req.session.user = data
      res.redirect("/tech")
    }
  }).catch(e => {
    console.log(e)
    res.send("error-email")
  })}
  if(req.body.phone){
    await User.findOne({ phone: req.body.phone }).then(data => {
  if (req.body.password == data.password) {
    req.session.user = data
    res.render("editblog.ejs",{user:data})
  }
}).catch(e => {
  console.log(e)
  res.send("error-phone")
})

}
else(res.send("enter credentials"))

})
//updateuser 
app.post("/updateuser/:id" , async (req, res )=> {
  console.log("Updating")
  await User.findOneAndUpdate({_id: req.params.id} , 
  {$set:{
    email: req.body.email, 
    phone:req.body.phone,
    password: req.body.password, 
    
  }
},{new:true}
).then(result =>{
  console.log(result)
  if(result){
    console.log("UserUpdated")
    res.redirect("/tech")
  }else{
    res.send("error")
  }
}).catch(e=>{
  res.send("error in catch")
})
}) 
//deleteuser
app.post("/deleteuser/:id" , async (req, res )=> {
  await User.findOneAndDelete({_id: req.params.id}).then(result =>{
    if(result){
      console.log("User deleted")
      res.redirect("/login")
    }else{
      res.send("error")
    }
  }).catch(e=>{
    console.log(e) ;
    res.send("error in catch")
  })
  
  
  })

//routes for frontend
app.get("/tech", async (req, res) => {
    await User.findById(req.session.user._id).then(user=> {
     
       res.render("tech.ejs" , {
         user:user
       })
      
    })
  })

app.get("/edituser/:id" , async (req,res) =>{
  await User.findById(req.params.id).then(user=> {
   
     res.render("editblog.ejs" , {
       user:user
     } )
   
   }) .catch(e => {
    console.log(e)
    res.send("error")
  })
})

//logout
app.post("/logout", (req, res) => {

  req.session.destroy()
  res.redirect("/")
})

//middlewares
function checkAuthentication(req, res, next) {
  if (req.session.user) {
    return next();

  }

  else {
    res.redirect("/")
  }
}
//default routes not found
app.use(function (req, res) {
  res.send("Page not found");
})





//listening to port
let port = process.env.PORT || 80;
app.listen(port, () => {
  console.log("listening to port 80")
})





