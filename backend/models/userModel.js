const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please add the user name']
    }, 
    email: {
        type: String,
        require: [true, 'Please add the email address'],
        unique: [true, 'Email address already taken']
    },
    password: {
        type: String,
        require: [true, "Please add the user password"]
    }, 
    _id: {
        type: Number,
        require: [true, "Please add the id"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);