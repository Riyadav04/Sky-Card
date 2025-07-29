import mongoose from "mongoose";
import dotenv from "dotenv";
import CardTemplate from "./models/CardTemplate.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URL);

const templates = [
  {
    category: "Business",
    previewImage: "uploads/business_preview.png",
    fields: [
      { fieldName: "name", type: "text", position: { x: 10, y: 20, width: 30, height: 5 }, style: { fontSize: "16px" } },
      { fieldName: "business", type: "text", position: { x: 10, y: 30, width: 30, height: 5 }, style: { fontSize: "14px" } },
      { fieldName: "email", type: "text", position: { x: 10, y: 40, width: 30, height: 5 }, style: { fontSize: "14px" } },
      { fieldName: "phone", type: "text", position: { x: 10, y: 50, width: 30, height: 5 }, style: { fontSize: "14px" } },
    ]
  },
  {
    category: "Student",
    previewImage: "uploads/student_preview.png",
    fields: [
      { fieldName: "name", type: "text", position: { x: 10, y: 20 }, style: { fontSize: "16px" } },
      { fieldName: "college", type: "text", position: { x: 10, y: 30 }, style: { fontSize: "14px" } },
      { fieldName: "course", type: "text", position: { x: 10, y: 40 }, style: { fontSize: "14px" } },
      { fieldName: "email", type: "text", position: { x: 10, y: 50 }, style: { fontSize: "14px" } },
    ]
  },
  {
    category: "Teacher",
    previewImage: "uploads/teacher_preview.png",
    fields: [
      { fieldName: "name", type: "text", position: { x: 10, y: 20 }, style: { fontSize: "16px" } },
      { fieldName: "institution", type: "text", position: { x: 10, y: 30 }, style: { fontSize: "14px" } },
      { fieldName: "subject", type: "text", position: { x: 10, y: 40 }, style: { fontSize: "14px" } },
      { fieldName: "email", type: "text", position: { x: 10, y: 50 }, style: { fontSize: "14px" } },
    ]
  },
  {
    category: "Freelancer",
    previewImage: "uploads/freelancer_preview.png",
    fields: [
      { fieldName: "name", type: "text", position: { x: 10, y: 20 }, style: { fontSize: "16px" } },
      { fieldName: "skills", type: "text", position: { x: 10, y: 30 }, style: { fontSize: "14px" } },
      { fieldName: "portfolio", type: "text", position: { x: 10, y: 40 }, style: { fontSize: "14px" } },
      { fieldName: "email", type: "text", position: { x: 10, y: 50 }, style: { fontSize: "14px" } },
    ]
  },
  {
    category: "Artist",
    previewImage: "uploads/artist_preview.png",
    fields: [
      { fieldName: "name", type: "text", position: { x: 10, y: 20 }, style: { fontSize: "16px" } },
      { fieldName: "style", type: "text", position: { x: 10, y: 30 }, style: { fontSize: "14px" } },
      { fieldName: "instagram", type: "text", position: { x: 10, y: 40 }, style: { fontSize: "14px" } },
      { fieldName: "email", type: "text", position: { x: 10, y: 50 }, style: { fontSize: "14px" } },
    ]
  },
  {
    category: "Doctor",
    previewImage: "uploads/doctor_preview.png",
    fields: [
      { fieldName: "name", type: "text", position: { x: 10, y: 20 }, style: { fontSize: "16px" } },
      { fieldName: "specialization", type: "text", position: { x: 10, y: 30 }, style: { fontSize: "14px" } },
      { fieldName: "clinic", type: "text", position: { x: 10, y: 40 }, style: { fontSize: "14px" } },
      { fieldName: "phone", type: "text", position: { x: 10, y: 50 }, style: { fontSize: "14px" } },
    ]
  }
];

await CardTemplate.deleteMany({});
await CardTemplate.insertMany(templates);
console.log("Templates seeded.");
process.exit();
