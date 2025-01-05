const express = require('express');
const Tourist = require('./Tourist');
const Guide = require('./Guide');
const router = express.Router();
const verifyToken = require('../middleware');
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
        // Step 1: Validate input fields
        if (!username || !email || !destination || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        // Step 2: Validate date format
        if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Step 3: Validate travel companion option
        const validCompanions = ['Friends', 'Family', 'Solo', 'Other'];
        if (!validCompanions.includes(travelCompanion)) {
            return res.status(400).json({ 
                message: `Invalid travel companion option. Valid options are: ${validCompanions.join(', ')}` 
            });
        }

        // Step 4: Check if user exists and matches email/username
        const existingUser  = await User.findOne({ email });
        if (!existingUser ) {
            return res.status(400).json({ message: 'User  does not exist. Please register first.' });
        }

        if (existingUser .username !== username) {
            return res.status(400).json({ message: 'Username does not match the registered username.' });
        }

        // Step 5: Check if this user has already registered as a tourist
        const existingTourist = await Tourist.findOne({ userId: existingUser ._id });
        if (existingTourist) {
            return res.status(400).json({ message: 'You have already registered as a tourist.' });
        }

        // Step 6: Find matching guides based on destination
        const guides = await Guide.find({ location: destination });
        if (!guides.length) {
            return res.status(404).json({
                message: 'Registration successful! No guide assigned.',
                booking: false,
            });
        }

        // Step 7: Assign a guide based on preferred guide type
        let assignedGuide = guides.find(guide => guide.guideType === preferredGuideType) || guides[0];
        let guideMessage = assignedGuide.guideType === preferredGuideType
            ? `Guide found: ${assignedGuide.username}, located in ${assignedGuide.location}.`
            : 'No matching guide found for preferred type, assigned first available guide.';

        // Step 8: Create a new tourist registration and associate it with the user
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
            userId: existingUser ._id, // Link tourist registration to the user's ID
        });

        await newTourist.save(); // Save the new tourist to the database

        // Step 9: Generate JWT token for the tourist (linked with the user)
        const payload = {
            user: { id: existingUser ._id }, // Use the user's ID for the token
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Tourist Registration Successful:', newTourist);

        // Step 10: Send response with guide details and token
        return res.status(201).json({
            message: `Registration successful! ${guideMessage}`,
            booking: true,
            token,
            assignedGuide: {
                username: assignedGuide.username,
                location : assignedGuide.location,
                guideType: assignedGuide.guideType,
            },
            tourist: newTourist,
        });
    } catch (err) {
        console.error('Error during tourist registration:', err); 
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route to fetch tourist bookings for the logged-in user
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        // Get the user ID from the token
        const userId = req.user.id;

        // Fetch bookings associated with the user ID
        const bookings = await Tourist.find({ userId }).populate('assignedGuide', 'username location');

        // Check if bookings exist
        if (!bookings || bookings.length === 0) {
            return res.status(204).json({ message: 'No bookings found for this user.' }); // 204 No Content
        }

        // Transform the bookings data for a cleaner response
        const transformedBookings = bookings.map(booking => ({
            id: booking._id,
            username: booking.username,
            email: booking.email,
            destination: booking.destination,
            travelCompanion: booking.travelCompanion,
            dateFrom: booking.dateFrom,
            dateTo: booking.dateTo,
            preferredModeOfTransport: booking.preferredModeOfTransport,
            languagePreferences: booking.languagePreferences,
            preferredGuideType: booking.preferredGuideType,
            assignedGuide: booking.assignedGuide ? {
                username: booking.assignedGuide.username,
                location: booking.assignedGuide.location,
            } : null,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        }));

        // Send the transformed bookings in the response
        return res.status(200).json({
            message: 'Bookings retrieved successfully.',
            bookings: transformedBookings,
        });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;



// In your backend code (Touristroute.js)
// In your backend code (Touristroute.