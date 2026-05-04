const Vital = require('../models/Vital');
const addVital= async(req,res)=>{
  try{
    const {type,value,date,time,notes}=req.body;
    const userId = req.user.id;
    if (!type || !value) {
      return res.status(400).json({
        success:false,
        message:'Vital type and value are required'
      });
    }
    const {isNormal,severity}=determineVitalStatus(type, value);
    const vital = await Vital.create({
      user: userId,
      type,
      value,
      date:date?new Date(date):new Date(),
      time:time||'morning',
      notes,isNormal,severity
    });
    res.status(201).json({
      success:true,
      message:'Vital reading added successfully',
      vital
    });
  } catch (error) {
    console.error('Add vital error:', error);
    res.status(500).json({
      success:false,
      message:'Error adding vital reading',
      error:process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }};
const getVitals = async (req, res) => {
  try{
    const userId = req.user.id;
    const {type,page=1,limit=20,startDate,endDate}=req.query;

    const query ={user:userId};
    if(type){
      query.type = type;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const skip = (page - 1) * limit;

    // Get vitals with pagination
    const vitals = await Vital.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Vital.countDocuments(query);
    res.status(200).json({
      success: true,
      count: vitals.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      vitals
    });
  } catch (error) {
    console.error('Get vitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vitals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const getVital = async (req, res) => {
  try {
    const vitalId = req.params.id;
    const userId = req.user.id;

    const vital = await Vital.findOne({
      _id: vitalId,
      user: userId
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital reading not found'
      });
    }

    res.status(200).json({
      success: true,
      vital
    });
  } catch (error) {
    console.error('Get vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vital reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateVital = async (req, res) => {
  try {
    const vitalId = req.params.id;
    const userId = req.user.id;
    const { type, value, date, time, notes } = req.body;

    const vital = await Vital.findOne({
      _id: vitalId,
      user: userId
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital reading not found'
      });
    }

    // Update fields
    if (type) vital.type = type;
    if (value) vital.value = value;
    if (date) vital.date = new Date(date);
    if (time) vital.time = time;
    if (notes !== undefined) vital.notes = notes;

    // Recalculate status if type or value changed
    if (type || value) {
      const { isNormal, severity } = determineVitalStatus(vital.type, vital.value);
      vital.isNormal = isNormal;
      vital.severity = severity;
    }

    await vital.save();

    res.status(200).json({
      success: true,
      message: 'Vital reading updated successfully',
      vital
    });
  } catch (error) {
    console.error('Update vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vital reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteVital = async (req, res) => {
  try {
    const vitalId = req.params.id;
    const userId = req.user.id;

    const vital = await Vital.findOneAndDelete({
      _id: vitalId,
      user: userId
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital reading not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vital reading deleted successfully'
    });
  } catch (error) {
    console.error('Delete vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vital reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const getVitalsSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get vitals for the specified period
    const vitals = await Vital.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Group by type and calculate statistics
    const summary = {};
    const vitalTypes = ['blood_pressure', 'blood_sugar', 'weight', 'heart_rate', 'temperature', 'oxygen_saturation'];

    vitalTypes.forEach(type => {
      const typeVitals = vitals.filter(v => v.type === type);
      if (typeVitals.length > 0) {
        summary[type] = {
          count: typeVitals.length,
          latest: typeVitals[0],
          average: calculateAverage(typeVitals, type),
          trend: calculateTrend(typeVitals, type),
          abnormalCount: typeVitals.filter(v => !v.isNormal).length
        };
      }
    });

    res.status(200).json({
      success: true,
      summary,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get vitals summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vitals summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }};
// Helper function to determine vital status
const determineVitalStatus = (type, value) => {
  let isNormal = true;
  let severity = 'normal';

  switch (type) {
    case 'blood_pressure':
      if (value.systolic < 90 || value.diastolic < 60) {
        isNormal = false;
        severity = 'low';
      } else if (value.systolic > 140 || value.diastolic > 90) {
        isNormal = false;
        severity = value.systolic > 180 || value.diastolic > 110 ? 'critical' : 'high';
      }
      break;
    case 'blood_sugar':
      if (value.reading < 70) {
        isNormal = false;
        severity = 'low';
      } else if (value.reading > 140) {
        isNormal = false;
        severity = value.reading > 200 ? 'critical' : 'high';
      }
      break;
    case 'heart_rate':
      if (value.reading < 60 || value.reading > 100) {
        isNormal = false;
        severity = value.reading < 40 || value.reading > 120 ? 'critical' : 'high';
      }
      break;

    case 'temperature':
      if (value.reading < 97 || value.reading > 99.5) {
        isNormal = false;
        severity = value.reading < 95 || value.reading > 102 ? 'critical' : 'high';
      }
      break;

    case 'oxygen_saturation':
      if (value.reading < 95) {
        isNormal = false;
        severity = value.reading < 90 ? 'critical' : 'low';
      }
      break;
  }

  return { isNormal, severity };
};

// Helper function to calculate average
const calculateAverage = (vitals, type) => {
  if (type === 'blood_pressure') {
    const systolicAvg = vitals.reduce((sum, v) => sum + v.value.systolic, 0) / vitals.length;
    const diastolicAvg = vitals.reduce((sum, v) => sum + v.value.diastolic, 0) / vitals.length;
    return { systolic: Math.round(systolicAvg), diastolic: Math.round(diastolicAvg) };
  }
  
  const avg = vitals.reduce((sum, v) => sum + v.value.reading, 0) / vitals.length;
  return Math.round(avg * 10) / 10;
};

// Helper function to calculate trend
const calculateTrend = (vitals, type) => {
  if (vitals.length < 2) return 'stable';
  
  const recent = vitals.slice(0, Math.min(3, vitals.length));
  const older = vitals.slice(-Math.min(3, vitals.length));
  let recentAvg, olderAvg;
  if (type === 'blood_pressure') {
    recentAvg = recent.reduce((sum, v) => sum + v.value.systolic, 0) / recent.length;
    olderAvg = older.reduce((sum, v) => sum + v.value.systolic, 0) / older.length;
  } else {
    recentAvg = recent.reduce((sum, v) => sum + v.value.reading, 0) / recent.length;
    olderAvg = older.reduce((sum, v) => sum + v.value.reading, 0) / older.length;
  }
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
};

module.exports = { addVital, getVitals, getVital, updateVital, deleteVital, getVitalsSummary};
