const router = require("express").Router()

const User = require("../models/User.model")
const JetSki = require("../models/JetSki.model")
const { verifyToken, verifyOwner, verifyJetSkiOwner } = require("../middleware/auth.middleware")

// GET api/owner/jet-ski/
router.get("/", verifyToken, verifyOwner, async(req, res, next) => {
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
router.post("/", verifyToken, verifyOwner, async(req, res, next) => {

  const { name, description, price, images } = req.body
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
router.put("/:jetSkiId", verifyToken, verifyOwner, verifyJetSkiOwner, async(req, res, next) => {
  const { name, description, price, images } = req.body

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
router.delete("/:jetSkiId", verifyToken, verifyOwner, verifyJetSkiOwner, async(req, res, next) => {

  try {
    await JetSki.findOneAndDelete(req.params.jetSkiId)

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
  
})

module.exports = router