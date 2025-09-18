import User from '../models/User.js';

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { funnyName, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { funnyName, avatar },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        funnyName: user.funnyName
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ error: "Role query parameter is required" });
    }

    const users = await User.find({ role }).select("name email expertise _id");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
