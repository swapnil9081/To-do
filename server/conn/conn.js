const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect("mongodb+srv://yadavsaurbh915:swapnil6306@cluster0.4r2e9xz.mongodb.net/tododb", {

    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Optional: stops the server if DB fails
  }
};

conn(); // ✅ now works correctly
