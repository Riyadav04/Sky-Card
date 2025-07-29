// const cardSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//     required: true,
//   },
//   fullname: {
//     type: String,
//   },
//   jobtitle: {
//     type: String,
//   },
//   email: {
//     type: String,
//   },
//   phone: {
//     type: String,
//   },
//   website: {
//     type: String,
//   },
//   address: {
//     type: String,
//   },
//   profilePic: {
//     type: String,
//   },
//   templateId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "CardTemplate",
//     required: true,
//   },
//   data: {
//     type: mongoose.Schema.Types.Mixed,
//     default: {},
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Card = mongoose.model("Card", cardSchema);
// export default Card;
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CardTemplate",
    required: true,
  },
  fields: {
    type: Object, // Dynamic fields (name, email, address, etc.)
    required: true,
  },
  profilePic: {
    type: String, // File name (if uploaded)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model("Card", cardSchema);
export default Card;

