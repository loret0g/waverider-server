const jwt = require("jsonwebtoken")

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

//! Rol para propietario
function verifyOwner(req, res, next) {
  if (req.payload.role === "owner") {
    next()
  } else {
    res.status(401).json({message: "No eres un propietario"})
  }
}

module.exports = {
  verifyToken,
  verifyOwner
}