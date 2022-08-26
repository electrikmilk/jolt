/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/24/2022 23:51
 */

import {$all} from "./helpers";
import {registerInit} from "./app";

registerInit(function () {
    tags.forEach(function (tag: TagCallback) {
        const tags = $all(tag.name);
        if (tags && tags.length !== 0) {
            tags.forEach(function (element: HTMLElement) {
                tag.callback(element);
            });
        }
    });
});

export function registerTag(tagName: string, callback: (element: HTMLElement) => void) {
    tags.push({name: tagName, callback: callback});
}

export function registerReactiveTag(nodeName: string, callback: (node: HTMLElement) => void) {
    nodeName = nodeName.toUpperCase();
    if (!Object.keys(reactiveTags).includes(nodeName)) {
        reactiveTags.push({name: nodeName, callback: callback});
    }
}