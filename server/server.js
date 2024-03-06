const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const userRoute = require("./routes/userRoute");
const transactionRoute = require("./routes/transactionRoute");

const PORT = process.env.PORT || 5000;


//Connect DB
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected")).catch(err =>{console.log("Error connecting to MongoDB:", err)});

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/transactions", transactionRoute);


app.listen(PORT, ()=>{
    console.log("server is started port:5000");
});