const User = require('../models/User');
// Get all users
// This controller fetches all users from the database, excluding their passwords.
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Get user by ID
// This controller fetches a user by their ID, excluding their password.
const getUserById = async (req, res) => {
    const userId = req.params.id;
    console.log("Fetching user with ID:", userId);
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Delete user by ID
// This controller deletes a user by their ID and returns a success message.
const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }};
// Update user by ID
// This controller updates a user's details by their ID and returns the updated user.
const updateUserById = async (req, res) => {
    const userId = req.params.id;
    console.log("Updating user with ID:", userId);
    const { fullName, email, bio, skillsICanTeach, skillsIWantToLearn } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, {
                fullName,
                email,
                bio,
                skillsICanTeach,
                skillsIWantToLearn
            }, { new: true, runValidators: true })
            .select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }};
module.exports = { getAllUsers , getUserById , deleteUserById , updateUserById};