/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/24/2022 23:7
 */

import {$all} from "./helpers";
import {registerInit} from "./app";

registerInit(function () {
    for (let attribute in attributes) {
        const tags = $all('[' + attribute + ']');
        if (tags && tags.length !== 0) {
            tags.forEach(function (element: HTMLElement) {
                // @ts-ignore
                attributes[attribute](element.attributes[attribute].value, element);
            });
        }
    }
});

export function registerReactiveAttribute(attribute: string, callback: (value: string, node: HTMLElement) => void) {
    attribute = attribute.toLowerCase();
    // @ts-ignore
    if (!reactiveAttributes.includes(attribute)) {
        // @ts-ignore
        reactiveAttributes[attribute] = callback;
    }
}

export function registerAttribute(attribute: string, callback: (value: string, node: HTMLElement) => void) {
    attribute = attribute.toLowerCase();
    // @ts-ignore
    if (!attributes.includes(attribute)) {
        // @ts-ignore
        attributes[attribute] = callback;
    }
}