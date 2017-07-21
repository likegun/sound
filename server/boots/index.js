'use strict';

const { readdir }  = require('../lib/filesystem.js');

const files = readdir(__dirname, {
	filter: filename => !filename.includes('index.js')
});

for(let file of files)
	require(file);
