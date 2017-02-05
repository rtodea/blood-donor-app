const mongoose = require('mongoose');

module.exports = mongoose.model('ModelEvent', new mongoose.Schema({
  name: { type : String }
}));
