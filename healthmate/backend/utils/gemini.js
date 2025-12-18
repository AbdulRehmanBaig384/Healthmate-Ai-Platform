// const Groq = require('groq-sdk');
// const {waitForQuota, checkAndIncrementQuota}= require('./rateLimiter');
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

// const analyzeMedicalReport = async (extractTextFromImage, fileType, reportType, userId) => {
//   try {
//     // Limit text to 3000 characters to save tokens
//     const limitedText = extractTextFromImage.slice(0, 3000);

//     const prompt = `
// You are a strict medical document validator and analyzer AI.

// =======================
// STEP 1: VALIDATION
// =======================
// First, carefully check whether the uploaded document is a MEDICAL REPORT.

// A medical report includes:
// - Blood test reports
// - Lab test results
// - Radiology (X-ray, MRI, CT)
// - Prescriptions
// - Hospital discharge summaries
// - Medical checkup reports

// NOT medical documents include:
// - Exam result cards
// - Mark sheets
// - Certificates
// - Invoices
// - Any educational or non-health document

// If the document is NOT medical, respond with ONLY this JSON and NOTHING ELSE:

// {
//   "isMedical": false,
//   "reason": "Explain clearly why this document is not a medical report"
// }

// =======================
// STEP 2: ANALYSIS (ONLY IF MEDICAL)
// =======================
// If and ONLY IF the document is a medical report, analyze it and respond with ONLY this JSON:

// {
//   "isMedical": true,
//   "analysis": {
//     "summary": {
//       "english": "Simple English summary of the medical report",
//       "urdu": "Roman Urdu summary using English letters"
//     },
//     "abnormalValues": [
//       {
//         "parameter": "Test name",
//         "value": "Observed value",
//         "normalRange": "Normal range",
//         "severity": "normal | low | high | critical"
//       }
//     ],
//     "doctorQuestions": [
//       "Question a patient should ask the doctor"
//     ],
//     "dietSuggestions": [
//       "Safe dietary suggestion (foods to include or avoid)"
//     ],
//     "homeRemedies": [
//       "Safe home care or lifestyle tip"
//     ],
//     "confidence": 0
//   }
// }

// =======================
// IMPORTANT RULES
// =======================
// - Output ONLY valid JSON (no markdown, no explanations)
// - Do NOT diagnose diseases
// - Do NOT suggest medicines or dosages
// - Add educational-purpose disclaimer inside summaries
// - Use simple, patient-friendly language
// - Confidence score must be between 0–100
// - If no abnormal values exist, return an empty array
// - Roman Urdu must use English alphabets

// =======================
// DOCUMENT INFO
// =======================
// Report Type: ${reportType}
// File Type: ${fileType}
// Extracted Text: ${limitedText}
// `;

//     // Check and increment daily quota
//     await checkAndIncrementQuota(userId);

//     // Wait for rate limit
//     await waitForQuota(userId);

//     // Retry logic for rate limit errors
//     let result;
//     let retries = 3;
//     while (retries > 0) {
//       try {
//         result = await groq.chat.completions.create({
//          model: "llama-3.1-8b-instant",

//           messages: [
//             { role: "system", content: "You are a medical assistant." },
//             { role: "user", content: prompt }
//           ]
//         });
//         break; // Success, exit loop
//       } catch (error) {
//         if ((error.status === 429 || error.code === 'rate_limit_exceeded') && retries > 1) {
//           console.log(`Rate limit exceeded, retrying in 60 seconds... (${retries - 1} retries left)`);
//           await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
//           retries--;
//         } else {
//           throw error; // Re-throw if not rate limit or no retries left
//         }
//       }
//     }

