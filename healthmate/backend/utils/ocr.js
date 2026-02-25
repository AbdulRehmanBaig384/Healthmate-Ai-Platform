const Tesseract = require("tesseract.js");
const fs = require('fs');
const https = require('https');
const pdfParse = require('pdf-parse');

const extractTextFromImage = async (fileUrl, fileType) => {
  try {
    console.log("text extraction started for:", fileUrl, "Type:", fileType);
    let text = "";
    if (fileType === 'application/pdf') {
      let pdfBuffer;
      if (fileUrl.startsWith('http')) {
        pdfBuffer = await downloadFile(fileUrl);
      } else {
        pdfBuffer = fs.readFileSync(fileUrl);
      }
      const data = await pdfParse(pdfBuffer);
      text = data.text;
    } else {
      const result = await Tesseract.recognize(
        fileUrl,
        "eng",
        {
          logger: m => {
            if (m.status === "recognizing text") {
              console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );
      text = result?.data?.text || "";
    }
    text = text.replace(/\s+/g, " ").trim();
    if (!text || text.length < 10) {
      console.warn("⚠ Text extraction returned very little text");
      return "Unable to clearly read the document. The text is unclear or file quality is low.";
    }

    console.log(" text extraction completed successfully");
    return text;
  } catch (error) {
    console.error("text extraction Error:", error.message);

    // Never crash backend
    return "Text extraction failed. The document text could not be extracted clearly.";
  }
};

const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
};

module.exports = { extractTextFromImage };
