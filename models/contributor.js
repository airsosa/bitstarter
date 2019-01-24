'use strict';

const mongoose = require('mongoose');

if (!process.env.DB_URL) require('dotenv').config();
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useCreateIndex: true,});

const contributorSchema = new mongoose.Schema( {
  fullname: String,
  email: {type: String, required: true },
  amount: {type: Number, required: true },
  currency: String,
  country: String,
  reference: {type: String, required: true, unique: true},
  timestamp: {type: Date, default: Date.now }
});

const Contributor = mongoose.model('Contributor', contributorSchema);

module.exports = Contributor;
