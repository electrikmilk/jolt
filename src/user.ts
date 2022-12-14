/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/24/2022 22:17
 */

import {User} from "./app";

function getUserAgent() {
    const userAgent = navigator.userAgent;
    /* headless */
    User.browser.headless = userAgent.includes('Headless');
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
        User.browser.bot = userAgent.includes(bot);
    });
    User.browser.bot = userAgent.includes('bot') || userAgent.includes('spider');
    // Use modern navigator.userAgentData if available
    // @ts-ignore
    if (navigator.userAgentData) {
        // @ts-ignore
        const userAgentData = navigator.userAgentData;
        if (userAgentData.brands[1]) {
            User.browser.name = userAgentData.brands[1].brand;
            User.browser.version = userAgentData.brands[1].version;
        }
        if (userAgentData.brands[2]) {
            User.engine.name = userAgentData.brands[2].brand;
            User.engine.version = userAgentData.brands[2].version;
        }
        User.platform.name = userAgentData.platform.toLowerCase();
        User.platform.mobile = userAgentData.mobile;
        switch (User.browser.name) {
            case 'Google Chrome':
                User.browser.name = 'chrome';
        }
        switch (User.engine.name) {
            case 'Chromium':
                User.engine.name = 'blink';
        }
    } else {
        oldUserAgent();
    }
}

function oldUserAgent () {
    const userAgent = navigator.userAgent;
    /* browser */
    if (userAgent.includes('Edge/') || userAgent.includes('Edg/')) {
        User.browser.name = 'edge';
    } else if (userAgent.includes('OPR/')) {
        User.browser.name = 'opera';
    } else if (userAgent.includes('Chrome/')) {
        User.browser.name = 'chrome';
    } else if (userAgent.includes('Macintosh;') && userAgent.includes('AppleWebKit/')) {
        let version = parseVersion('Version');
        User.browser.name = 'safari';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Safari/') && userAgent.includes('AppleWebKit/')) {
        let version = parseVersion('Version');
        User.browser.name = 'safari';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
    } else if (userAgent.includes('iPhone OS')) {
        let version = parseVersion('AppleWebKit');
        User.browser.name = 'safari';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Waterfox/')) {
        let version = parseVersion('Waterfox');
        User.browser.name = 'waterfox';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Firefox/')) {
        let version = parseVersion('Firefox');
        User.browser.name = 'firefox';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Trident/') && userAgent.includes('MSIE')) {
        User.browser.name = 'ie';
    }
    /* engine */
    if (userAgent.includes('Edge')) {
        let version = parseVersion('Edge');
        User.engine.name = 'edgeHTML';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
        User.engine.version = version.version;
        User.engine.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Edg')) {
        let version = parseVersion('Edg');
        User.engine.name = 'blink';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
        User.engine.version = version.version;
        User.engine.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Chrome')) {
        let version = parseVersion('Chrome');
        User.engine.name = 'blink';
        User.browser.version = version.version;
        User.browser.fullVersion = version.fullVersion;
        User.engine.version = version.version;
        User.engine.fullVersion = version.fullVersion;
    } else if ((userAgent.includes('AppleWebKit') && userAgent.includes('Macintosh')) || userAgent.includes('iPhone OS')) {
        let version = parseVersion('AppleWebKit');
        User.engine.name = 'webkit';
        User.engine.version = version.version;
        User.engine.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Gecko')) {
        let version = parseVersion('Gecko');
        User.engine.name = 'gecko';
        User.engine.version = version.fullVersion;
        User.engine.fullVersion = version.fullVersion;
    } else if (userAgent.includes('Trident')) {
        let version = parseVersion('Trident');
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
        User.browser.webview = userAgent.includes('WKWebView');
    } else if (userAgent.includes('Android')) {
        User.platform.name = 'android';
        User.platform.mobile = true;
        User.browser.webview = userAgent.includes('; wv');
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
        // @ts-ignore
        User.platform.version = userAgent.split(' iPhone OS ')[1].split('like')[0].replaceAll('_', '.').trim();
    } else if (userAgent.includes('Mac OS X')) {
        // @ts-ignore
        User.platform.version = userAgent.split(' X ')[1].split(')')[0].replaceAll('_', '.').trim();
    } else if (userAgent.includes('Windows NT')) {
        User.platform.version = userAgent.split('Windows NT ')[1].split(';')[0].trim();
    }
}

function parseVersion(keyword: string) {
    let ver = navigator.userAgent.split(keyword + '/')[1].split(' ')[0];
    let version = ver.split('.')[0];
    return {
        version: version,
        fullVersion: ver
    };
}