/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/10/2022 22:56
 */

let Random: Random = {
    id: (prefix?: string): string => {
        let S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return prefix + (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    },
    number: (max: number): number => {
        return Math.floor(Math.random() * max);
    },
    color: (): string => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
};

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

function tempElement(tagName: string, attributes: Object) {
    let temp = document.createElement(tagName);
    if (attributes) {
        for (let attribute in attributes) {
            // @ts-ignore
            temp[attribute] = attributes[attribute];
        }
    }
    temp.style.display = 'none';
    $("body")?.appendChild(temp);
    return temp;
}