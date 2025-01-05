const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
    userId: { // Add this field to associate the booking with a user
        type: mongoose.Schema.Types.ObjectId, // Assuming you have a User model
        required: true,
        ref: 'User ' // Reference to the User model
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    destination: {
        type: String,
        required: true,
        enum: ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'] // Change if more destinations are available
    },
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    },
    preferredModeOfTransport: {
        type: [String], // Array of transport options
        enum: ['Car', 'Bike', 'Bus'], // Modify or add more options
        required: true
    },
    travelCompanion: {
        type: String,
        enum: ['Family', 'Friends', 'Solo', 'Couple', 'Group'],
        required: true
    },
    languagePreferences: {
        type: String,
        required: true
    },
    preferredGuideType: {
        type: String,
        enum: ['Male', 'Female', 'No Preference'],
        required: true
    },
    assignedGuide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide' // Assuming there's a Guide model to link with
    }
}, {
    timestamps: true
});

// Method to check if the tourist has been assigned a guide
touristSchema.methods.assignGuide = function(guide) {
    this.assignedGuide = guide;
    return this.save();
};

const Tourist = mongoose.model('Tourist', touristSchema);

module.exports = Tourist;