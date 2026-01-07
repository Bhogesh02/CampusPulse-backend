const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('⏳ Attempting to connect to MongoDB...');

        // NOTE: Removed deprecated options: useNewUrlParser, useUnifiedTopology
        // Mongoose 6+ defauts these to true and they are no longer supported in Mongoose 7+
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_management');

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('🔍 Full Error Stack:', error.stack);
        process.exit(1);
    }
};

module.exports = connectDB;
