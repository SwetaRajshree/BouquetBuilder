const mongoose = require('mongoose');

const SharedBouquetSchema = new mongoose.Schema({
  _id:       { type: String }, // UUID
  bouquet:   { type: Object, required: true },
  recipient: { type: String, default: '' },
  message:   { type: String, default: '' },
  sender:    { type: String, default: '' },
  cardStyle: { type: String, default: 'parchment' },
  voiceId:   { type: String, default: null },
  spotifyId: { type: String, default: null },
  musicUrl:  { type: String, default: null },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 days
});

module.exports = mongoose.model('SharedBouquet', SharedBouquetSchema);
