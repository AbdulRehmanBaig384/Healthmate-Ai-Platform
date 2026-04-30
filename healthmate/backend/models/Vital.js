const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  
  type: {
    type:String,
    enum:['blood_pressure', 'blood_sugar', 'weight', 'heart_rate', 'temperature', 'oxygen_saturation'],
    required:true
  },
  
  value: {
    systolic: Number, 
    diastolic: Number,
    reading: Number, 
    unit: String
  },
  
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  time: {
    type: String, 
    default: 'morning'
  },
  notes: String,
  isNormal: {
    type: Boolean,
    default: true
  },
  severity: {
    type: String,
    enum: ['normal', 'low', 'high', 'critical'],
    default: 'normal'
  }
}, {
  timestamps: true
});
vitalSchema.index({ user: 1, date: -1 });
vitalSchema.index({ user: 1, type: 1, date: -1 });
vitalSchema.virtual('formattedValue').get(function() {
  if (this.type === 'blood_pressure') {
    return `${this.value.systolic}/${this.value.diastolic} ${this.value.unit}`;
  }
  return `${this.value.reading} ${this.value.unit}`;
});

module.exports = mongoose.model('Vital', vitalSchema);