//     const text = result.choices[0].message.content;
//     try {
//       const analysis = JSON.parse(text);
//       return {
//         success: true,
//         analysis: analysis
//       };
//     } catch (parseError) {
//       return {
//         success: true,
//         analysis: {
//           summary: {
//             english: text.substring(0, 500),
//             urdu: "AI analysis completed. Please consult your doctor for detailed interpretation."
//           },
//           abnormalValues: [],
//           doctorQuestions: ["Please consult your doctor for specific questions about this report."],
//           dietSuggestions: ["Maintain a balanced diet and consult your doctor for specific dietary recommendations."],
//           homeRemedies: ["Follow your doctor's advice and maintain a healthy lifestyle."],
//           confidence: 70
//         }
//       };
//     }
//   } catch (error) {
//     console.error('Groq AI Error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// const generateHealthTips = async (userLanguage = 'en') => {
//   try {
//     await waitForQuota();
//     const result = await groq.chat.completions.create({
//      model: "llama-3.1-8b-instant"
// ,
//       messages: [
//         { role: "system", content: "You are a helpful health assistant." },
//         { role: "user", content: `Generate 5 friendly health tips for today. Language: ${userLanguage === 'ur' ? 'Roman Urdu' : 'English'}. Make them practical and actionable. Format as JSON array: ["tip1", "tip2", "tip3", "tip4", "tip5"]` }
//       ]
//     });

//     const text = result.choices[0].message.content;
//     try {
//       const tips = JSON.parse(text);
//       return {
//         success: true,
//         tips: tips
//       };
//     } catch (parseError) {
//       return {
//         success: true,
//         tips: userLanguage === 'ur'
//           ? [
//               "Rozana 8 glass pani piyein",
//               "30 minutes walk karein",
//               "Fresh fruits aur vegetables khayein",
//               "7-8 hours ki neend lein",
//               "Stress se bachne ke liye meditation karein"
//             ]
//           : [
//               "Drink 8 glasses of water daily",
//               "Take a 30-minute walk",
//               "Eat fresh fruits and vegetables",
//               "Get 7-8 hours of sleep",
//               "Practice meditation to reduce stress"
//             ]
//       };
//     }
//   } catch (error) {
//     console.error('Health Tips Generation Error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// const generateFriendlyMessage = async (userLanguage = 'en', userName = 'User') => {
//   try {
//     await waitForQuota();
//     const result = await groq.chat.completions.create({
//      model: "llama-3.1-8b-instant"
// ,
//       messages: [
//         { role: "system", content: "You are a friendly health app assistant." },
//         { role: "user", content: `Generate a friendly, encouraging message for a health app user named ${userName}. Language: ${userLanguage === 'ur' ? 'Roman Urdu' : 'English'}. Make it warm, personal, health-focused, motivational, and short (1-2 sentences). Just return the message text.` }
//       ]
//     });

//     return {
//       success: true,
//       message: result.choices[0].message.content.trim()
//     };
//   } catch (error) {
//     console.error('Friendly Message Generation Error:', error);
//     return {
//       success: true,
//       message: userLanguage === 'ur'
//         ? `Assalam-o-Alaikum ${userName}! Aaj apna khayal rakhiye aur healthy rahiye! 🌟`
//         : `Hello ${userName}! Take care of yourself today and stay healthy! 🌟`
//     };
//   }
// };

// const aiDoctorChat = async (messages, language = 'en', userId) => {
//   try {
//     // Check and increment daily quota
//     await checkAndIncrementQuota(userId);

//     // Wait for rate limit
//     await waitForQuota(userId);

//     // Retry logic for rate limit errors
//     let result;
//     let retries = 3;
//     while (retries > 0) {
//       try {
//         result = await groq.chat.completions.create({
//           model: "llama-3.1-8b-instant"
// ,
//           messages: [
//             { role: "system", content: `You are an AI medical assistant (Doctor AI). IMPORTANT RULES: - Educational purpose only - Do NOT diagnose diseases - Do NOT prescribe medicines - Do NOT panic the user - Always suggest consulting a real doctor - Be calm, polite, and supportive - Language: ${language === 'ur' ? 'Roman Urdu' : 'English'}` },
//             ...messages.map(m => ({ role: m.role, content: m.message }))
//           ]
//         });
//         break; // Success, exit loop
//       } catch (error) {
//         if ((error.status === 429 || error.code === 'rate_limit_exceeded') && retries > 1) {
//           console.log(`Chat rate limit exceeded, retrying in 60 seconds... (${retries - 1} retries left)`);
//           await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
//           retries--;
//         } else {
//           throw error; // Re-throw if not rate limit or no retries left
//         }
//       }
//     }

//     return {
//       success: true,
//       reply: result.choices[0].message.content
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// module.exports = {analyzeMedicalReport, generateHealthTips, generateFriendlyMessage, aiDoctorChat};




