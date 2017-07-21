'use strict';
const { format } = require('util');

const { get, download } = require('./request.js');

const firstPage = 'https://freesound.org/search/?q=cat&page=1#sound'
const url = 'https://freesound.org/search/?q=cat&page=%d#sound';

const crawl = async () => {
	try {
		const { body } = await get(firstPage);
		const totalPage = Number(body.match(/.*page=(.*?)#sound/)[1]);

		let curPage = 1;
		for(let curPage = 1; curPage <= totalPage; curPage++) {
			const { body } = await get(format(url, curPage));

			const regex = /mp3_file"\s*?href="(.*?)".*?>(.*?)<\/a>/g;
			const urls = [];
			const filenames = [];
			let match;

			while((match = regex.exec(body)) !== null) {
				urls.push(match[1]);
				filenames.push(match[2]);
			}

			console.log(urls);
			console.log(filenames);

			for(let [index, url] of urls.entries()) {
				console.log(url);
				download(`https://freesound.org${url}`, `./freesound/${filenames[index].replace(/\//g, '')}.mp3`, {}, {
					'Accept':'*/*',
					'Accept-Encoding':'identity;q=1, *;q=0',
					'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
					'Connection':'keep-alive',
					'Host':'freesound.org',
					'Range':'bytes=0-',
					Referer: 'https://freesound.org/search/?q=cat&page=2',
					'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
					Cookie:'cookieConsent=yes; __utma=54889084.1647589112.1500624372.1500624372.1500624372.1; __utmb=54889084.5.10.1500624372; __utmc=54889084; __utmz=54889084.1500624372.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)'
				})
			}
		}

		process.exit(0);


	} catch (e) {
		console.error(e);
	}
}

crawl();
