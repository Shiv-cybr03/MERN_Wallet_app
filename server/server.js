const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const userRoute = require("./routes/userRoute");
const transactionRoute = require("./routes/transactionRoute");
const requestsRoute = require("./routes/requestsRoute")

const PORT = process.env.PORT || 5000;


//Connect DB
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected")).catch(err =>{console.log("Error connecting to MongoDB:", err)});

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authentication headers
};
  
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/requests", requestsRoute);


app.listen(PORT, ()=>{
    console.log("server is started port:5000");
});