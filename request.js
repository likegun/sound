'use strict';
const fs = require('fs');
const path = require('path');

const request = require('request');

const get = (url, qs = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    request(url, { qs, headers }, (err, res, body) => {
      if(err) reject(err);
      else resolve({res, body});
    })
  });
}

const post = (url, qs = {}, formOrRaw = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
		const options = { qs, headers };
		if(typeof formOrRaw === 'object') {
			options.form = formOrRaw;
		}
		else {
			options.body = formOrRaw;
		}

    request.post(url, options, (err, res, body) => {
      if(err) reject(err);
      else resolve({res, body});
    })
  });
}

const download = (url, target, qs = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
		let isDirectory = false;
		try {
			isDirectory = fs.statSync(target).isDirectory();
		} catch (e) {}
		if(isDirectory) {
			const req = request.get(url, { qs, headers, rejectUnauthorized: false });
			req.on('response', res => {
				const filename = res.headers['content-disposition'].match(/filename="(.*?)"/)[1];
				req
				.pipe(fs.createWriteStream(path.join(target, filename)))
				.on('error', reject)
				.on('finish', resolve);
			});

			req.on('error', reject);
		}
		else {
			request
				.get(url, { qs, headers, rejectUnauthorized: false })
				.pipe(fs.createWriteStream(target))
				.on('error', reject)
				.on('finish', resolve);
		}
  });
}

const upload = (url, files = {}, fields = {}) => {
  return new Promise((resolve, reject) => {
    const formData = fields;

    Object.keys(files).forEach(key => {
      formData[key] = fs.createReadStream(files[key]);
    });

    request.post(url, { formData }, (err, res, body) => {
      if(err) reject(err);
      else resolve({ res, body });
    });
  });
}

module.exports = {
  get,
  post,
  download,
  upload
};
