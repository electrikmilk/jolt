/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 14:3
 */

import {registerInit} from "./app";

interface SearchParams {
    key: string,
    value: string
}

let urlParams: Array<SearchParams> = [];

registerInit(() => {
    let url = window.location.pathname;
    if (url.includes('?')) {
        if (typeof URL !== "undefined") {
            let urlObject = new URL(url);
            urlObject.searchParams.forEach(function (value, key) {
                // @ts-ignore
                urlParams[key] = value;
            })
        } else {
            if (url.includes('&')) {
                let kvs = window.location.pathname.split('?')[1].split('&');
                kvs.forEach(function (kv) {
                    const param = kv.split('=');
                    const key = decodeURIComponent(param[0])
                    // @ts-ignore
                    urlParams[key] = decodeURIComponent(param[1]);
                });
            } else {
                let kv = window.location.pathname.split('?')[1];
                const param = kv.split('=');
                const key: string = decodeURIComponent(param[0])
                // @ts-ignore
                urlParams[key] = decodeURIComponent(param[1]);
            }
        }
    }
});

export function get(key: string) {
    if (Object.keys(urlParams).includes(key)) {
        // @ts-ignore
        return urlParams[key];
    } else {
        return false;
    }
}