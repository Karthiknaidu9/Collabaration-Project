const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middleware/authMiddleware");


router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      joinDate: user.joinDate,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

module.exports = router;
