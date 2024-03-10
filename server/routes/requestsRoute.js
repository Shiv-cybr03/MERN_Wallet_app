const router = require("express").Router();
const Requests = require('../models/requestsModel');
const authMiddleWare = require("../middleware/authMiddleware");

//get all request for a user

router.post("/get-all-requests-by-user", authMiddleWare, async(req, res)=>{
    try {
        const requests = await Requests.find({
            $or:[{
                sender: req.body.userId
            },{
                receiver: req.body.userId
            }]
        }).populate("sender", "name email").populate("receiver", "name email");

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
        const { receiver,email,amount, description } = req.body;

        if (!amount) {
            console.log("Amount is not come form the fronted! ");
            return res.status(400).json({ error: "Amount is required" });
        }


        const request = new Requests({
            sender: req.body.userId,
            receiver,
            amount,
            email,
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


module.exports = router;