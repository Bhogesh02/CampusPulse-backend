const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('⏳ Attempting to connect to MongoDB...');

        // NOTE: Removed deprecated options: useNewUrlParser, useUnifiedTopology
        // Mongoose 6+ defauts these to true and they are no longer supported in Mongoose 7+
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_management');

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database Name: ${conn.connection.name}`);

        // --- ONE-TIME FIX: Drop problematic 'username_1' index if it exists ---
        try {
            const usersCollection = conn.connection.db.collection('users');
            const indexes = await usersCollection.indexes();
            const usernameIndex = indexes.find(idx => idx.name === 'username_1');

            if (usernameIndex) {
                console.log('⚠️ Found legacy "username_1" index. Dropping it to prevent duplicate null errors...');
                await usersCollection.dropIndex('username_1');
                console.log('✅ "username_1" index dropped successfully. You can now register users without usernames.');
            }
        } catch (err) {
            // Ignore errors (like if collection doesn't exist yet)
            console.log('ℹ️ Index check skipped:', err.message);
        }
        // ----------------------------------------------------------------------
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('🔍 Full Error Stack:', error.stack);
        process.exit(1);
    }
};

module.exports = connectDB;