// const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
// const { waitForQuota, checkAndIncrementQuota } = require('./rateLimiter');

// // Initialize Gemini
// // We use gemini-1.5-flash because it is currently the most stable, fast, and JSON-capable version.
// // If you specifically want 2.0, change model name to "gemini-2.0-flash-exp"
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // const modelConfig = {
// //   model: "gemini-1.5-flash", 
// //   generationConfig: {
// //     responseMimeType: "application/json", // Forces Gemini to return pure JSON
// //     temperature: 0.2, // Low temperature for factual analysis
// //   },

// const modelConfig = {
//   // ✅ FIX: Use "gemini-1.5-flash-latest" or "gemini-2.0-flash-exp"
//   model: "gemini-2.0-flash-latest", 
//   generationConfig: {
//     responseMimeType: "application/json",
//     temperature: 0.2,
//   },
//   // CRITICAL: Medical reports often trigger safety filters. We must relax them slightly for analysis.
//   safetySettings: [
//     { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
//     { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
//     { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
//     { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
//   ]
// };

// const analyzeMedicalReport = async (extractTextFromImage, fileType, reportType, userId) => {
//   try {
//     // 1. Validate Input
//     if (!extractTextFromImage || extractTextFromImage.length < 10) {
//         throw new Error("Extracted text is too short or empty.");
//     }

//     // Limit text to ~10,000 chars (Gemini Flash has a huge context window, 3000 is too low)
//     const processedText = extractTextFromImage.slice(0, 15000);

//     const prompt = `
//       You are a specialized Medical Report Analyzer.
      
//       TASK:
//       1. Analyze the provided text from a "${reportType}" (${fileType}).
//       2. Determine if it is a valid medical report.
//       3. If valid, extract key details, abnormal values, and provide a summary.

//       INPUT TEXT:
//       ${processedText}

//       OUTPUT FORMAT (JSON ONLY):
//       If NOT a medical report:
//       {
//         "isMedical": false,
//         "reason": "Reason why"
//       }

//       If IS a medical report:
//       {
//         "isMedical": true,
//         "analysis": {
//           "summary": {
//             "english": "2-3 sentence summary in simple English",
//             "urdu": "2-3 sentence summary in Roman Urdu"
//           },
//           "abnormalValues": [
//             {
//               "parameter": "Test Name",
//               "value": "Result Value",
//               "normalRange": "Ref Range",
//               "severity": "high | low | critical"
//             }
//           ],
//           "doctorQuestions": ["Question 1", "Question 2"],
//           "dietSuggestions": ["Tip 1", "Tip 2"],
//           "homeRemedies": ["Tip 1", "Tip 2"],
//           "confidence": 90
//         }
//       }
//     `;

//     // Check Quota
//     await checkAndIncrementQuota(userId);
//     await waitForQuota(userId);

//     // Get Model
//     const model = genAI.getGenerativeModel(modelConfig);

//     // Generate
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     // Parse JSON
//     try {
//       const analysis = JSON.parse(text);
//       return { success: true, analysis: analysis };
//     } catch (parseError) {
//       console.error("JSON Parse Error:", parseError);
//       // Fallback if JSON is malformed
//       return {
//         success: true,
//         analysis: {
//           summary: { english: "Analysis processed but formatting failed.", urdu: "Analysis complete." },
//           abnormalValues: [],
//           doctorQuestions: ["Consult doctor"],
//           dietSuggestions: [],
//           homeRemedies: [],
//           confidence: 50
//         }
//       };
//     }

//   } catch (error) {
//     console.error('Gemini Analysis Error:', error);
//     return { success: false, error: error.message };
//   }
// };

// const generateHealthTips = async (userLanguage = 'en') => {
//   try {
//     await waitForQuota();
    
//     const model = genAI.getGenerativeModel(modelConfig);
//     const prompt = `Generate 5 practical, actionable health tips for today.
//     Language: ${userLanguage === 'ur' ? 'Roman Urdu' : 'English'}.
//     Format: Return ONLY a JSON Array of strings. Example: ["tip1", "tip2"]`;

//     const result = await model.generateContent(prompt);
//     const tips = JSON.parse(result.response.text());

//     return { success: true, tips: tips };

