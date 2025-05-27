const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailTrimmed = email.trim().toLowerCase();
        const admin = await Admin.findOne({ email: emailTrimmed });

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
