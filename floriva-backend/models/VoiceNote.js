const mongoose = require('mongoose');

const VoiceNoteSchema = new mongoose.Schema({
  _id:       { type: String },
  data:      { type: Buffer, required: true },
  mimeType:  { type: String, default: 'audio/webm' },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }, // 7 days
});

module.exports = mongoose.model('VoiceNote', VoiceNoteSchema);
