'use strict';

const { get, download } = require('./request.js');

const firstPage = 'https://www.audiomicro.com/free-sound-effects/free-animal-sound-effects'
const url = 'https://www.audiomicro.com/free-sound-effects/free-animal-sound-effects/page-';

const crawl = async () => {
	try {
		const { body } = await get(firstPage);
		const totalPage = Number(body.match(/page-(.*?)"\s*?rel="last"/)[1]);

		let curPage = 1;
		for(let curPage = 1; curPage <= totalPage; curPage++) {
			const { body } = await get(`${url}${curPage}`);
			const idRegex = /href="\/tracks\/download\/(.*?)\/.*?"/g;
			const ids = new Set();
			const filenameRegex = /media-title">(.*?)<\/a>/g;
			const filenames = [];
			let match;

			while((match = idRegex.exec(body)) !== null) {
				ids.add(match[1]);
			}

			while((match = filenameRegex.exec(body)) !== null) {
				filenames.push(match[1]);
			}
			console.log(Array.from(ids));
			console.log(filenames);
			for(let [index, id] of (Array.from(ids)).entries()) {
				download(`https://www.audiomicro.com/tracks/listen/${id}`, `./animals/${filenames[index]}.mp3`, {}, {
					'Accept':'*/*',
					'Accept-Encoding':'identity;q=1, *;q=0',
					'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
					'Connection':'keep-alive',
					'Host':'www.audiomicro.com',
					'Range':'bytes=0-',
					'Referer':'https://www.audiomicro.com/free-sound-effects/free-animal-sound-effects/page-1',
					'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
					Cookie:'CAKEPHP=mj92sj1gjvdllrnb80meoico36; AWSELB=8DABF5D902CF3C402FE7932ECB5A8B7719D330C50ECCA5DD5D05370C4782D7ABAB1E252E0C405F17CF3F09E765CAC3FCC78F5F7BD660D5B62DFFDF2E32A240887FF03791E229753FE996DACD7B9C6F908ABF6C7837; _okdetect=%7B%22token%22%3A%2215002848765880%22%2C%22proto%22%3A%22https%3A%22%2C%22host%22%3A%22www.audiomicro.com%22%7D; _ok=1868-439-10-6477;_okbk=cd4%3Dtrue%2Cvi5%3D0%2Cvi4%3D1500622566113%2Cvi3%3Dactive%2Cvi2%3Dfalse%2Cvi1%3Dfalse%2Ccd8%3Dchat%2Ccd6%3D0%2Ccd5%3Daway%2Ccd3%3Dfalse%2Ccd2%3D0%2Ccd1%3D0%2C; olfsk=olfsk3371896579522171; wcsid=LqKdeyLb3bwJBcub7l6Th0HMRExBb673; hblid=CwhtoPU2FDBS7rYR7l6Th0HMREr6BF7x; _ga=GA1.2.2072832975.1500284874; _gid=GA1.2.1603104517.1500622546; _oklv=1500623466039%2CLqKdeyLb3bwJBcub7l6Th0HMRExBb673'
				})
			}
		}


	} catch (e) {
		console.error(e);
	}
}

crawl();
