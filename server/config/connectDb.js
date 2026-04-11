const mongoose = require("mongoose");
const colors = require("colors");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgCyan.white);
    return conn; // Return the connection object if needed elsewhere in your code
  } catch (error) {
    console.error(`${error}`.bgRed);
    process.exit(1);
  }
};

module.exports = connectDb;
