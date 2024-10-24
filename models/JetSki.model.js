const mongoose = require("mongoose")

const jetSkiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
  },
  available: {
    type: Boolean,
    default: true,
  },
  images: [{  //todo-- Array de URLs
    type: String,
    required: true,
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  averageRating: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

const JetSki = mongoose.model("JetSki", jetSkiSchema)

module.exports = JetSki