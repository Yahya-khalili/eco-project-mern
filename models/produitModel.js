// models/User.js
const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
      },
      prix: {
        type: Number,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
      
});

const produits = mongoose.model('produits', produitSchema);
module.exports = produits;
