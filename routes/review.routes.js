const router = require("express").Router()

const User = require("../models/User.model")
const Reservation = require('../models/Reservation.model')
const JetSki = require("../models/JetSki.model")
const Review = require("../models/Review.model")
const { verifyToken } = require("../middleware/auth.middleware")

// POST /api/review/:jetSkiId
router.post("/:jetSkiId", verifyToken, async (req, res, next) => {
  const { jetSkiId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.payload._id;

  try {
    // Verificar si hay una reserva para este usuario, con esa moto y que no haya puesto ya su valoración
    const reservation = await Reservation.findOne({
      user: userId,
      jetSki: jetSkiId,
      hasReviewed: false
    });

    if (!reservation) {
      return res.status(403).json({ message: "No tienes permiso para dejar una reseña." });
    }

    // Se crea la review y se modifica la propiedad, como que ya está realizada
    const newReview = await Review.create({
      rating,
      comment,
      user: userId,
      jetSki: jetSkiId
    });

    reservation.hasReviewed = true;
    await reservation.save();

    // Recalcular el promedio de las valoraciones
    const reviews = await Review.find({ jetSki: jetSkiId });
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRatings / reviews.length;

    // Actualizar el promedio
    await JetSki.findByIdAndUpdate(jetSkiId, { averageRating }, { new: true });


    res.status(201).json(newReview);

  } catch (error) {
    next(error);
  }
});

// GET /api/review/:jetSkiId
router.get("/:jetSkiId", async (req, res, next) => {
  const { jetSkiId } = req.params;

  try {
    const response = await Review.find({ jetSki: jetSkiId })
      .populate("user", "username")  // Obtener el username del usuario que hizo la reseña
      .sort({ reviewDate: -1 }); // Ordenar las reseñas por fecha (recientes primero)

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//* Verificar si tiene una reserva y si ya ha dejado una reseña
// GET api/review/:jetSkiId/:userId/
router.get("/:jetSkiId/:userId", verifyToken, async (req, res, next) => {
  const { jetSkiId, userId } = req.params;

  try {
    // Verificar si el usuario tiene una reserva
    const reservation = await Reservation.findOne({
      user: userId,
      jetSki: jetSkiId,
    });

    // Verificar si el usuario ya ha dejado una reseña
    const review = await Review.findOne({
      user: userId,
      jetSki: jetSkiId,
    });

    // Si tiene reserva y no ha dejado reseña, puede dejar una
    if (reservation && !review) {
      return res.status(200).json({ canLeaveReview: true });
    } else {
      return res.status(200).json({ canLeaveReview: false });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router