const mongoose = require("mongoose");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/// create new  user instance
module.exports.createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  } = req.body;

  const user = new User({
    name: name,
    email: email,
    passwordHash: bcrypt.hashSync(password, 10),
    phone: phone,
    isAdmin: isAdmin,
    street: street,
    apartment: apartment,
    zip: zip,
    city: city,
    country: country,
  });

  const newUser = await user.save();

  if (!newUser) {
    return res.status(500).send("user cannot be created");
  }
  return res.status(200).send(newUser);
};

///users list
module.exports.usersList = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  if (!users) {
    return res.status(500).json({ message: "Users  was not found" });
  }
  return res.status(200).send(users);
};

///single user list
module.exports.singleUserList = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-passwordHash");
  if (!user) {
    return res.status(500).json({ message: "User was not found" });
  }
  return res.status(200).send(user);
};

///single user list
module.exports.userLogin = async (req, res) => {
  const secret = process.env.jwtSecret;

  const maxAge = 3 * 60 * 60;
  const { email, password } = req.body;

  const user = await User.findOne({ email:email });
  if (!user) {
    return res.status(500).json({ message: "User was not found" });
  }
  if (user && bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: maxAge * 1000*1000 }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send("Password is incorrect");
  }
};
//// user
module.exports.userCount = async (req, res) => {
  await User.countDocuments({})
    .then((userCount) => {
      if (!userCount) {
        return res.status(400).json({ success: false });
      } else {
        return res.status(200).send({
          success: true,
          userCount: userCount,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err.message });
    });
};
