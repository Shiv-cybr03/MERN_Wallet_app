const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const userRoute = require("./routes/userRoute");

const PORT = process.env.PORT || 5000;

//start will 20 min after video number 5....

//Connect DB
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected")).catch(err =>{console.log("Error connecting to MongoDB:", err)});

app.use(express.json());
app.use("/api/users", userRoute);


app.listen(PORT, ()=>{
    console.log("server is started port:5000");
});