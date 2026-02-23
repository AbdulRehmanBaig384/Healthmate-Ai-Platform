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
