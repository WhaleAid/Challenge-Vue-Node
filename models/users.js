const mongoose = require('mongoose');
const validator  = require('validator');
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        // unique: true
    },
    email : {
        type : String,
        required : [true, 'Please provide your email'],
        unique : true,
        lowercase : true,
        validate : {
            validator : validator.isEmail,
            message : 'Please enter a valid elail'
        } 
     },
     password : {
        type : String,
        required : [true, 'Please enter password'],
        minlength : 8,
        select : false
     },
     passwordConfirm : {
        type : String,
        required : [true, 'please confirm your password'],
        validate : {
            //this only work on CREATE and SAVE 
            //if it is an update we have to use save 
            validator : function(el){
                return el === this.password;
            },
            message : 'The two passwords are different'
        } 
    },
    date_of_birth: {
        type: Date,
        required: false
    },
    passwordChangedAt : {
        type : Date,
    },
});



module.exports = mongoose.model("User", userSchema);