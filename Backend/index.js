require("dotenv").config();
const connectDB = require('./config/DB');
const express = require("express");
const cors = require("cors");   
const port = process.env.PORT;
const URL = process.env.MONGO_URI;
const app = express();
app.use(express.json());
app.use(cors());
// importing the routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

// it is used to handle user authentication (register and login)
app.use("/api/auth", authRoutes);

// it is used to handle user-related operations (get all users , get user by ID, delete user by ID, update user by ID)
app.use("/api/users", userRoutes);

// connecting to MongoDB
connectDB(URL);

// listening to the server
app.listen(port, () => {
    console.log(`🚀Server is running on portt ${port}`);
});