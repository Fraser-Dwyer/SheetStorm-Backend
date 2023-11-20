const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Score = require("./models/Score");
const Lobby = require("./models/Lobby");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const salt = bcrypt.genSaltSync(10);
const secret = "sdkjfbn239rdskb2398ds";

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://testUser:testUser123@cluster0.ksotpfo.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: "Error going on here" });
  }
});

app.post("/create-lobby", async (req, res) => {
  const { username: creator, lobbyName, password } = req.body;
  try {
    const lobbyDoc = await Lobby.create({
      creator,
      lobbyName,
      players: [creator],
      password,
    });
    res.json(lobbyDoc);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: "Error going on here" });
  }
});

app.post("/make-scores", async (req, res) => {
  const { username, weekStart } = req.body;
  try {
    const scoreDoc = await Score.create({
      username,
      weekStart,
      Mon: "-",
      Tue: "-",
      Wed: "-",
      Thu: "-",
      Fri: "-",
      Sat: "-",
      Sun: "-",
    });
    res.json(scoreDoc);
  } catch (e) {
    console.log(e);
    return res.status(400).json();
  }
});

app.get("/check-lobby", async (req, res) => {
  const lobbies = await Lobby.find();
  res.json(lobbies);
});

app.get("/check-user", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passwordOk = bcrypt.compareSync(password, userDoc.password);
  if (passwordOk) {
    // User is logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        name: userDoc.name,
        id: userDoc._id,
        username: userDoc.username,
      });
    });
  } else {
    res.status(400).json("Invalid login");
  }
});

app.get("/get-scores", async (req, res) => {
  const scores = await Score.find();
  res.json(scores);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post-score", async (req, res) => {
  const { username, weekStart, score, todayDay } = req.body;
  const query = {
    username: username,
    weekStart: weekStart,
  };

  var updateDoc;
  if (todayDay === "Mon") {
    updateDoc = { $set: { Mon: score } };
  } else if (todayDay === "Tue") {
    updateDoc = { $set: { Tue: score } };
  } else if (todayDay === "Wed") {
    updateDoc = { $set: { Wed: score } };
  } else if (todayDay === "Thu") {
    updateDoc = { $set: { Thu: score } };
  } else if (todayDay === "Fri") {
    updateDoc = { $set: { Fri: score } };
  } else if (todayDay === "Sat") {
    updateDoc = { $set: { Sat: score } };
  } else {
    updateDoc = { $set: { Sun: score } };
  }

  const options = { upsert: true };
  try {
    const scoreDoc = await Score.updateOne(query, updateDoc, options);
    res.json(scoreDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.listen(4000);
