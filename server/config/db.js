const mongoose = require('mongoose');

const connectDB = async () => {

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    console.log("---------------------------------------------------------------------------------");
    console.log("ERROR: Could not connect to MongoDB.");
    console.log("ACTION REQUIRED: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Add Current IP.");
    console.log("---------------------------------------------------------------------------------");
    process.exit(1);
  }

}

module.exports = connectDB;
