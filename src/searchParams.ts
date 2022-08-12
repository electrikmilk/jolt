/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/12/2022 13:8
 */

App.registerInit(() => {
    let url = window.location.href;
    if (url.includes('?')) {
        if (typeof URL !== "undefined") {
            let urlObject = new URL(url);
            urlObject.searchParams.forEach(function (value, key) {
                // @ts-ignore
                App.urlParams[key] = value;
            })
        } else {
            if (url.includes('&')) {
                let kvs = window.location.href.split('?')[1].split('&');
                kvs.forEach(function (kv) {
                    const param = kv.split('=');
                    const key = decodeURIComponent(param[0])
                    // @ts-ignore
                    App.urlParams[key] = decodeURIComponent(param[1]);
                });
            } else {
                let kv = window.location.href.split('?')[1];
                const param = kv.split('=');
                const key = decodeURIComponent(param[0])
                // @ts-ignore
                App.urlParams[key] = decodeURIComponent(param[1]);
            }
        }
    }
});