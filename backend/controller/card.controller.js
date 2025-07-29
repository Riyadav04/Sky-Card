import Card from "../model/cardDetail.model.js";
import fs from "fs";

/** Copy known top-level fields out of a map into a shallow object. */
function extractKnownFields(map = {}) {
  const out = {};
  if (map.fullname) out.fullname = map.fullname;
  if (!out.fullname && map.name) out.fullname = map.name; // fallback
  if (map.email) out.email = map.email;
  if (map.phone) out.phone = map.phone;
  if (map.jobtitle) out.jobtitle = map.jobtitle;
  if (map.website) out.website = map.website;
  if (map.address) out.address = map.address;
  return out;
}

// POST /card/create
export const createCard = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // Parse JSON string from 'data' field
    let dynamicData = {};
    if (req.body.data) {
      try {
        dynamicData = JSON.parse(req.body.data);
      } catch (e) {
        console.warn("Invalid JSON in req.body.data", e);
      }
    }

    // Merge additional form fields (excluding 'data' and 'templateId')
    const ignore = new Set(["data", "templateId"]);
    Object.entries(req.body).forEach(([key, value]) => {
      if (!ignore.has(key)) dynamicData[key] = value;
    });

    // Extract known fields
    const knownFields = extractKnownFields(dynamicData);
    Object.keys(knownFields).forEach((key) => delete dynamicData[key]); // remove known fields from dynamic

    const card = new Card({
      userId,
      ...knownFields,
      fields: dynamicData,
      templateId: req.body.templateId,
      profilePic: req.file?.filename || null,
    });

    const savedCard = await card.save();
    res.status(201).json({ message: "Card created", card: savedCard });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ message: "Failed to create card", error: error.message });
  }
};

// GET /card/list/:id
export const getMyCards = async (req, res) => {
  try {
    const userId = req.params.id;
    const cards = await Card.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Failed to fetch cards", error: error.message });
  }
};

// GET /card/:id
export const getCardById = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card by ID:", error);
    res.status(500).json({ message: "Failed to fetch card", error: error.message });
  }
};

// PUT /card/:id
export const updateCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?.userId;

    const existingCard = await Card.findById(cardId);
    if (!existingCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (existingCard.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Parse dynamic fields if sent as JSON string
    let dynamicData = {};
    if (req.body.data) {
      try {
        dynamicData = JSON.parse(req.body.data);
      } catch (e) {
        console.warn("Bad JSON in req.body.data", e);
      }
    }

    // Merge additional fields from form input (skip control keys)
    const ignore = new Set(["data", "templateId"]);
    Object.entries(req.body).forEach(([k, v]) => {
      if (!ignore.has(k)) dynamicData[k] = v;
    });

    // Extract top-level known fields
    const known = extractKnownFields(dynamicData);
    Object.keys(known).forEach((k) => delete dynamicData[k]); // clean dynamic

    // Handle profile image update
    let profilePicPath = existingCard.profilePic;
    if (req.file) {
      if (profilePicPath && fs.existsSync(profilePicPath)) {
        fs.unlinkSync(profilePicPath);
      }
      profilePicPath = req.file.filename;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        ...known,
        profilePic: profilePicPath,
        fields: {
          ...(existingCard.fields || {}),
          ...dynamicData,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Failed to update card", error: error.message });
  }
};

// DELETE /card/:id
export const deleteCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?.userId;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Delete profile image
    if (card.profilePic && fs.existsSync(card.profilePic)) {
      fs.unlinkSync(card.profilePic);
    }

    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Failed to delete card", error: error.message });
  }
};
