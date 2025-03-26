const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email : {
        type : String ,
        required : true
    },

    // remaining feields like username and password are automatically added by the passport-local-mongoose

 });


userSchema.plugin(passportLocalMongoose);   //username , hashing , salting and password generates automatically by this plug in


module.exports = mongoose.model('User', userSchema);