const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection - Updated to your new database URL
const uri = "mongodb+srv://rohith77:rohithdb@cluster0.gjaxi.mongodb.net/studentDB?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  rollno: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  grade: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// API Routes

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update a student
app.post("/students", async (req, res) => {
  const { rollno, name, age, grade } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { rollno },
      { name, age, grade },
      { new: true, upsert: true }
    );
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a student
app.delete("/students/:rollno", async (req, res) => {
  const { rollno } = req.params;
  try {
    await Student.findOneAndDelete({ rollno });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
