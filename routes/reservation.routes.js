const router = require("express").Router()

const User = require("../models/User.model")
const JetSki = require("../models/JetSki.model")
const Reservation = require("../models/Reservation.model")

const { verifyToken, verifyOwner, verifyJetSkiOwner } = require("../middleware/auth.middleware")


// POST /api/reservation/:jetSkiId
router.post("/:jetSkiId", verifyToken, async(req, res, next) => {
  console.log(req.body)
  const { reservationDate } = req.body
  const { jetSkiId } = req.params

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

// GET api/reservation/:reservationId



module.exports = router