const {model}=require("./client");
const aiDoctorReply=async(messages,language="en") => {
  try {
    const prompt = `You are a safe AI medical assistant.
Rules:
- Educational purpose only
- No diagnosis
- No medicine names
- Always suggest consulting a doctor
- Be calm and supportive
- Language: ${language === "ur" ? "Roman Urdu" : "English"}

Conversation:
${messages.map((m) => `${m.role}: ${m.message}`).join("\n")}
`;
    const result = await model.generateContent(prompt);
    return {
      success: true,
      reply: result.response.text(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { aiDoctorReply };
