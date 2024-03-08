const router = require("express").Router();
const Transaction = require("../models/transactionModel");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const { uuid } = require('uuidv4');

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

    // create a charge 
    charge  = await stripe.charges.create({
      amount: amount,
      currency: "INR",
      receipt_email: token.email,
      description: "Deposited to wallet"
    },
    {
      idempotencyKey: uuid(),
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
      res.send({
        message: "Transaction successful",
        data: newTransaction,
        success: true
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
    res.status(500).send({
      message: "Transaction failed",
      data: charge,
      success: false
    })
  }
});



module.exports = router;
