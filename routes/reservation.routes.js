const router = require("express").Router()

// const User = require("../models/User.model")
const JetSki = require("../models/JetSki.model")
const Reservation = require("../models/Reservation.model")

const { verifyToken, verifyUserIdentity } = require("../middleware/auth.middleware")

// POST /api/reservation/:jetSkiId
router.post("/:jetSkiId", verifyToken, async(req, res, next) => {
  const { jetSkiId } = req.params
  const { reservationDate } = req.body

  try {
    // Convierto la fecha recibida y elimino la hora
    const selectedDate = new Date(reservationDate)
    selectedDate.setUTCHours(0, 0, 0, 0)

    // Comprobación si la moto ya está reservada en la fecha elegida
    const existingReservation = await Reservation.findOne({
      jetSki: jetSkiId,
      reservationDate: {
        $gte: selectedDate,
        $lt: new Date(selectedDate).setDate(selectedDate.getDate() + 1)  // Comparamos el día entero
      }
    })

    if (existingReservation) {
      return res.status(400).json({ message: "La moto ya está reservada para esta fecha" });
    }

    // Si está disponible, se realiza reserva
    const jetSki = await JetSki.findById(jetSkiId)

    const response = await Reservation.create({
      user: req.payload._id,
      jetSki: jetSkiId,
      owner: jetSki.owner,
      reservationDate: selectedDate,
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