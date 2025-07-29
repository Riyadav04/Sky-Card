import { User } from "../model/user.model.js";
import CardTemplate from "../model/adminCustomizeCard.model.js";

export const addCardTemplate = async (req, res) => {
  try {
    const { category, fieldStyles } = req.body;
    const previewImage = req.file?.filename;

    if (!previewImage) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newTemplate = new CardTemplate({
      category,
      previewImage: `uploads/${previewImage}`,
      fields: JSON.parse(fieldStyles || "[]"), 
      createdBy: req.user._id, 
    });

    await newTemplate.save();

    res.status(201).json({
      success: true,
      message: "Card template uploaded successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error in addCardTemplate:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to upload",
      error: error.message,
    });
  }
};

export const getAllCardTemplates = async (req, res) => {
  try {
    const templates = await CardTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

export const getSimpleCardTemplates = async (req, res) => {
  try {
    const templates = await CardTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

export const getSingleCardTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await CardTemplate.findById(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch template", error: error.message });
  }
};
export const updateCardTemplate = async (req, res) => {
  try {
    const updated = await CardTemplate.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          previewImage: req.body.previewImage,
          fields: req.body.fields,
        },
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Template not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteCardTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await CardTemplate.findByIdAndDelete(id);
    res.status(200).json({ msg: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete template" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
