const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User.model")

const {verifyToken, verifyOwner} = require("../middleware/auth.middleware")

// POST - "/api/auth/signup"
router.post("/signup", async(req, res, next) => {
  console.log(req.body)

  const { email, password, username, role, phoneNumber } = req.body

  if(!email || !password || !username) {
    res.status(400).json({message: "Todos los campos son requeridos"})
    return
  }

  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/gm
  if(!regexPassword.test(password)) {  // test devuelve un booleano
    res.status(400).json({message: "La contraseña debe tener al menos una mayúscula, una minúscula, un número y entre 8 y 16 caracteres"})
    return
  }    

  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!regexEmail.test(email)) {
    res.status(400).json({message: "El email no tiene una estructura correcta"})
    return
  }

  if(phoneNumber) {
    const regexPhone = /^[0-9]{9}$/;
    if(!regexPhone.test(phoneNumber)) {
      res.status(400).json({message: "El número de teléfono no tiene una estructura correcta"})
      return
    } 

  }

  try {
    // Que no haya otro usuario con el mismo email
    const foundUser = await User.findOne({email: email})
    if(foundUser) {
      res.status(400).json({message: "Usuario ya registrado con ese email"})
      return
    }

    // Que no haya otro usuario con el mismo teléfono
    if (phoneNumber) {
      const foundUserByPhone = await User.findOne({ phoneNumber: phoneNumber });
      if (foundUserByPhone) {
        res.status(400).json({ message: "Número de teléfono ya registrado" });
        return;
      }
    }

    // Encriptar contraseña con el paquete bcryptjs
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    await User.create({
      email, 
      password: hashPassword, 
      username,
      role,
      phoneNumber
    })
    
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }

})

// POST "/api/auth/login"
router.post("/login", async(req, res, next) => {
  const { email, password } = req.body
  // console.log(email, password)

  if(!email || !password) {
    res.status(400).json({message: "Todos los campos son requeridos"})
    return 
  }

  try {
    const foundUser = await User.findOne({email: email})

    if(!foundUser) {
      res.status(400).json({message: "Usuario no encontrado con ese email"})
      return
    }

    // Validar que la contraseña sea correcta
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if(!isPasswordCorrect) {
      res.status(400).json({message: "La contraseña no es correcta"})
      return
    }

    // Ya se ha autenticado al usuario => le damos su token
    const payload = {         // payload: información única del usuario
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    }

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d"
    })
    
    res.status(200).json({ authToken: authToken })

  } catch (error) {
    next(error)
  }
})

// GET "/api/auth/verify"
router.get("/verify", verifyToken, (req, res) => {
  console.log(req.payload)

  res.status(200).json(req.payload)
  // con esto el frontend sabe quien es el usuario que está navegando por la web
})

module.exports = router