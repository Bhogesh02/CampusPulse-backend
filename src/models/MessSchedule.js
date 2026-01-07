const mongoose = require('mongoose');

const messScheduleSchema = new mongoose.Schema({
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    menu: [{
        day: {
            type: String, // Mon, Tue, etc.
            required: true
        },
        breakfast: {
            veg: String,
            nonVeg: String
        },
        lunch: {
            veg: String,
            nonVeg: String
        },
        dinner: {
            veg: String,
            nonVeg: String
        }
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for quick lookup by college and date
messScheduleSchema.index({ collegeId: 1, weekStartDate: 1 });

module.exports = mongoose.model('MessSchedule', messScheduleSchema);
