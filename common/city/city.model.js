var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    trim: true,
  },
  country: {
    type: String
  },
  coord: {
    type: Object,
    lon: {
      type: Number
    },
    lat: {
      type: Number
    }
  }
}, { timestamps: true });



citySchema.index({ id: 1 }, { name: 1 }, { country: 1 });

const cityModel = mongoose.model('Cities', citySchema);

module.exports = {
  schema: citySchema,
  model: cityModel,
};
