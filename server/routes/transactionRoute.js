const router = require("express").Router();
const Transaction = require("../models/transactionModel");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");


// Transfer money from one account to another account 

router.post("/transfer-fund", authMiddleware, async(req,res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();

        // decrease the sender's balance 
        await User.findByIdUpdate(req.body.sender,{
            $inc: { balance: -req.body.amount },
        })

        // Increase the Receiver's balance 
        await User.findByIdUpdate(req.body.receiver,{
            $inc: { balance: req.body.amount },
        })

        res.send({
            message: "Transaction successfull",
            data: newTransaction,
            success: true
        })
    } catch (error) {
        res.send({
            message: "Transaction failed",
            data: error.message,
            success: false
        })
    }
})

// To verify the receiver account Number.

router.post("/verify-account", authMiddleware, async(req,res) => {
    try {
        const user = await User.findOne({_id: req.body.receiver});
        if(user){
            res.send({
                message: "Account Verified.",
                data: user,
                success: true
            });
        }else{
            res.send({
                message: "Account not found!",
                data: null,
                success: false,
            });
        }
    } catch (error) {
        res.send({
            message: "Account not found!",
            data: null,
            success: false,
        });
    }
})

module.exports = router;