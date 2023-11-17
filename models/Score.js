const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ScoreSchema = new Schema({
  username: { type: String },
  weekStart: { type: String },
  scoreObj: [
    new Schema(
      {
        day: String,
        sc: Number,
      },
      { _id: false }
    ),
  ],
});

const ScoreModel = model("Score", ScoreSchema);

module.exports = ScoreModel;
