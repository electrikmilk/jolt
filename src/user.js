/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 16:34
 */

let User = {
	language: navigator.language,
	browser: {name: null, version: null, fullVersion: null, headless: false, webview: false, bot: false},
	engine: {name: null, version: null, fullVersion: null},
	platform: {name: null, mobile: null, version: null},
	getAgent: function () {
		const userAgent = navigator.userAgent;
		/* headless */
		User.browser.headless = !!userAgent.includes('Headless');
		/* bots/crawlers/spiders */
		let hiddenBots = [
			'addthis.com',
			'Mediapartners-Google',
			'newspaper/0.2.8',
			'zgrab',
			'ggpht.com',
			'naver.me',
			'admantx.com',
			'BingPreview',
			'facebookexternalhit',
			'Daum/'
		];
		hiddenBots.forEach(function (bot) {
			User.browser.bot = !!userAgent.includes(bot);
		});
		User.browser.bot = !!(userAgent.includes('bot') || userAgent.includes('spider'));
		// Use modern navigator.userAgentData if available
		if (navigator.userAgentData) {
			const userAgentData = navigator.userAgentData;
			if (userAgentData.brands[1]) {
				this.browser.name = userAgentData.brands[1].brand;
				this.browser.version = userAgentData.brands[1].version;
			}
			if (userAgentData.brands[2]) {
				this.engine.name = userAgentData.brands[2].brand;
				this.engine.version = userAgentData.brands[2].version;
			}
			this.platform.name = userAgentData.platform.toLowerCase();
			this.platform.mobile = userAgentData.mobile;
			switch (this.browser.name) {
				case 'Google Chrome':
					this.browser.name = 'chrome';
			}
			switch (this.engine.name) {
				case 'Chromium':
					this.engine.name = 'blink';
			}
		} else {
			this.oldUserAgent();
		}
	},
	oldUserAgent: function () {
		const userAgent = navigator.userAgent;
		/* browser */
		if (userAgent.includes('Edge/') || userAgent.includes('Edg/')) {
			User.browser.name = 'edge';
		} else if (userAgent.includes('OPR/')) {
			User.browser.name = 'opera';
		} else if (userAgent.includes('Chrome/')) {
			User.browser.name = 'chrome';
		} else if (userAgent.includes('Macintosh;') && userAgent.includes('AppleWebKit/')) {
			let version = this.parseVersion('Version');
			User.browser.name = 'safari';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Safari/') && userAgent.includes('AppleWebKit/')) {
			let version = this.parseVersion('Version');
			User.browser.name = 'safari';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('iPhone OS')) {
			let version = this.parseVersion('AppleWebKit');
			User.browser.name = 'safari';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Waterfox/')) {
			let version = this.parseVersion('Waterfox');
			User.browser.name = 'waterfox';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Firefox/')) {
			let version = this.parseVersion('Firefox');
			User.browser.name = 'firefox';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Trident/') && userAgent.includes('MSIE')) {
			User.browser.name = 'ie';
		}
		/* engine */
		if (userAgent.includes('Edge')) {
			let version = this.parseVersion('Edge');
			User.engine.name = 'edgeHTML';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Edg')) {
			let version = this.parseVersion('Edg');
			User.engine.name = 'blink';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Chrome')) {
			let version = this.parseVersion('Chrome');
			User.engine.name = 'blink';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if ((userAgent.includes('AppleWebKit') && userAgent.includes('Macintosh')) || userAgent.includes('iPhone OS')) {
			let version = this.parseVersion('AppleWebKit');
			User.engine.name = 'webkit';
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Gecko')) {
			let version = this.parseVersion('Gecko');
			User.engine.name = 'gecko';
			User.engine.version = version.fullVersion;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Trident')) {
			let version = this.parseVersion('Trident');
			User.engine.name = 'trident';
			User.engine.version = version.fullVersion;
			User.engine.fullVersion = version.fullVersion;
		}
		/* platform */
		if (userAgent.includes('Windows NT')) {
			User.platform.name = 'windows';
			User.platform.mobile = false;
		} else if (userAgent.includes('Macintosh')) {
			User.platform.name = 'macos';
			User.platform.mobile = false;
		} else if (userAgent.includes('iPhone OS')) {
			User.platform.name = 'ios';
			User.platform.mobile = true;
			User.browser.webview = !!userAgent.includes('WKWebView');
		} else if (userAgent.includes('Android')) {
			User.platform.name = 'android';
			User.platform.mobile = true;
			User.browser.webview = !!userAgent.includes('; wv)');
		} else if (userAgent.includes('Linux')) {
			User.platform.name = 'linux';
			User.platform.mobile = false;
		}
		if (User.platform.mobile === false && userAgent.includes('Mobile')) {
			User.platform.mobile = true;
		}
		if (userAgent.includes('Android')) {
			User.platform.version = userAgent.split(' Android ')[1].split(';')[0].trim();
		} else if (userAgent.includes('iPhone OS')) {
			User.platform.version = userAgent.split(' iPhone OS ')[1].split('like')[0].replaceAll('_', '.').trim();
		} else if (userAgent.includes('Mac OS X')) {
			User.platform.version = userAgent.split(' X ')[1].split(')')[0].replaceAll('_', '.').trim();
		} else if (userAgent.includes('Windows NT')) {
			User.platform.version = userAgent.split('Windows NT ')[1].split(';')[0].trim();
		}
	},
	parseVersion(keyword) {
		let ver = navigator.userAgent.split(keyword + '/')[1].split(' ')[0];
		let version = ver.split('.')[0];
		return {
			version: version,
			fullVersion: ver
		};
	}
};