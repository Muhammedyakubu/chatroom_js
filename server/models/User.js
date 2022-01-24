const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userID: Number,
	username: String,
});

module.exports = mongoose.model("User", userSchema);
