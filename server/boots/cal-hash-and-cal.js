'use strict';
const fs = require('fs');
const { join } = require('path');

const { hash } = require('../lib/hash.js');
const Sound = require('../models/Sound.js');

const watchDirectory = join(__dirname, '../../public/new-sounds');

fs.watch(watchDirectory, async (eventType, filename) => {
	let stat;
	const path = join(watchDirectory, filename);
	try {
		stat = fs.lstatSync(path);
	} catch (e) {}

	//文件被新增修改,将文件入库
	if(stat && stat.isFile()) {
		const content = fs.readFileSync(path);
		const hashedContent = hash('sha1', content, 'hex');

		let sound = await Sound.findOne({
			hash: hashedContent
		}).exec();

		if(sound)
			return;

		sound = new Sound({
			path,
			hash: hashedContent
		});
		await sound.save();
	}
});
