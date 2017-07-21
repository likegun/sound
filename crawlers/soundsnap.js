'use strict';
const Nightmare = require('nightmare');
require('nightmare-load-filter')(Nightmare);
const nightmare = new Nightmare({
	show: true,
	openDevTools: {mode: 'detach'},
	gotoTimeout: 1000 * 60 * 2
});
const { download } = require('./request.js');

const url = 'https://www.soundsnap.com/search/audio/cat/newest';
const maxPage = 50;

const url = 'https://www.soundsnap.com/search/audio/cat/oldest';
const maxPage = 11;

const crawl = async () => {
	try {
		await nightmare
						.filter({
							urls:[
								'https://www.soundsnap.com'
							]
						}, function(details, cb){
							//cancel a specific file
							return cb({cancel: (details.url.includes('https://www.soundsnap.com/streamers/play.php'))});
						})
						.goto('https://www.soundsnap.com/search/audio/cat/score');

		let curPage = 1;

		while(true) {
			const srcArr = await nightmare.wait(function(curPage) {
				return Number(document.querySelector('.pager-current').innerText) === curPage;
			}, curPage)
			.wait('audio[preload]')
			.evaluate(function() {
				const audioArr = Array.prototype.slice.call(document.querySelectorAll('audio[preload]'));
				const srcArr = [];
				for(let audio of audioArr) {
					srcArr.push(audio.getAttribute('src'));
				}
				return srcArr;
			});

			// 点击下一页
			await nightmare.evaluate(function() {
				document.querySelector('.pager-next').click();
			});
			curPage++;
			if(curPage > maxPage) {
				process.exit(0);
			}

			for(let src of srcArr) {
				download(src, './sounds', {}, {
					'Accept':'*/*',
					'Accept-Encoding':'identity;q=1, *;q=0',
					'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
					'Connection':'keep-alive',
					'Host':'www.soundsnap.com',
					'Range':'bytes=0-',
					'Referer':'https://www.soundsnap.com/search/audio/cat/score',
					'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
					Cookie:'PHPSESSID=othgsheeb1eoiubeqd75f3qgk7; ojoo_browser_sort_order=score; ojoo_browser_join=anylength; ojoo_browser_bpm=anybpm; ss_volume=0.8'
				});
			}
		}
	} catch (e) {
		console.error(e);
	}
}

crawl();
