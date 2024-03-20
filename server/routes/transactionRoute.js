const router = require("express").Router();
const Transaction = require("../models/transactionModel");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const stripe = require("stripe")('sk_test_51Os2a1SCyEj5plrEgJ0kAByEmdWFH1WSpH8kXpns1jaswkyYc0Hj0VhlH261We8AelSv0I23utJjiH8ZdHyw4Hio00NovkdjGT');

const { v4: uuidv4 } = require('uuid');

// Transfer money from one account to another account
router.post("/transfer-funds", authMiddleware, async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    // decrease the sender's balance
    await User.findByIdAndUpdate(req.body.sender, {
      $inc: { balance: -req.body.amount },
    });

    // Increase the Receiver's balance
    await User.findByIdAndUpdate(req.body.receiver, {
      $inc: { balance: req.body.amount },
    });

    res.send({
      message: "Transaction successful",
      data: newTransaction,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "Transaction failed",
      data: error.message,
      success: false,
    });
  }
});

// To verify the receiver account Number.
router.post("/verify-account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.receiver });
    if (user) {
      res.send({
        message: "Account Verified.",
        data: user,
        success: true,
      });
    } else {
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
});

// get all trasaction for a user.
router.post("/get-all-transactions-by-user", authMiddleware, async (req, res) =>{
  try {
    const transactions = await Transaction.find({
      $or: [
        {
          sender: req.body.userId
        },
        {
          receiver: req.body.userId
        }],
    }).sort({ createdAt: -1 }).populate("sender").populate("receiver");
    res.send({
      message: "Transactions fetched",
      data: transactions,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "Transaction not fetched",
      data: error.message,
      success: false,
    })
  }
});

//deposite fund using stripe
router.post("/deposit-funds", authMiddleware, async(req, res) => {
  let charge;
  try {
    const { token, amount } = req.body;
    // create a customer 
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

     // Handle errors if customer creation fails
     if (!customer) {
      console.error("Failed to create customer");
    }

    // create a charge 
    charge  = await stripe.charges.create({
      amount: amount,
      currency: "INR",
      source: token.id,
      receipt_email: token.email,
      description: "Deposited to wallet"
    },
    {
      idempotencyKey: uuidv4(), 

    });


    //save the transaction
    if(charge.status === "succeeded"){
      const newTransaction = new Transaction({
        sender: req.body.userId,
        receiver: req.body.userId,
        amount: amount,
        type: "deposit",
        reference: "stripe deposit",
        status: "success",
      });
      await newTransaction.save();

      //Increase the user's balance   Add the balance to the user account
      await User.findByIdAndUpdate(req.body.userId,{
        $inc: { balance: amount },
      });
      res.json({
        message: "Transaction successful",
        /*data: newTransaction,*/
        data: charge,
        success: true
      });
      //handle charge faild extra fields set your self.
    }if (charge.status !== "succeeded") {
      console.error("Charge failed:", charge.failure_message);
      return res.status(500).send({
        message: "Transaction failed",
        data: charge,
        success: false,
      });
    }else{
      console.error("Charge failed:", charge.failure_message);
      res.send({
        message: "Transaction failed",
        data: charge,
        success: false
      })
    }


  } catch (error) {
    console.error("Transaction failed:", error);
    res.status(500).json({
      message: "Transaction failed",
      data: charge,
      error: error.message,
      success: false
    })
  }
});



module.exports = router;
