const router = require("express").Router();
const Requests = require('../models/requestsModel');
const authMiddleWare = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");


//get all request for a user

router.post("/get-all-requests-by-user", authMiddleWare, async(req, res)=>{
    try {
        const requests = await Requests.find({
            $or:[{
                sender: req.body.userId
            },{
                receiver: req.body.userId
            }]
        }).populate("sender").populate("receiver").sort({createdAt: -1});

        res.send({
            data: requests,
            message: "Requests fetched successful",
            success: true
        })
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});


// Send a request to another user.

router.post("/send-requests",authMiddleWare, async(req,res) => {
    try {
        const { receiver,amount, description } = req.body;

        if (!amount) {
            console.log("Amount is not come form the fronted! ");
            return res.status(400).json({ error: "Amount is required" });
        }


        const request = new Requests({
            sender: req.body.userId,
            receiver,
            amount,
            description,
        });

        await request.save();

        res.send({
            data: request,
            message: "Request send successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});


//Update a request status

router.post("/update-request-status", authMiddleware, async(req, res) => {
    try {
        
        if(req.body.status === "accepted"){

            // Create a new transaction 
            const transaction = new Transaction({
                sender: req.body.receiver._id,
                receiver: req.body.sender._id,
                amount: req.body.amount,
                description: req.body.description,
                status: "success"
            });
            await transaction.save();

            //deduct the amount from the sender
            await User.findByIdAndUpdate(req.body.sender._id, {
                $inc: {balance: req.body.amount},
            })
            //add the amount to the receiver
            await User.findByIdAndUpdate(req.body.receiver._id, {
                $inc: {balance: -req.body.amount},
            });
        }
         // Update the request status
         await Requests.findByIdAndUpdate(req.body._id, {
            status: req.body.status,
        });

        res.status(200).send({
            data: null,
            message: "Request status update successfully",
            success: true,
        });

    } catch (error) {
        res.status(500).send({
            data: error,
            message: error.message,
            success: false,
        })
    }
});



module.exports = router;