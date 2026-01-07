const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Please provide a role'],
        enum: ['student', 'hostel_admin', 'mess_admin', 'warden']
    },
    collegeName: {
        type: String,
        required: [true, 'Please provide a college name']
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'expired'],
        default: 'pending'
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-expire indexing
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;
