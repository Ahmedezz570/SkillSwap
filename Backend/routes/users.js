const express = require("express"); 
const router = express.Router();
const { getAllUsers , getUserById , deleteUserById , updateUserById} = require("../controllers/userControllers");
// Get all users
router.get('/', getAllUsers);
// Get user by ID
router.get('/:id', getUserById);
// Delete user by ID
router.delete('/:id', deleteUserById);
// Update user by ID
router.put('/:id', updateUserById);


module.exports = router;