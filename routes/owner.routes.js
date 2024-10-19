const router = require("express").Router()

const User = require("../models/User.model")
const JetSki = require("../models/JetSki.model")
const { verifyToken, verifyOwner, verifyJetSkiOwner } = require("../middleware/auth.middleware")

// Ruta para que los usuarios registrados puedan ver el perfil de un propietario en específico:
// GET api/owner/:ownerId
router.get("/:ownerId", verifyToken, async(req, res, next) => {
  try {
    const owner = await User.findById(req.params.ownerId).select('-password')
    const jetSkis = await JetSki.find({ owner: req.params.ownerId })

    res.status(200).json({ owner, jetSkis })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// GET api/owner/jet-ski/
router.get("/jet-ski", verifyToken, verifyOwner, async(req, res, next) => {
  try {
    const response = await JetSki.find({owner: req.payload._id})
    res.status(200).json(response)
    // res.json("si tuvieras una moto, la verías")
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// POST api/owner/jet-ski/
router.post("/jet-ski", verifyToken, verifyOwner, async(req, res, next) => {

  const { name, description, price, images } = req.body

  // Validación de los campos requeridos
  if (!name || !description || !price || !images || images.length === 0) {
    return res.status(400).json({ message: "Todos los campos son obligatorios, incluida al menos una imagen." })
  }

  // Validación del precio
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "El precio debe ser mayor a 0." })
  }

  try {
    const response = await JetSki.create({
      name,
      description,
      price,
      images,
      owner: req.payload._id,
    })

    // Lo añado al array de motos del usuario
    await User.findByIdAndUpdate(req.payload._id, {   
      $push: { jetSkis: response._id },
    });

    res.status(201).json(response)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

// PUT api/owner/jet-ski/:jetSkiId
router.put("/jet-ski/:jetSkiId", verifyToken, verifyOwner, verifyJetSkiOwner, async(req, res, next) => {
  const { name, description, price, images } = req.body

  // Validación de los campos requeridos
  if (!name || !description || !price || !images || images.length === 0) {
    return res.status(400).json({ message: "Todos los campos son obligatorios, incluida al menos una imagen." })
  }

  // Validación del precio
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "El precio debe ser mayor a 0." })
  }

  try {

    const response = await JetSki.findByIdAndUpdate( req.params.jetSkiId, { 
      name, 
      description, 
      price, 
      images
    }, { new: true })
    res.status(202).json(response)
    
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// DELETE api/owner/jet-ski/:jetSkiId
router.delete("/jet-ski/:jetSkiId", verifyToken, verifyOwner, verifyJetSkiOwner, async(req, res, next) => {

  try {
    await JetSki.findOneAndDelete(req.params.jetSkiId)

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
  
})

module.exports = router