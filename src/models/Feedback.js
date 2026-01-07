const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String
    },
    menuSnapshot: {
        // Store what was on the menu to track feedback against items
        veg: String,
        nonVeg: String
    }
});

// Index for daily analytics
feedbackSchema.index({ collegeId: 1, date: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
