const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  reviewDate: { 
    type: Date, 
    default: Date.now 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  jetSki: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'JetSki' 
  }
}, { timestamps: true })


const Review = mongoose.model("Review", reviewSchema)

module.exports = Review