const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    guideExperience: {
        type: String,  // Storing experience in years as a string
        required: true
    },
    modeOfTransport: {
        type: [String], // Array of strings for multiple transport options
        required: true
    },
    languagesSpoken: {
        type: String,
        required: true
    },
    guideType: {
        type: String, // Male, Female, No Preference
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
