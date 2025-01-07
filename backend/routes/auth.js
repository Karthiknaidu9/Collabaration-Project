const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Joi = require("joi");

const router = express.Router();

const usernameSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/) 
    .min(4)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "Username should only contain letters and single spaces between words.",
      "string.min": "Username must be at least 4 characters long.",
      "string.max": "Username must be less than 30 characters.",
    }),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: true } }) // Validates proper email format
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
    }),
});

const passwordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(22)
    .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must be less than 22 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, and one special character.",
    }),
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username);

    const { error: usernameerror } = usernameSchema.validate({
      username: username,
    });
    const { error: emailerror } = emailSchema.validate({ email: email });
    const { error: passworderror } = passwordSchema.validate({
      password: password,
    });

    if (usernameerror) {
      return res.status(400).json({ error: usernameerror.details[0].message });
    }

    if (emailerror) {
      return res.status(400).json({ error: emailerror.details[0].message });
    }

    if (passworderror) {
      return res.status(400).json({ error: passworderror.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user", err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error: emailerror } = emailSchema.validate({ email: email });
    const { error: passworderror } = passwordSchema.validate({
      password: password,
    });
    if (emailerror) {
      return res.status(400).json({ error: emailerror.details[0].message });
    }

    if (passworderror) {
      return res.status(400).json({ error: passworderror.details[0].message });
    }
    //console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email,  joinDate: user.joinDate},
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error logging in", err });
  }
});

module.exports = router;
