import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  category: String,
  imageUrl: String
});

export default mongoose.model("Template", TemplateSchema);
