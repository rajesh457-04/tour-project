const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let Registeruser = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Pre-save hook to hash the password before saving it to the database
Registeruser.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next(); // If password is not modified, move on
        }
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (err) {
        next(err); // Pass error to next middleware
    }
});

module.exports = mongoose.model('Registeruser', Registeruser);
