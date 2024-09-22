const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://priyanshu7791:7791994483@cluster0.zrxs5.mongodb.net/LoginData")
.then(() => {
    console.log("connection successful");
}).catch ((err) => {
    console.log("no connection");
});