const mongoose =require('mongoose')
const userschema =new mongoose.Schema({
    name:String,
    email:{
        type: String,
        unique:true,
        required:true
    },
    password:String,
    profilepic:String,
},{
    timestamps:true
}
)

const usermodel =mongoose.model("user",userschema)
module.exports=usermodel