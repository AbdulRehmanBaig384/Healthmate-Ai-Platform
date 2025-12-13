const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
const register = async (req, res) => {
  try {
    const { name, email, password, language } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });}
    const user = await User.create({
      name,
      email,
      password,
      language: language || 'en'
    });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
<<<<<<< Updated upstream
      });
    }
    // Check if password matches
=======
      });}
>>>>>>> Stashed changes
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    await user.updateLastLogin();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        language: user.language,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
const updateProfile = async (req, res) => {
  try {
    const { name, language, avatar } = req.body;
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, language, avatar },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        language: user.language,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
module.exports = {register,login,getMe,updateProfile,changePassword,logout};