//   } catch (error) {
//     console.error('Health Tips Error:', error);
//     // Fallback
//     return {
//       success: true,
//       tips: userLanguage === 'ur' 
//         ? ["Pani ziyada piyein", "Rozana walk karein", "Sabziyan khayein"] 
//         : ["Drink water", "Walk daily", "Eat vegetables"]
//     };
//   }
// };

// const generateFriendlyMessage = async (userLanguage = 'en', userName = 'User') => {
//   try {
//     await waitForQuota();
    
//     // For simple text, we don't force JSON mimeType
//     const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
//     const prompt = `Generate a short (1 sentence), warm, motivational health message for user "${userName}". 
//     Language: ${userLanguage === 'ur' ? 'Roman Urdu' : 'English'}.
//     No emojis in text, just the sentence.`;

//     const result = await textModel.generateContent(prompt);
//     return { success: true, message: result.response.text().trim() };

//   } catch (error) {
//     return {
//       success: true,
//       message: `Welcome back, ${userName}! Stay healthy!`
//     };
//   }
// };

// const aiDoctorChat = async (messages, language = 'en', userId) => {
//   try {
//     await checkAndIncrementQuota(userId);
//     await waitForQuota(userId);

//     const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Transform messages to Gemini Format
//     // OpenAI uses: { role: 'user', content: '...' }
//     // Gemini uses: { role: 'user', parts: [{ text: '...' }] }
//     const history = messages.slice(0, -1).map(msg => ({
//       role: msg.role === 'assistant' ? 'model' : 'user',
//       parts: [{ text: msg.message || msg.content }]
//     }));

//     const lastMessage = messages[messages.length - 1].message || messages[messages.length - 1].content;

//     const chat = chatModel.startChat({
//       history: [
//         {
//           role: "user",
//           parts: [{ text: `System Instruction: You are Dr. AI, a helpful medical assistant. 
//           Rules:
//           1. Educational purpose only.
//           2. NEVER diagnose or prescribe meds.
//           3. If symptoms seem serious, tell them to see a real doctor immediately.
//           4. Language: ${language === 'ur' ? 'Roman Urdu' : 'English'}` }]
//         },
//         {
//           role: "model",
//           parts: [{ text: "Understood. I am ready to help as Dr. AI." }]
//         },
//         ...history
//       ]
//     });

//     const result = await chat.sendMessage(lastMessage);
//     return { success: true, reply: result.response.text() };

//   } catch (error) {
//     console.error("Chat Error", error);
//     return { success: false, error: "I am having trouble connecting right now." };
//   }
// };

// module.exports = { analyzeMedicalReport, generateHealthTips, generateFriendlyMessage, aiDoctorChat };


const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const { waitForQuota, checkAndIncrementQuota } = require("./rateLimiter");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 🔒 SINGLE SOURCE OF TRUTH FOR MODEL
 * Never use "-latest" or "2.0" with this SDK
 */
const BASE_MODEL = "gemini-pro";


const modelConfig = {
  model: BASE_MODEL,
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

/* ======================================================
   MEDICAL REPORT ANALYSIS
====================================================== */
const analyzeMedicalReport = async (extractTextFromImage, fileType, reportType, userId) => {
  try {
    if (!extractTextFromImage || extractTextFromImage.length < 10) {
      throw new Error("Extracted text is too short or empty.");
    }

    const processedText = extractTextFromImage.slice(0, 15000);

    const prompt = `
You are a Medical Report Analyzer AI.

TASK:
1. Check if the text is a medical report.
2. If valid, analyze and summarize.

INPUT:
${processedText}

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

    const model = genAI.getGenerativeModel(modelConfig);
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    try {
      return { success: true, analysis: JSON.parse(text) };
    } catch {
      return {
        success: true,
        analysis: {
          isMedical: true,
          analysis: {
            summary: {
              english: "Analysis completed but formatting issue occurred.",
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

  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    return { success: false, error: error.message };
  }
};

/* ======================================================
   DAILY HEALTH TIPS
====================================================== */
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

/* ======================================================
   FRIENDLY MESSAGE
====================================================== */
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

/* ======================================================
   AI DOCTOR CHAT
====================================================== */
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

module.exports = {
  analyzeMedicalReport,
  generateHealthTips,
  generateFriendlyMessage,
  aiDoctorChat
};
