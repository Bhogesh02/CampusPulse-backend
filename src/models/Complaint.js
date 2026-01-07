const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String, // e.g., 'Food', 'Hygiene', 'Infrastructure'
        required: true
    },
    type: {
        type: String,
        enum: ['Hostel', 'Mess'],
        required: true
    },
    subCategory: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Solved', 'Rejected'],
        default: 'Pending'
    },

    // Anonymity
    isAnonymous: {
        type: Boolean,
        default: false
    },
    // If anonymous, studentId can be null or kept for internal tracking but hidden from admins via API filtering
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    // AI / Analysis Fields
    severity: {
        type: String,
        enum: ['Normal', 'Critical'],
        default: 'Normal'
    },
    sentiment: {
        type: String,
        enum: ['Positive', 'Neutral', 'Negative'],
        default: 'Neutral'
    },

    imageUrl: {
        type: String,
        default: ''
    },

    // Tracking
    hostelId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    solvedAt: {
        type: Date
    },
    adminRemark: {
        type: String
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
