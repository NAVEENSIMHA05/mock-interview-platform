const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace with your local URI string or process.env.MONGO_URI configuration
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mock_link');
    console.log(`[DATABASE] MongoDB connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ERROR] Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;