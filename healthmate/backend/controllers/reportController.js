const Report = require("../models/Report");
const { analyzeMedicalReport } = require("../utils/gemini");
const uploadReport = async (req, res) => {
  try {
    const { title, type, reportDate } = req.body;
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const report = await Report.create({
      user: userId,
      title,
      type,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      reportDate: new Date(reportDate),
      isAnalyzed: false,
      aiAnalysis: null,
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
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }
    if (report.isAnalyzed) {
      return res.status(400).json({
        success: false,
        message: "Report already analyzed",
      });
    }
    const result = await analyzeMedicalReport(
      report.fileUrl,
      report.fileType,
      report.type
    );
    if (!result.isMedical) {
      return res.status(400).json({
        success: false,
        message: "Not a medical report",
        reason: result.reason,
      });
    }
    report.aiAnalysis = result.analysis;
    report.isAnalyzed = true;
    await report.save();

    res.status(200).json({
      success: true,
      message: "Medical report analyzed successfully",
      report,
    });
  } catch (error) {
    console.error("Re-analyze error:", error);
    res.status(500).json({
      success: false,
      message: "AI analysis failed",
    });
  }
};

module.exports = {uploadReport,getReports,getReport,updateReport,deleteReport,reanalyzeReport,};
