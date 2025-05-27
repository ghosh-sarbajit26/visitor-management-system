const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: String
});

module.exports = mongoose.model('Admin', adminSchema, 'admin');
