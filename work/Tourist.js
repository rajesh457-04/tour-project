const mongoose = require('mongoose');

// Define the schema for the tourist form
const TouristSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    destination: { type: String, required: true },
    dateFrom: { type: Date, required: true }, 
    dateTo: { type: Date, required: true }, 
    preferredModeOfTransport: { type: [String], required: true, default: [] }, 
    travelCompanion: { 
        type: String, 
        enum: ['Friends', 'Family', 'Solo', 'Other'], 
        required: true 
    },
    languagePreferences: { type: [String], required: false, default: [] }, 
    guideType: { 
        type: String, 
        enum: ['Male', 'Female', 'No Preference'], 
        required: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Tourist', TouristSchema);
