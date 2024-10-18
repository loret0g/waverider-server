const router = require("express").Router()

// const User = require("../models/User.model")
const JetSki = require("../models/JetSki.model")
const Reservation = require("../models/Reservation.model")

const { verifyToken, verifyUserIdentity } = require("../middleware/auth.middleware")

// POST /api/reservation/:jetSkiId
router.post("/:jetSkiId", verifyToken, async(req, res, next) => {
  console.log(req.body)

  const { jetSkiId } = req.params
  const { reservationDate } = req.body

  try {
    const jetSki = await JetSki.findById(jetSkiId)

    const response = await Reservation.create({
      user: req.payload._id,
      jetSki: jetSkiId,
      owner: jetSki.owner,
      reservationDate,
      price: jetSki.price
    })
    res.status(201).json(response)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// GET api/reservation/:userId
router.get("/:userId", verifyToken, verifyUserIdentity, async(req, res, next) => {

  const userId = req.params.userId

  try {

    const response = await Reservation.find({
      $or: [{user: userId}, {owner: userId}]
    }).populate("jetSki").populate("user").populate("owner")
    // res.status(200).json("0 reservas")
    res.status(200).json(response)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router