const mongoose=require("mongoose");
const Email= require('mongoose-type-email')


const authorSchema= new mongoose.Schema({
    
    fname: {
        type:String,
        required: "First Name is required",
        trim: true
    }, 
    lname: {
        type: String,
        required: "Last name is required",
        trim: true
    },
    title:  {
        type:String,
        enum: ["Mr", "Mrs", "Miss"],
        required:"Title is required",
    },                                        
    email:  {
        type: Email,
        required: "Email is required",
        unique: true,
        lowercase: true,
        trim: true
    },
                                           
    password:{
        type: String,
        required: "Password is mandatory",
        trim: true
    }
},{timestamps:true});

module.exports=mongoose.model("author",authorSchema)