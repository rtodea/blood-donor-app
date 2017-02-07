const mongoose = require('mongoose');

const mongooseModel = mongoose.model('Donor', new mongoose.Schema({
  firstName: { type : String },
  lastName: { type : String },
  contactNo: { type : String },
  email: { type : String },
  bloodGroup: { type : String },

  longitude: { type : Number },
  latitude: { type : Number },

  ip: { type : String },
  countryCode: { type : String },
  street: { type : String },
  city: { type : String }
}));

// TODO: validate mongooseModel.create to not have duplicate entries
module.exports = mongooseModel;
