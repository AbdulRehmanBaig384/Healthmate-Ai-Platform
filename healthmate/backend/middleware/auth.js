const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  try{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];}
    
    if (!token && req.cookies.token) {
      token = req.cookies.token;}

    if (!token){
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user no longer exists'
        }); }

      req.user=user;
      next();
    } catch(error){
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });}
  }catch(error){
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};
// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode).cookie('token',token,options).json({
      success: true,token,
      user: {id: user._id, name:user.name, email: user.email, avatar:user.avatar, language: user.language,isVerified: user.isVerified}
    });};
module.exports = {protect,generateToken,sendTokenResponse};
