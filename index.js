const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://testUser:testUser123@cluster0.ksotpfo.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passwordOk = bcrypt.compareSync(password, userDoc.password);
  res.json(passwordOk);
});

app.listen(4000);
