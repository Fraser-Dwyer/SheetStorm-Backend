const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ScoreSchema = new Schema({
  username: { type: String },
  date: { type: Date },
  score: { type: Number },
});

const ScoreModel = model("Score", ScoreSchema);

module.exports = ScoreModel;
