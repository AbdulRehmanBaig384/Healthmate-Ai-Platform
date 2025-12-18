const ApiUsage = require('../models/ApiUsage');

const DAILY_LIMIT = 1000; // 10 AI calls per day per user

module.exports.checkAndIncrementQuota = async (userId) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

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

// Keep the old waitForQuota for backward compatibility, but make it per user
let userLastCallTimes = new Map(); // in-memory, resets on restart

module.exports.waitForQuota = async (userId, timeout = 30000) => {
  const now = Date.now();
  const lastTime = userLastCallTimes.get(userId) || 0;
  const MIN_DELAY = 10000; // 10 seconds between calls per user
  const waitTime = Math.max(0, MIN_DELAY - (now - lastTime));

  if (waitTime > 0) {
    await new Promise(res => setTimeout(res, waitTime));
  }

  userLastCallTimes.set(userId, Date.now());
};
