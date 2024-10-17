const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Servidor de WaveRider funcionando!");
});

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

const profileRouter = require("./profile.routes")
router.use("/profile", profileRouter)

// Rutas para que el propietario pueda modificar sus motos - Sus datos lo hago con las peticiones a /profile
const ownerRouter = require("./owner.routes")
router.use("/owner/jet-ski", ownerRouter)

const jetSkiRouter = require("./jetSki.routes")
router.use("/jet-ski", jetSkiRouter)

module.exports = router;
