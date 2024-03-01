const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");


//register user account,

router.post("/register", async(req, res)=>{
    try {
        //Check if User is already exists.
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.send({
                success: false,
                message: "User already exists",
            });
        };

        //Hashing the password.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "User created successfully",
            data: null,
            success: true,
        });
    } 
    catch (error) {
        res.send({
            message: error.message,
            success : false,
        });
    }
});

// Login user account.

router.post("/login", async(req,res)=>{
    try {
        //Check if user exists.
        let user = await User.findOne({email: req.body.email });
        if(!user){
            return res.send({
                success: false,
                message: "User does not exists"
            });
        }
        // Check if password is correct or not.
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.send({
                success: false,
                message: "Invalid password",
            });
        }
        //Generate the Token
        const token = jwt.sign({ userId : user._id}, process.env.JWT_SECRET,{ expiresIn: "1d"});
        
        res.status(200).send({
            message: "User logged in successfully",
            data: token,
            success: true,
        })

    } catch (error) {
        res.send({
            message: error.message,
            success : false,
        });
    };
});

// Get user info

router.post("/get-user-info", authMiddleware, async(req,res) => {
    try {
        const user = await User.findById(req.body.userId);
        user.password = '';
        res.send({
            message: "User info fetched successFully",
            data: user,
            success: true,
        });

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        });
    }
});


module.exports = router;
