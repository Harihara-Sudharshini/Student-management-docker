const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
studentId: {
type: String,
required: true,
unique: true,
trim: true,
},

fullName: {
  type: String,
  required: true,
  trim: true,
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

department: {
  type: String,
  required: true,
  trim: true,
},

stream: {
  type: String,
  required: true,
  trim: true,
},

academicYear: {
  type: String,
  required: true,
  trim: true,
},

studyYear: {
  type: String,
  default: "",
  trim: true,
},

phone: {
  type: String,
  default: "",
  trim: true,
},

status: {
  type: String,
  enum: ["Active", "Pending", "Inactive"],
  default: "Active",
},

},
{
timestamps: true,
}
);

module.exports = mongoose.model("Student", studentSchema);