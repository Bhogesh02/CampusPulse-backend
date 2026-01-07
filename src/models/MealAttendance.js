const mongoose = require('mongoose');

const mealAttendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner'],
        required: true
    },
    preference: {
        type: String,
        enum: ['veg', 'non_veg'],
        required: true
    }
}, { timestamps: true });

// Ensure a student can only make one choice per meal per day
mealAttendanceSchema.index({ studentId: 1, date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model('MealAttendance', mealAttendanceSchema);
