const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const visitorRoutes = require('./routes/visitorRoutes');
const adminRoutes = require('./routes/AdminRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/visitor', visitorRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Visitor Management Backend Running');
});


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
