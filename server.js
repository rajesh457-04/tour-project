// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const Registeruser = require('./model'); // User model
const Guide = require('./work/Guide'); // Guide model
const middleware = require('./middleware'); // Authentication middleware
const touristRoutes = require('./work/Touristroute'); // Tourist routes
const guideRoutes = require('./work/Guideroute'); // Guide routes

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connection established'))
  .catch((err) => {
    console.error('DB Connection Error:', err);
    process.exit(1); // Exit the app if the database connection fails
  });

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: '*' })); // Enable CORS

// Registration Route
// Registration Route
app.post('/register', async (req, res) => {
  try {
      const { username, email, password, confirmpassword } = req.body;
      let exist = await Registeruser.findOne({ email });
      if (exist) {
          return res.status(400).send('User Already Exist');
      }
      if (password !== confirmpassword) {
          return res.status(400).send('Passwords are not matching');
      }
      let newUser = new Registeruser({
          username,
          email,
          password // Only save the hashed password
      });
      await newUser.save();
      res.status(200).send('Registered Successfully');
  } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
  }
});
// Login Route
app.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      let exist = await Registeruser.findOne({ email });
      if (!exist) {
          return res.status(400).send('User Not Found');
      }
      // Compare hashed password
      if (!await bcrypt.compare(password, exist.password)) {
          return res.status(400).send('Invalid credentials');
      }
      let payload = {
          user: {
              id: exist.id
          }
      };
      jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (err, token) => {
          if (err) throw err;
          return res.json({ token });
      });
  } catch (err) {
      console.error(err);
      return res.status(500).send('Server Error');
  }
});

app.get('/myprofile', middleware, async (req, res) => {
  try {
    const user = await Registeruser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Matching Route: Match tourist with guide
app.post('/api/tourist/match-tourist-with-guide', async (req, res) => {
  try {
    const { destination, preferredGuideType } = req.body;

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const query = { location: destination };
    if (preferredGuideType && preferredGuideType !== 'No Preference') {
      query.guideType = preferredGuideType;
    }

    const matchedGuide = await Guide.findOne(query);
    if (!matchedGuide) {
      return res.status(404).json({ message: 'No guides found for the selected location and guide type' });
    }

    res.json({
      message: 'Guide Found',
      guideDetails: matchedGuide,
    });
  } catch (err) {
    console.error('Error during matching tourist with guide:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Use Tourist and Guide Routes
app.use('/api/tourist', touristRoutes);
app.use('/api/guide', guideRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
