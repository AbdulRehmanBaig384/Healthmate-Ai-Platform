const {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold}=require("@google/generative-ai");
const {waitForQuota,checkAndIncrementQuota}=require("./rateLimiter");

// Initialize Gemini
const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const BASE_MODEL="gemini-pro";
const modelConfig={
  model:BASE_MODEL,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.2,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  ],
};
const analyzeMedicalReport = async (extractTextFromImage, fileType, reportType, userId) => {
  try {
    if (!extractTextFromImage || extractTextFromImage.length < 10) {
      throw new Error("Extracted text is too short or empty.");
    }
    const processedText = extractTextFromImage.slice(0, 15000);
    const prompt=`You are a Medical Report Analyzer AI.
    TASK:
1. Check if the text is a medical report.
2. If valid, analyze and summarize.

INPUT:${processedText}

OUTPUT (JSON ONLY):

If NOT medical:
{
  "isMedical": false,
  "reason": "Reason"
}

If medical:
{
  "isMedical": true,
  "analysis": {
    "summary": {
      "english": "Simple English summary",
      "urdu": "Roman Urdu summary"
    },
    "abnormalValues": [],
    "doctorQuestions": [],
    "dietSuggestions": [],
    "homeRemedies": [],
    "confidence": 90
  }
}
`;

    await checkAndIncrementQuota(userId);
    await waitForQuota(userId);

    const model=genAI.getGenerativeModel(modelConfig);
    const result=await model.generateContent(prompt);

    const text=result.response.text();

    try{
      return{success:true,analysis:JSON.parse(text)};
    } catch{
      return{
        success: true,
        analysis: {
          isMedical:true,
          analysis:{
            summary:{
              english:"Analysis completed but formatting issue occurred.",
              urdu: "Analysis mukammal hui lekin format issue aya."
            },
            abnormalValues: [],
            doctorQuestions: [],
            dietSuggestions: [],
            homeRemedies: [],
            confidence: 50
          }
        }
      };
    }

}catch(error){
    console.error("Gemini Analysis Error:", error.message);
    return { success: false, error: error.message };
  }
};
const generateHealthTips = async (userLanguage = "en") => {
  try {
    await waitForQuota();

    const model = genAI.getGenerativeModel(modelConfig);

    const prompt = `
Generate 5 daily health tips.
Language: ${userLanguage === "ur" ? "Roman Urdu" : "English"}
Return ONLY JSON array.
`;

    const result = await model.generateContent(prompt);
    return { success: true, tips: JSON.parse(result.response.text()) };

  } catch {
    return {
      success: true,
      tips: userLanguage === "ur"
        ? ["Pani zyada piyen", "Walk karein", "Sabzi khayein"]
        : ["Drink water", "Walk daily", "Eat vegetables"]
    };
  }
};

const generateFriendlyMessage = async (userLanguage = "en", userName = "User") => {
  try {
    await waitForQuota();

    const model = genAI.getGenerativeModel({ model: BASE_MODEL });

    const prompt = `
Generate 1 friendly health message.
Name: ${userName}
Language: ${userLanguage === "ur" ? "Roman Urdu" : "English"}
`;

    const result = await model.generateContent(prompt);
    return { success: true, message: result.response.text().trim() };

  } catch {
    return { success: true, message: `Welcome back, ${userName}! Stay healthy.` };
  }
};
const aiDoctorChat = async (messages, language = "en", userId) => {
  try {
    await checkAndIncrementQuota(userId);
    await waitForQuota(userId);

    const model = genAI.getGenerativeModel({ model: BASE_MODEL });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.message || m.content }]
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are Dr. AI. Educational only. No diagnosis. Language: ${language === "ur" ? "Roman Urdu" : "English"}` }]
        },
        { role: "model", parts: [{ text: "Understood." }] },
        ...history
      ]
    });

    const lastMessage = messages[messages.length - 1].message || messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);

    return { success: true, reply: result.response.text() };

  } catch (error) {
    console.error("Doctor Chat Error:", error.message);
    return { success: false, error: "Service temporarily unavailable." };
  }
};

module.exports = {analyzeMedicalReport,generateHealthTips, generateFriendlyMessage,aiDoctorChat};
