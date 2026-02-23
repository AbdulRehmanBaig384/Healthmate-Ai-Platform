// const { generateHealthTips, generateFriendlyMessage } = require('../utils/gemini');
// // const getHealthTips = async (req, res) => {
// //   try {
// //     const today = new Date().toISOString().slice(0, 10);

// // const cached = await Tips.findOne({ date: today });
// // if (cached) {
// //   return res.json({ success: true, tips: cached.tips });
// // }

// // const result = await generateHealthTips(userLanguage);
// // await Tips.create({ date: today, tips: result.tips });

// // res.json({ success: true, tips: result.tips });

// //     const userLanguage = req.user.language || 'en';
    
// //     // const result = await generateHealthTips(userLanguage);
    
// //     if (result.success) {
// //       res.status(200).json({
// //         success: true,
// //         tips: result.tips,
// //         language: userLanguage
// //       });
// //     } else {
// //       res.status(500).json({
// //         success: false,
// //         message: 'Error generating health tips',
// //         error: result.error
// //       });
// //     }
// //   } catch (error) {
// //     console.error('Get health tips error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error generating health tips',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // };


// const getHealthTips = async (req, res) => {
//   try {
//     const userLanguage = req.user.language || "en";
//     const today = new Date().toISOString().slice(0, 10);

//     const cached = await Tips.findOne({ date: today, language: userLanguage });
//     if (cached) {
//       return res.json({ success: true, tips: cached.tips });
//     }

//     const result = await generateHealthTips(userLanguage);

//     if (!result.success) {
//       return res.json({
//         success: true,
//         tips: DEFAULT_TIPS[userLanguage]
//       });
//     }

//     await Tips.create({
//       date: today,
//       language: userLanguage,
//       tips: result.tips
//     });

//     res.json({ success: true, tips: result.tips });

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Tips error" });
//   }
// };


// // const getFriendlyMessage = async (req, res) => {
// //   try {
// //     const userLanguage = req.user.language || 'en';
// //     const userName = req.user.name || 'User';
// //     const result = await generateFriendlyMessage(userLanguage, userName);
// //     if (result.success) {
// //       res.status(200).json({
// //         success: true,
// //         message: result.message,
// //         language: userLanguage
// //       });
// //     } else {
// //       res.status(500).json({
// //         success: false,
// //         message: 'Error generating friendly message',
// //         error: result.error
// //       });
// //     }
// //   } catch (error) {
// //     console.error('Get friendly message error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error generating friendly message',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // }; 

// const getFriendlyMessage = async (req, res) => {
//   try {
//     const result = await generateFriendlyMessage(
//       req.user.language,
//       req.user.name
//     );
//     res.json({ success: true, message: result.message });
//   } catch {
//     res.json({ success: true, message: "Stay healthy! 🌱" });
//   }
// };

// // const getAIInsights = async (req, res) => {
// //   try {
// //     const userLanguage = req.user?.language || 'en';
// //     const userName = req.user?.name || 'User';
// //     // const [tipsResult, messageResult] = await Promise.all([
// //     //   generateHealthTips(userLanguage),
// //     //   generateFriendlyMessage(userLanguage, userName)
// //     // ]); 

// //     const tipsResult = await generateHealthTips(userLanguage);
// // // wait 5 seconds
// // await new Promise(res => setTimeout(res, 5000));

// // const messageResult = await generateFriendlyMessage(userLanguage, userName);

// //     const insights = {
// //       healthTips: tipsResult.success ? tipsResult.tips : [],
// //       friendlyMessage: messageResult.success ? messageResult.message : '',
// //       language: userLanguage,
// //       generatedAt: new Date().toISOString()}; 
// //     res.status(200).json({
// //       success: true,
// //       insights
// //     });
// //   } catch (error) {
// //     console.error('Get AI insights error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error generating AI insights',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });}};



// const getAIInsights = async (req, res) => {
//   const userLanguage = req.user.language || "en";
//   const today = new Date().toISOString().slice(0, 10);

//   const tips = await Tips.findOne({ date: today, language: userLanguage });

//   res.json({
//     success: true,
//     insights: {
//       healthTips: tips?.tips || [],







const { generateHealthTips, generateFriendlyMessage } = require('../utils/gemini');
const Tips = require('../models/Tips');

const DEFAULT_TIPS = {
  en: [
    "Drink enough water today",
    "Take a short walk",
    "Eat fresh fruits",
    "Sleep well",
    "Reduce stress"
  ],
  ur: [
    "Rozana pani zyada piyen",
    "Thori walk zaroor karein",
    "Fresh phal khayein",
    "Poori neend lein",
    "Stress kam rakhein"
  ]
};

const getHealthTips = async (req, res) => {
  try {
    const userLanguage = req.user?.language || "en";
    const today = new Date().toISOString().slice(0, 10);

    const cached = await Tips.findOne({ date: today, language: userLanguage });
    if (cached) {
      return res.json({ success: true, tips: cached.tips });
    }

    const result = await generateHealthTips(userLanguage);

    const tips = result.success
      ? result.tips
      : DEFAULT_TIPS[userLanguage] || DEFAULT_TIPS.en;

    await Tips.create({
      date: today,
      language: userLanguage,
      tips
    });

    res.json({ success: true, tips });

  } catch (error) {
    console.error("Health tips error:", error);
    res.status(500).json({ success: false, message: "Tips error" });
  }
};

const getFriendlyMessage = async (req, res) => {
  try {
    const language = req.user?.language || "en";
    const name = req.user?.name || "User";

    const result = await generateFriendlyMessage(language, name);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("Friendly message error:", error);
    res.json({
      success: true,
      message: "Stay healthy! 🌱"
    });
  }
};

const getAIInsights = async (req, res) => {
  try {
    const userLanguage = req.user?.language || "en";
    const today = new Date().toISOString().slice(0, 10);

    const tips = await Tips.findOne({ date: today, language: userLanguage });

    res.json({
      success: true,
      insights: {
        healthTips: tips?.tips || [],
        friendlyMessage: "",
        language: userLanguage
      }
    });
  } catch (error) {
    console.error("AI insights error:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = { getHealthTips, getFriendlyMessage, getAIInsights };
