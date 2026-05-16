const ApiUsage=require('../models/ApiUsage');
const DAILY_LIMIT=1000; 
module.exports.checkAndIncrementQuota = async (userId) => {
  const today=new Date().toISOString().split('T')[0];
  let usage = await ApiUsage.findOne({ user: userId, date: today });
  if (!usage) {
    usage = new ApiUsage({ user: userId, date: today, count: 0 });
  }
  if (usage.count >= DAILY_LIMIT) {
    throw new Error(`Daily quota exceeded. Limit: ${DAILY_LIMIT} calls per day.`);
  }
  usage.count += 1;
  await usage.save();
  return usage.count;
};
let userLastCallTimes=new Map(); 
module.exports.waitForQuota=async (userId, timeout = 30000) => {
  const now = Date.now();
  const lastTime = userLastCallTimes.get(userId) || 0;
  const MIN_DELAY = 10000;
  const waitTime = Math.max(0, MIN_DELAY - (now - lastTime));

  if (waitTime>0){
    await new Promise(res => setTimeout(res, waitTime));
  }
  userLastCallTimes.set(userId, Date.now());
};
