// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const Registeruser = require('./model');       // User model
const Guide = require('./work/Guide');         // Guide model
const middleware = require('./middleware');    // Authentication middleware
const touristRoutes = require('./work/Touristroute'); // Tourist routes
const guideRoutes = require('./work/Guideroute');     // Guide routes

const app = express();
const PORT = process.env.PORT || 5000;
const Booking = require('./work/Booking'); 
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB Connection established'))
    .catch(err => console.error('DB Connection Error:', err));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: '*' })); // Enable CORS

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body;
        const exist = await Registeruser.findOne({ email });
        
        if (exist) return res.status(400).json({ message: 'User  Already Exists' });
        if (password !== confirmpassword) return res.status(400).json({ message: 'Passwords do not match' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new Registeruser({ username, email, password: hashedPassword });
        
        await newUser .save();
        res.status(201).json({ message: 'Registered Successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Registeruser.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'User  Not Found' });
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Profile Route
app.get('/myprofile', middleware, async (req, res) => {
    try {
        const user = await Registeruser.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: 'User  not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Matching Route: Match tourist with guide
app.post('/api/Tourist/match-tourist-with-guide', async (req, res) => {
    try {
        const { destination, dateFrom, dateTo, preferredGuideType } = req.body;

        // Query to find a guide matching the location and preferred type
        const query = {
            location: destination, // Match location instead of destination
        };

        if (preferredGuideType && preferredGuideType !== "No Preference") {
            query.guideType = preferredGuideType; // Match guideType if specified
        }

        console.log("Querying for guide with:", query); // Debugging line

        const matchedGuide = await Guide.findOne(query);

        if (matchedGuide) {
            return res.json({
                message: `Guide Found: ${matchedGuide.username}`, // Changed to username for clarity
                guideDetails: matchedGuide,
            });
        } else {
            return res.json({ message: "No match found for the selected location and guide type." });
        }
    } catch (err) {
        console.error("Error in matching:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/Tourist/user-details', middleware, async (req, res) => {
    try {
        const user = await Registeruser.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// New route to fetch user's bookings
app.get('/api/Tourist/my-bookings', middleware, async (req, res) => {
    try {
        console.log('User ID:', req.user.id); // Log the user ID for debugging

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const bookings = await Booking.find({ userId: req.user.id })
            .populate('guideDetails', 'username email phone guideExperience')
            .sort({ createdAt: -1 });

        console.log('Bookings found:', bookings.length); // Log the number of bookings found

        const formattedBookings = bookings.map(booking => ({
            id: booking._id,
            guide: booking.guideDetails,
            dateFrom: booking.dateFrom,
            dateTo: booking.dateTo,
            status: booking.status,
            location: booking.location,
            createdAt: booking.createdAt,
            totalCost: booking.totalCost
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// New route to create booking
app.post('/api/Tourist/create-booking', middleware, async (req, res) => {
    try {
        const { touristDetails, guideDetails } = req.body;

        // Ensure the booking is created for the authenticated user
        if (touristDetails.email !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized booking attempt' });
        }

        const newBooking = new Booking({
            touristDetails,
            guideDetails,
            status: 'pending',
            createdAt: new Date(),
            bookingId: Math.random().toString(36).substr(2, 9)
        });

        await newBooking.save();
        res.status(201).json({ 
            message: 'Booking created successfully', 
            booking: newBooking 
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: 'Error creating booking' });
    }
});


// Apply prefixed routes
app.use('/api/tourist', touristRoutes);  // Tourist-specific routes
app.use('/api/guide', guideRoutes);      // Guide-specific routes

// Catch-all 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Unexpected server error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});