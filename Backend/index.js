require("dotenv").config();
const connectDB = require('./config/DB');
const express = require("express");
const port = process.env.PORT;
const URL = process.env.MONGO_URI;
const app = express();
app.use(express.json());

// importing the routes
// it is used to handle user authentication (register and login)
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
// connecting to MongoDB
connectDB(URL);
// listening to the server
app.listen(port, () => {
    console.log(`🚀Server is running on portt ${port}`);
});