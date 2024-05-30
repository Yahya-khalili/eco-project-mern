// models/User.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  cin: {
    type: String,
    required: true,
    unique: true,
  },
  tel: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  adressLiv: {
    type: String,
    required: true,
  },
});

const clients = mongoose.model('clients', clientSchema);
module.exports = clients;
