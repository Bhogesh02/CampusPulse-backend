const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { // Keeping simple 'name' for backward compatibility or ease, but can split logic in service
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: false, // Optional for some logic, but requested in reg
    },
    role: {
        type: String,
        enum: ['super_admin', 'student', 'hostel_admin', 'mess_admin', 'warden'],
        required: true,
    },

    // Specific Fields
    studentId: {
        type: String,
        sparse: true,
        unique: true
    },
    staffId: {
        type: String,
        sparse: true,
        unique: true
    },

    // References
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: false
    },
    hostelId: {
        type: String,
        default: null,
    },
    roomId: {
        type: String,
        default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hashing handled in Service layer or here? 
// User requested "Clean Architecture". 
// Repository creating data usually expects pre-processed data or model hooks.
// The previous model had a pre-save hook. Let's keep it for safety.

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
