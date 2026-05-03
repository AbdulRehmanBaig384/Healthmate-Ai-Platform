const Report = require("../models/Report");
const {analyzeMedicalReport} = require("../utils/gemini");
const { extractTextFromImage } = require("../utils/ocr");
const uploadReport = async (req, res) => {
  try {
    const { title, type, reportDate } = req.body;
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
      return  res.status(400).json({
        success:false,
        message:"No file uploaded",});
    }
    const report = await Report.create({
   user: userId,title,type,
   fileUrl: req.file.path,
   fileType: req.file.mimetype,
   fileSize: req.file.size,
   reportDate: new Date(reportDate),

   isAnalyzed: false,
   analysisStatus: "pending",
   aiAnalysis: null,
 });
     setImmediate(async () => {
       try {
         const dbReport = await Report.findById(report._id);
         if (!dbReport) return;

         dbReport.analysisStatus = "processing";
         
         dbReport.analysisError = null;
         
         await dbReport.save();

         const ocrText = await extractTextFromImage(dbReport.fileUrl, dbReport.fileType);
         
         dbReport.ocrText = ocrText;

         const result = await analyzeMedicalReport(ocrText, dbReport.fileType, dbReport.type, userId);

         if (!result.success) {
           dbReport.analysisStatus = "failed";
           dbReport.analysisError = result.error || "ai analysis failed";
           await dbReport.save();
           return;
         }

         if (result.analysis.isMedical === false) {
           dbReport.analysisStatus = "failed";
           dbReport.analysisError = result.analysis.reason || "Not a medical report";
           await dbReport.save();
           return;
         }

         dbReport.aiAnalysis = result.analysis.analysis;
         dbReport.isAnalyzed = true;
         dbReport.analysisStatus = "completed";
         dbReport.analyzedAt = new Date();
         await dbReport.save();

       } catch (error) {
         console.error("Background analysis error:", error);
         await Report.findByIdAndUpdate(report._id, {
           analysisStatus: "failed",
           analysisError: error.message.includes("quota") ? "Daily AI usage limit reached. Please try again tomorrow." : error.message,
         });
       }
     });

     res.status(201).json({
       success: true,
       message: "Report uploaded successfully",
       report,
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

const getReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .sort({ reportDate: -1 })
      .skip(skip)
      .limit(Math.min(parseInt(limit), 50));

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
    });
  }
};
const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching report",
    });
  }
};
const updateReport = async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report updated",
      report,
    });
    
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating report",
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting report",
    });
  }
};

const reanalyzeReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    report.analysisStatus = "processing";
    report.analysisError = null;
    await report.save();
    const ocrText = await extractTextFromImage(report.fileUrl, report.fileType);
    report.ocrText = ocrText;

    const result = await analyzeMedicalReport(
      ocrText,   
      report.fileType,
      report.type,
      userId
    );

    if (!result.analysis.isMedical) {
      report.analysisStatus = "failed";
      report.analysisError = result.analysis.reason || "Not a medical report";
      await report.save();

      return res.status(400).json({
        success: false,
        message: "Not a medical report",
      });
    }
    report.aiAnalysis = result.analysis.analysis;
    report.isAnalyzed = true;
    report.analysisStatus = "completed";
    report.analyzedAt = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      message: "Medical report analyzed successfully",
      report,
    });

  } catch (error) {
    console.error("Re-analyze error:", error);

    let errorMessage = "AI analysis failed";
    let statusCode = 500;

    if (error.message.includes("quota exceeded")) {
      errorMessage = "Daily AI usage limit reached. Please try again tomorrow.";
      statusCode = 429; 
    }
    await Report.findByIdAndUpdate(req.params.id, {
      analysisStatus: "failed",
      analysisError: errorMessage,
    });

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
module.exports = {uploadReport,getReports,getReport,updateReport,deleteReport,reanalyzeReport,};
