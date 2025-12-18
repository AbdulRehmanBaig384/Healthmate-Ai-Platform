const { aiDoctorChat } = require("../utils/gemini");
const AIChat = require("../models/AiChat");

const chatWithDoctor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;
    const language = req.user.language || "en";
    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message required" });}
    await AIChat.create({
      user: userId,
      role: "user",
      message,
    });
    const history = await AIChat.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    const formatted = history.reverse();
    const aiResult = await aiDoctorChat(formatted, language, userId);
    if (!aiResult.success) {
      return res.status(500).json({ success: false, message: "AI failed" });
    }
    await AIChat.create({
      user: userId,
      role: "assistant",
      message: aiResult.reply,
    });
    res.status(200).json({
      success: true,
      reply: aiResult.reply,
    });
  } catch (error) {
    console.error(error);
    let errorMessage = "Chat error";
    let statusCode = 500;

    if (error.message.includes("quota exceeded")) {
      errorMessage = "Daily AI usage limit reached. Please try again tomorrow.";
      statusCode = 429;
    }

    res.status(statusCode).json({ success: false, message: errorMessage });
  }
};
module.exports = { chatWithDoctor };
