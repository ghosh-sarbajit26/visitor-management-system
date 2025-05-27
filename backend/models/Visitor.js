const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    organization: String,
    address: String,
    purpose: String,
    personToVisit: String,
    signature: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

visitorSchema.index({ timestamp: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
