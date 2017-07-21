'use strict';
const mongoose = require('mongoose');

const SoundSchema = new mongoose.Schema({
	path: String,
	hash: String
});

const Sound = mongoose.model('Sound', SoundSchema);

module.exports = Sound;
