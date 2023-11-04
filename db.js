require('dotenv').config(); // Add this line at the top

const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = connectToDatabase;
