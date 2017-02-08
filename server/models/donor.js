const mongoose = require('mongoose');

const schema = {
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
};

const mongooseModel = mongoose.model('Donor', new mongoose.Schema(schema));

function jsonifier(persistedData) {
  const jsonModel = {};
  Object.keys(schema).forEach((field) => {
    jsonModel[field] = persistedData[field];
  });
  jsonModel.id = persistedData.id; // id is added by MongoDB

  return jsonModel;
}

// TODO: validate mongooseModel.create to not have duplicate entries
module.exports = {
  DonorModel: mongooseModel,
  DONOR_REST_FIELDS: [
    'firstName', 'lastName', 'contactNo', 'email', 'bloodGroup',
    'longitude', 'latitude', 'ip', 'countryCode', 'street', 'city'
  ],
  DONOR_CREATE_EVENT: 'create',
  DONOR_DELETE_EVENT: 'delete',
  jsonifier
};
