const Report = require('../models/Report');
const { analyzeMedicalReport } = require('../utils/gemini');

// @desc    Upload and analyze medical report
// @route   POST /api/reports/upload
// @access  Private
const uploadReport = async (req, res) => {
  try {
    const { title, type, reportDate } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create report record
    const report = await Report.create({
      user: userId,
      title,
      type,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      reportDate: new Date(reportDate)
    });

    // Analyze report with Gemini AI
    const analysisResult = await analyzeMedicalReport(
      req.file.path,
      req.file.mimetype,
      type
    );

    if (analysisResult.success) {
      // Update report with AI analysis
      report.aiAnalysis = analysisResult.analysis;
      report.isAnalyzed = true;
      await report.save();
    }

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully',
      report: {
        id: report._id,
        title: report.title,
        type: report.type,
        fileUrl: report.fileUrl,
        reportDate: report.reportDate,
        isAnalyzed: report.isAnalyzed,
        aiAnalysis: report.aiAnalysis
      }
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: userId };
    if (type) {
      query.type = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reports with pagination
    const reports = await Report.find(query)
      .sort({ reportDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
const getReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;

    const report = await Report.findOne({
      _id: reportId,
      user: userId
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;
    const { title, notes, tags } = req.body;

    const report = await Report.findOneAndUpdate(
      { _id: reportId, user: userId },
      { title, notes, tags },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;

    const report = await Report.findOneAndDelete({
      _id: reportId,
      user: userId
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Re-analyze report
// @route   POST /api/reports/:id/analyze
// @access  Private
const reanalyzeReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;

    const report = await Report.findOne({
      _id: reportId,
      user: userId
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Re-analyze with Gemini AI
    const analysisResult = await analyzeMedicalReport(
      report.fileUrl,
      report.fileType,
      report.type
    );

    if (analysisResult.success) {
      report.aiAnalysis = analysisResult.analysis;
      report.isAnalyzed = true;
      await report.save();

      res.status(200).json({
        success: true,
        message: 'Report re-analyzed successfully',
        report
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error analyzing report',
        error: analysisResult.error
      });
    }
  } catch (error) {
    console.error('Re-analyze report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error re-analyzing report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {uploadReport, getReports, getReport,
  updateReport,
  deleteReport,
  reanalyzeReport
};
