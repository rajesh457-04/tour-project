const express = require('express');
const Tourist = require('./Tourist');
const Guide = require('./Guide');
const router = express.Router();
const auth = require('../middleware'); 
const Booking = require('./Booking');
const jwt = require('jsonwebtoken');

// Predefined set of options for Travel Companion
const TRAVEL_COMPANION_OPTIONS = new Set(['Family', 'Friends', 'Solo', 'Couple', 'Group']);

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

// Tourist registration
router.post('/tourist-register', async (req, res) => {
    try {
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

        // Validate input
        if (!username || !email || !destination || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        // Validate date format
        if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Validate travel companion option
        if (!TRAVEL_COMPANION_OPTIONS.has(travelCompanion)) {
            return res.status(400).json({ 
                message: `Invalid travel companion option. Valid options are: ${Array.from(TRAVEL_COMPANION_OPTIONS).join(', ')}` 
            });
        }

        // Check if tourist exists
        const existingTourist = await Tourist.findOne({ email });
        if (existingTourist) {
            return res.status(400).json({ message: 'Tourist Already Exists' });
        }

        // Create new tourist
        const newTourist = new Tourist({ 
            username, 
            email, 
            destination, 
            dateFrom, 
            dateTo, 
            preferredModeOfTransport, 
            travelCompanion, 
            languagePreferences, 
            preferredGuideType 
        });

        await newTourist.save();

        // Create JWT token
        const payload = {
            user: {
                id: newTourist._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ 
                    message: 'Tourist Registered Successfully',
                    token,
                    tourist: {
                        username: newTourist.username,
                        email: newTourist.email,
                        destination: newTourist.destination,
                        dateFrom: newTourist.dateFrom,
                        dateTo: newTourist.dateTo
                    }
                });
            }
        );
    } catch (err) {
        console.error("Error during tourist registration:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Match tourist with guide
router.post('/match-tourist-with-guide', auth, async (req, res) => {
    try {
        const { destination, preferredGuideType } = req.body;
        
        console.log('Querying for guide with:', { location: destination, guideType: preferredGuideType });
        
        const matchingGuide = await Guide.findOne({
            location: destination,
            guideType: preferredGuideType
        });

        if (!matchingGuide) {
            return res.status(404).json({ message: 'No guide found matching your criteria' });
        }

        res.json({ 
            message: 'Guide found successfully',
            guideDetails: matchingGuide 
        });
    } catch (error) {
        console.error("Error matching guide:", error);
        res.status(500).json({ message: 'Error matching guide' });
    }
});

// Create booking
router.post('/create-booking', auth, async (req, res) => {
    try {
        const { guideId, dateFrom, dateTo, location } = req.body;
        const userId = req.user.id;

        // Create new booking
        const newBooking = new Booking({
            userId,
            guideDetails: guideId,
            dateFrom: new Date(dateFrom),
            dateTo: new Date(dateTo),
            status: 'pending',
            location,
            totalCost: 1000 // You can modify this based on your pricing logic
        });

        await newBooking.save();

        res.json({ 
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: 'Error creating booking' });
    }
});

// Get bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        console.log('User ID:', req.user.id);
        
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('guideDetails', 'username email phone guideExperience languagesSpoken')
            .sort({ createdAt: -1 });
        
        console.log('Bookings found:', bookings.length);

        const formattedBookings = bookings.map(booking => ({
            id: booking._id,
            guide: booking.guideDetails,
            dateFrom: booking.dateFrom,
            dateTo: booking.dateTo,
            status: booking.status,
            location: booking.location,
            totalCost: booking.totalCost,
            createdAt: booking.createdAt
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Cancel booking
router.put('/cancel-booking/:bookingId', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            userId: req.user.id
        }).populate('guideDetails');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel a non-pending booking' });
        }

        booking.status = 'cancelled';
        booking.cancellationDate = new Date();
        booking.cancellationReason = req.body.reason || 'No reason provided';
        
        await booking.save();

        // You can add notification logic here (email/SMS to guide)

        res.json({ 
            message: 'Booking cancelled successfully',
            booking: {
                id: booking._id,
                status: booking.status,
                cancellationDate: booking.cancellationDate,
                cancellationReason: booking.cancellationReason
            }
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
});

module.exports = router;
