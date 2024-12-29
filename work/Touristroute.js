const express = require('express');
const Tourist = require('./Tourist');
const Guide = require('./Guide');
const router = express.Router();
const auth = require('../middleware'); 
const Booking = require('./Booking');
const jwt = require('jsonwebtoken');
const User = require('../model');

// Predefined set of options for Travel Companion
const TRAVEL_COMPANION_OPTIONS = new Set(['Family', 'Friends', 'Solo', 'Couple', 'Group']);

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

// Tourist registration with guide matching
router.post('/tourist-register', async (req, res) => {
    const { 
        username, 
        email, 
        destination, 
        dateFrom, 
        dateTo, 
        preferredModeOfTransport, 
        travelCompanion, 
        languagePreferences, 
        preferredGuideType 
    } = req.body;

    try {
        // Validate input
        if (!username || !email || !destination || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        // Validate date format
        if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Validate travel companion option
        if (!['Friends', 'Family', 'Solo', 'Other'].includes(travelCompanion)) {
            return res.status(400).json({ 
                message: `Invalid travel companion option. Valid options are: Friends, Family, Solo, Other` 
            });
        }

        // Check if tourist already exists
        const existingTourist = await Tourist.findOne({ email });
        if (existingTourist) {
            return res.status(400).json({ message: 'Tourist already exists' });
        }

        // Check if user exists, otherwise create a new user
        let user;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            user = existingUser;
        } else {
            // Automatically create a new user if not found
            user = new User({
                email, // assuming you need only email and username for user creation
                username,
                password: 'defaultPassword', // You can set a default password or omit it to handle later
            });
            await user.save(); // Save the new user to the database
        }

        // Find matching guides
        const guides = await Guide.find({ location: destination });
        if (!guides.length) {
            return res.status(404).json({
                message: 'Registration successful! No guide assigned.',
                booking: false,
            });
        }

        let assignedGuide = guides.find(guide => guide.guideType === preferredGuideType) || guides[0];
        let guideMessage = assignedGuide.guideType === preferredGuideType
            ? `Guide found: ${assignedGuide.username}, located in ${assignedGuide.location}.`
            : 'No matching guide found for preferred type, assigned first available guide.';

        // Create new tourist and associate with the created user
        const newTourist = new Tourist({ 
            username, 
            email, 
            destination, 
            dateFrom, 
            dateTo, 
            preferredModeOfTransport, 
            travelCompanion, 
            languagePreferences, 
            preferredGuideType,
            assignedGuide: assignedGuide._id,
            userId: user._id, // Associate the newly created user with the tourist
        });

        await newTourist.save(); // Save the tourist to the database

        // Generate JWT token for the tourist (linked with the user)
        const payload = {
            user: { id: newTourist._id },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Tourist Registration Successful:', newTourist);

        // Send response
        return res.status(201).json({
            message: `Registration successful! ${guideMessage}`,
            booking: true,
            token,
            assignedGuide: {
                username: assignedGuide.username,
                location: assignedGuide.location,
            },
        });
    } catch (err) {
        console.error('Error during tourist registration:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});




// In your backend code (Touristroute.js)
// In your backend code (Touristroute.js)

router.get('/tourists-with-guides', async (req, res) => {
    try {
        // Fetch tourists with their assigned guide details
        const touristsWithGuides = await Tourist.find({ assignedGuide: { $ne: null } })
            .populate('assignedGuide', 'username location'); // Populate guide details (username and location)

        if (!touristsWithGuides || touristsWithGuides.length === 0) {
            return res.status(404).json({ message: 'No tourists assigned to guides found.' });
        }

        // Respond with tourists who are assigned to a guide
        return res.status(200).json(touristsWithGuides);
    } catch (err) {
        console.error('Error fetching tourists with guides:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



const authMiddleware = require('../middleware'); // Adjust the path if needed


module.exports = router;