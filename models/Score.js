const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ScoreSchema = new Schema({
  username: { type: String },
  weekStart: { type: String },
  Mon: { type: String },
  Tue: { type: String },
  Wed: { type: String },
  Thu: { type: String },
  Fri: { type: String },
  Sat: { type: String },
  Sun: { type: String },
});

const ScoreModel = model("Score", ScoreSchema);

module.exports = ScoreModel;
