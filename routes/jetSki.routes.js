const router = require("express").Router()

const JetSki = require("../models/JetSki.model")

// GET api/jet-ski
router.get("/", async(req, res, next) => {

  try {
    const response = await JetSki.find()
    res.status(200).json(response)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

// GET api/jet-ski/:jetSkiId
router.get("/:jetSkiId", async(req, res, next) => {
  try {
    const response = await JetSki.findById(req.params.jetSkiId).populate("owner", "username")
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


module.exports = router