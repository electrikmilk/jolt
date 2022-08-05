/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:27
 */

function $(selector: string): HTMLElement | null {
    return document.querySelector(selector)
}

function $all(selector: string): NodeListOf<HTMLElement> | null {
    return document.querySelectorAll(selector)
}

function escape(unsafe: string | null) {
    if (unsafe === null) {
        return unsafe;
    }
    return unsafe.replace(/[&<"']/g, function (m) {
        switch (m) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            default:
                return '&#039;';
        }
    });
}

function getAttributes(element: HTMLElement) {
    let attrs = [];
    for (let attr in element.attributes) {
        let attribute = element.attributes[attr].nodeName;
        if (attribute !== undefined) {
            attrs.push(attribute);
        }
    }
    return attrs;
}