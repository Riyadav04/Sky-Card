import { User } from "../model/user.model.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Correct from JWT payload
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const userId = req.user.userId; // FIXED ✅
    const updates = { ...req.body };

    if (updates.dateOfBirth) {
      updates.dateOfBirth = new Date(updates.dateOfBirth);
    }

    if (req.file) {
      updates.profilePic = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // FIXED ✅

    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
