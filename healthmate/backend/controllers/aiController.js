const { generateHealthTips, generateFriendlyMessage } = require('../utils/gemini');

// @desc   
// @route   
// @access  
const getHealthTips = async (req, res) => {
  try {
    const userLanguage = req.user.language || 'en';
    
    const result = await generateHealthTips(userLanguage);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        tips: result.tips,
        language: userLanguage
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error generating health tips',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get health tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating health tips',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
@desc    
@route  
@access 
const getFriendlyMessage = async (req, res) => {
  try {
    const userLanguage = req.user.language || 'en';
    const userName = req.user.name || 'User';
    
    const result = await generateFriendlyMessage(userLanguage, userName);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        language: userLanguage
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error generating friendly message',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get friendly message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating friendly message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    
// @route   
// @access  
const getAIInsights = async (req, res) => {
  try {
    const userLanguage = req.user.language || 'en';
    const userName = req.user.name || 'User';
    
    // Generate both health tips and friendly message
    const [tipsResult, messageResult] = await Promise.all([
      generateHealthTips(userLanguage),
      generateFriendlyMessage(userLanguage, userName)
    ]);
    
    const insights = {
      healthTips: tipsResult.success ? tipsResult.tips : [],
      friendlyMessage: messageResult.success ? messageResult.message : '',
      language: userLanguage,
      generatedAt: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Get AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI insights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getHealthTips,
  getFriendlyMessage,
  getAIInsights
};
