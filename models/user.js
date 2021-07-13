const mongoose =require("mongoose")
const userSchema = new mongoose.Schema({
name:{
  type:String,
  required:true,
  unique:true,
},
email:{
  type:String,
  unique:true,
},
password:{
  type:String,
  required:true,
  unique:true,
},
phone:{
  type:String,
  unique:true,
},

})
module.exports =mongoose.model("User",userSchema)