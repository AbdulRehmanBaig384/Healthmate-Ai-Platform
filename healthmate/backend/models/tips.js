const mongoose = require('mongoose');

const tipsSchema=new mongoose.Schema(
  {
    date:{
      type:String, 
      required:true},
    
    language:{
      type:String,
      enum:['en','ur'],
      default:'en',
      required:true
    },
    tips: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);
tipsSchema.index({ date: 1, language: 1 }, { unique: true });
module.exports = mongoose.model('Tips', tipsSchema);
