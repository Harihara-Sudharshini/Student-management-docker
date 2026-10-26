const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log("MongoDB connected successfully!");
})
.catch((error) => {
console.error("MongoDB connection failed:", error.message);
});

// Home route
app.get("/", (req, res) => {
res.json({
message: "CampusFlow Student Management API is running!",
status: "success",
});
});

// Health-check route
app.get("/api/health", (req, res) => {
res.json({
status: "healthy",
service: "CampusFlow Backend",
database:
mongoose.connection.readyState === 1 ? "connected" : "disconnected",
});
});

// GET: Retrieve all students, with optional search and filters
app.get("/api/students", async (req, res) => {
try {
const filter = {};


if (req.query.academicYear) {
  filter.academicYear = req.query.academicYear;
}

if (req.query.department) {
  filter.department = req.query.department;
}

if (req.query.stream) {
  filter.stream = req.query.stream;
}

if (req.query.status) {
  filter.status = req.query.status;
}

if (req.query.search) {
  const search = req.query.search.trim();

  if (search) {
    filter.$or = [
      { studentId: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
}

const students = await Student.find(filter).sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  count: students.length,
  students,
});


} catch (error) {
console.error("GET /api/students error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch students.",
  error: error.message,
});


}
});

// GET: Retrieve one student by MongoDB document ID
app.get("/api/students/:id", async (req, res) => {
try {
const student = await Student.findById(req.params.id);


if (!student) {
  return res.status(404).json({
    success: false,
    message: "Student not found.",
  });
}

return res.status(200).json({
  success: true,
  student,
});


} catch (error) {
console.error("GET /api/students/:id error:", error);


return res.status(400).json({
  success: false,
  message: "Invalid student ID.",
});


}
});

// POST: Add a student
app.post("/api/students", async (req, res) => {
try {
const student = await Student.create(req.body);


return res.status(201).json({
  success: true,
  message: "Student added successfully.",
  student,
});


} catch (error) {
console.error("POST /api/students error:", error);

if (error.code === 11000) {
  return res.status(409).json({
    success: false,
    message: "Student ID or email already exists.",
  });
}

if (error.name === "ValidationError") {
  return res.status(400).json({
    success: false,
    message: error.message,
  });
}

return res.status(500).json({
  success: false,
  message: "Failed to add student.",
});


}
});

// PUT: Update a student by MongoDB document ID
app.put("/api/students/:id", async (req, res) => {
try {
const student = await Student.findByIdAndUpdate(
req.params.id,
req.body,
{
new: true,
runValidators: true,
}
);


if (!student) {
  return res.status(404).json({
    success: false,
    message: "Student not found.",
  });
}

return res.status(200).json({
  success: true,
  message: "Student updated successfully.",
  student,
});


} catch (error) {
console.error("PUT /api/students/:id error:", error);


if (error.code === 11000) {
  return res.status(409).json({
    success: false,
    message: "Student ID or email already exists.",
  });
}

if (error.name === "ValidationError") {
  return res.status(400).json({
    success: false,
    message: error.message,
  });
}

return res.status(400).json({
  success: false,
  message: "Failed to update student.",
});


}
});

// DELETE: Remove a student by MongoDB document ID
app.delete("/api/students/:id", async (req, res) => {
try {
const student = await Student.findByIdAndDelete(req.params.id);


if (!student) {
  return res.status(404).json({
    success: false,
    message: "Student not found.",
  });
}

return res.status(200).json({
  success: true,
  message: "Student deleted successfully.",
});


} catch (error) {
console.error("DELETE /api/students/:id error:", error);


return res.status(400).json({
  success: false,
  message: "Invalid student ID.",
});


}
});

// Start server
app.listen(PORT, () => {
console.log(`CampusFlow backend running at http://localhost:${PORT}`);
});
