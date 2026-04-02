const mongoose = require('mongoose');

const SharedGardenSchema = new mongoose.Schema({
  _id:         { type: String },
  type:        { type: String, default: 'garden' }, // 'garden' or 'polaroid'
  title:       { type: String, default: 'My Creation' },
  image:       { type: String, default: '' },
  flowerCount: { type: Number, default: 0 },
  // polaroid state
  state:       { type: Object, default: null },
  createdAt:   { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});

module.exports = mongoose.model('SharedGarden', SharedGardenSchema);
