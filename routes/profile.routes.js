const router = require("express").Router()

const User = require("../models/User.model")
const { verifyToken, verifyUserIdentity } = require("../middleware/auth.middleware")

//todo  Poder visitar los perfiles de los propietarios, para ver que motos tienen
// Actualmente solo se puede ver el perfil si estás registrado
//todo  Puedo hacer la ruta para que únicamente se puedan ver los perfiles de los propietarios y no el de todo el mundo. Aunque para el sistema de valoraciones sería mejor que se puedan ver todos los perfiles

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

// PUT api/profile/:userId
router.put("/:userId", verifyToken, verifyUserIdentity, async(req, res, next) => {
  try {
    const response = await User.findByIdAndUpdate(req.params.userId, {
      username: req.body.username
    }, {new: true})
    console.log(req.body.username)
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})

// DELETE api/profile/:userId
router.delete("/:userId", verifyToken, verifyUserIdentity, async(req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.sendStatus(202)
  } catch (error) {
    next(error)
  }
})

module.exports = router