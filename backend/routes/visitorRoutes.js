const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

router.post('/submit', async (req, res) => {
    try {
        const visitor = new Visitor(req.body);
        await visitor.save();
        res.status(201).json({ message: 'Visitor submitted successfully' });
    } catch (error) {
        console.error('Error saving visitor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getVisitors', async (req, res) => {
    try {
        const { startDate, endDate, employee, searchTerm, page = 1, limit = 25 } = req.query;

        let query = {};
        if (startDate && endDate) {
            const adjustedStart = new Date(startDate);
            adjustedStart.setHours(0, 0, 1, 0); 

            const adjustedEnd = new Date(endDate);
            adjustedEnd.setHours(23, 59, 59, 0); 

            query.timestamp = {
                $gte: adjustedStart,
                $lte: adjustedEnd
            };
        } else if (startDate) {
            const adjustedStart = new Date(startDate);
            adjustedStart.setHours(0, 0, 1, 0); 

            query.timestamp = { $gte: adjustedStart };
        }

        if (searchTerm) {
            query.name = { $regex: searchTerm, $options: 'i' };
        }

        if (employee && employee !== 'All') {
            query.personToVisit = employee;
        }

        const skip = (Number(page) - 1) * Number(limit);

        // console.log('Visitor Query:', query);
        const [visitors, totalCount] = await Promise.all([
            Visitor.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Visitor.countDocuments(query)
        ]);

        res.status(200).json({
            visitors,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Number(page),
            totalCount
        });
    } catch (error) {
        console.error('Error fetching visitors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;



