import mongoose from "mongoose";

const cardTemplateSchema = new mongoose.Schema({
  category: { type: String, required: true },           
  previewImage: { type: String, required: true },   
  fields: [
    {
      fieldName: { type: String, required: true },
      type: { type: String, enum: ["text", "image", "button"], required: true },
      position: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
      },
      style: { type: Object }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CardTemplate", cardTemplateSchema);
