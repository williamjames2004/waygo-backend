const Counter = require("../models/Counter");

async function generateId(key, prefix, digits) {
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  const number = String(counter.sequence).padStart(digits, "0");

  return `${prefix}${number}`;
}

module.exports = generateId;