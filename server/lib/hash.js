'use strict';
const crypto = require('crypto');

const supportAlgs = crypto.getHashes();

exports.hash = (alg, data, outputEncoding = 'hex') => {
	if(!supportAlgs.includes(alg))
		throw new Error(`不支持的hash算法${alg}`);

	const h = crypto.createHash(alg);

	h.update(data);
	return h.digest(outputEncoding);
};
