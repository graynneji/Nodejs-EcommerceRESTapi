const router = require("express").Router();
const User = require("../models/userModel");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials");

    const hashedpassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const mainPassword = hashedpassword.toString(CryptoJs.enc.Utf8);
    mainPassword !== req.body.password && res.status.json("Wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
