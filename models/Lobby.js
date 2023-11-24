const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LobbySchema = new Schema({
  creator: { type: String, required: true },
  lobbyName: { type: String, required: true, unique: true },
  players: { type: Array, default: [] },
  password: { type: String, required: true },
});

const LobbyModel = model("Lobby", LobbySchema);

module.exports = LobbyModel;
