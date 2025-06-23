const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName : {
        type : String ,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true, 
    },
    password : {
        type : String,
    },
    bio : {
        type : String,
        trim : true
    },
    skillsICanTeach : {
        type : [String],
        default : []
    },
    skillsIWantToLearn : {
        type : [String],
        default : []
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    }
}, {
    timestamps : true
});
const User = mongoose.model('Users', userSchema);
module.exports = User;