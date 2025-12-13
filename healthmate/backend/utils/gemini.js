const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const analyzeMedicalReport = async (fileUrl, fileType, reportType) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are a strict medical document validator and analyzer AI.

========================
STEP 1: VALIDATION
========================
First, carefully check whether the uploaded document is a MEDICAL REPORT.

A medical report includes:
- Blood test reports
- Lab test results
- Radiology (X-ray, MRI, CT)
- Prescriptions
- Hospital discharge summaries
- Medical checkup reports

NOT medical documents include:
- Exam result cards
- Mark sheets
- Certificates
- Invoices
- Any educational or non-health document

If the document is NOT medical, respond with ONLY this JSON and NOTHING ELSE:

{
  "isMedical": false,
  "reason": "Explain clearly why this document is not a medical report"
}

========================
STEP 2: ANALYSIS (ONLY IF MEDICAL)
========================
If and ONLY IF the document is a medical report, analyze it and respond with ONLY this JSON:

{
  "isMedical": true,
  "analysis": {
    "summary": {
      "english": "Simple English summary of the medical report",
      "urdu": "Roman Urdu summary using English letters"
    },
    "abnormalValues": [
      {
        "parameter": "Test name",
        "value": "Observed value",
        "normalRange": "Normal range",
        "severity": "normal | low | high | critical"
      }
    ],
    "doctorQuestions": [
      "Question a patient should ask the doctor"
    ],
    "dietSuggestions": [
      "Safe dietary suggestion (foods to include or avoid)"
    ],
    "homeRemedies": [
      "Safe home care or lifestyle tip"
    ],
    "confidence": 0
  }
}

========================
IMPORTANT RULES
========================
- Output ONLY valid JSON (no markdown, no explanations)
- Do NOT diagnose diseases
- Do NOT suggest medicines or dosages
- Add educational-purpose disclaimer inside summaries
- Use simple, patient-friendly language
- Confidence score must be between 0–100
- If no abnormal values exist, return an empty array
- Roman Urdu must use English alphabets

========================
DOCUMENT INFO
========================
Report Type: ${reportType}
File Type: ${fileType}
File URL: ${fileUrl}
`;
    const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [
        { text: prompt },
        {
          fileData: {
            mimeType: fileType,
            fileUri: fileUrl
          }
        }
      ]
    }
  ]
});

    const response = await result.response;
    const text = response.text();
    try {
      const analysis = JSON.parse(text);
      return {
        success: true,
        analysis: analysis
      };
    } catch (parseError) {
      return {
        success: true,
        analysis: {
          summary: {
            english: text.substring(0, 500),
            urdu: "AI analysis completed. Please consult your doctor for detailed interpretation."
          },
          abnormalValues: [],
          doctorQuestions: ["Please consult your doctor for specific questions about this report."],
          dietSuggestions: ["Maintain a balanced diet and consult your doctor for specific dietary recommendations."],
          homeRemedies: ["Follow your doctor's advice and maintain a healthy lifestyle."],
          confidence: 70
        }
      };
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
const generateHealthTips = async (userLanguage = 'en') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"  });
    const prompt = `
    Generate 5 friendly health tips for today.
    Language: ${userLanguage === 'ur' ? 'Roman Urdu' : 'English'}

    Make them:
    - Practical and actionable
    - Encouraging and positive
    - General wellness focused
    - Easy to understand

    Format as JSON array: ["tip1", "tip2", "tip3", "tip4", "tip5"]
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const tips = JSON.parse(text);
      return {
        success: true,
        tips: tips
      };
    } catch (parseError) {
      return {
        success: true,
        tips: userLanguage === 'ur'
          ? [
              "Rozana 8 glass pani piyein",
              "30 minutes walk karein",
              "Fresh fruits aur vegetables khayein",
              "7-8 hours ki neend lein",
              "Stress se bachne ke liye meditation karein"
            ]
          : [
              "Drink 8 glasses of water daily",
              "Take a 30-minute walk",
              "Eat fresh fruits and vegetables",
              "Get 7-8 hours of sleep",
              "Practice meditation to reduce stress"
            ]
      };
    }
  } catch (error) {
    console.error('Health Tips Generation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
const generateFriendlyMessage = async (userLanguage = 'en', userName = 'User') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"  });
    const prompt = `
    Generate a friendly, encouraging message for a health app user named ${userName}.
    Language: ${userLanguage === 'ur' ? 'Roman Urdu' : 'English'}

    Make it:
    - Warm and personal
    - Health-focused
    - Motivational
    - Short (1-2 sentences)

    Just return the message text, no JSON formatting.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return {
      success: true,
      message: text
    };
  } catch (error) {
    console.error('Friendly Message Generation Error:', error);
    return {
      success: true,
      message: userLanguage === 'ur'
        ? `Assalam-o-Alaikum ${userName}! Aaj apna khayal rakhiye aur healthy rahiye! 🌟`
        : `Hello ${userName}! Take care of yourself today and stay healthy! 🌟`
    };
  }
};
const aiDoctorChat = async (messages, language = 'en') => {
  try {
    const prompt = `
You are an AI medical assistant (Doctor AI).

IMPORTANT RULES:
- Educational purpose only
- Do NOT diagnose diseases
- Do NOT prescribe medicines
- Do NOT panic the user
- Always suggest consulting a real doctor
- Be calm, polite, and supportive
- Language: ${language === 'ur' ? 'Roman Urdu' : 'English'}

Conversation:
${messages.map(m => `${m.role}: ${m.message}`).join('\n')}
`;
    const result = await model.generateContent(prompt);
    return {
      success: true,
      reply: result.response.text()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
module.exports = {analyzeMedicalReport,generateHealthTips,generateFriendlyMessage,aiDoctorChat,
};
