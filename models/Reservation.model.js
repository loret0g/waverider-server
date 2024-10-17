const mongoose = require("mongoose")

const reservationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jetSki: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JetSki",
    required: true,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }

}, { timestamps: true })



const Reservation = mongoose.model("Reservation", reservationSchema)

module.exports = Reservation