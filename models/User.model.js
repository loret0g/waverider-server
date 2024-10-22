// const { Schema, model } = require("mongoose")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    username: {
      type: String,
      required: [true, 'Username is required.']
    },
    role: {
      type: String,
      enum: ["user", "owner"], 
      default: "user"
    }, 
    phoneNumber: { 
      type: Number,
      default: null
    },
    jetSkis: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "JetSki"
    }],
    photo: {
      type: String,
      default: "https://cuv.upc.edu/ca/shared/imatges/fotos-professorat-i-professionals/anonimo.jpg"
    }
  }, { timestamps: true }
);

const User = mongoose.model("User", userSchema)

module.exports = User
