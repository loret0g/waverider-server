const router = require("express").Router();

const User = require("../models/User.model");
const { verifyToken } = require("../middleware/auth.middleware");

// GET api/profile/:userId
router.get("/:userId", verifyToken, async(req, res, next) => {

  try {
    const response = await User.findById(req.params.userId)
    res.status(200).json(response)
    console.log(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router