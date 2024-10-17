const jwt = require("jsonwebtoken")
const JetSki = require("../models/JetSki.model")

function verifyToken(req, res, next) {

  console.log(req.headers)

  try {

    const tokenArr = req.headers.authorization.split(" ")
    const token = tokenArr[1]

    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    
    console.log(payload)
    req.payload = payload

    next()

  } catch (error) {
    res.status(401).json({message: "Token no valido o no existe"})
  }
}

function verifyUserIdentity(req, res, next) {
  if (req.payload._id !== req.params.userId) {
    return res.status(403).json({ message: "No tienes permiso para modificar este perfil" });
  } else {
    next()
  }
}

function verifyOwner(req, res, next) {
  if (req.payload.role !== "owner") {
    return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
  } else {
    next();
  }
}

// Que coincida el id de la moto con su propietario
async function verifyJetSkiOwner(req, res, next) {
  try {
    const jetSki = await JetSki.findById(req.params.jetSkiId);

    if (!jetSki) {
      return res.status(404).json({ message: "Moto de agua no encontrada" });
    }

    if (jetSki.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta moto" });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyToken,
  verifyUserIdentity,
  verifyOwner,
  verifyJetSkiOwner
}