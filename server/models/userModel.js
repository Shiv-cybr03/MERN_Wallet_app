const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    identificationType: {
        type: String,
        required: true,
    },
    identificationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: String,
        default: 0
    },
    isVerified: {
        type: String,
        default: false
    },
    isAdmin: {
        type: String,
        default: false,
    }
},{timestamps: true});







module.exports = mongoose.model("users", userSchema);