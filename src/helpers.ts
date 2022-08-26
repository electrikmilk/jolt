/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:8
 */

interface Random {
    id: (prefix: string) => string,
    number: (max: number) => number
    color: () => string
}

export const Random: Random = {
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

export function $(selector: string): HTMLElement | null {
    return document.querySelector(selector)
}

export function $all(selector: string): NodeListOf<HTMLElement> | null {
    return document.querySelectorAll(selector)
}

export function escape(unsafe: string | null) {
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

export function data(properties: Object) {
    if (properties.constructor === Object) {
        // @ts-ignore
        for (let property in properties) {
            // @ts-ignore
            instance[property] = properties[property];
        }
    }
}

export function tempElement(tagName: string, attributes: { [name: string]: string }) {
    let temp = new Element(tagName, attributes);
    temp.style('display', 'none');
    return temp.element;
}

export class Element {
    element: HTMLElement
    parent: HTMLElement

    constructor(tagName: string, attributes: { [name: string]: string }) {
        this.element = document.createElement(tagName);
        if (attributes) {
            for (let attribute in attributes) {
                if (attribute === 'class') {
                    this.element['className'] = attributes[attribute];
                } else if (attribute === 'text') {
                    this.element['innerText'] = attributes[attribute];
                } else if (attribute === 'html') {
                    this.element['innerHTML'] = attributes[attribute];
                } else if (attribute === 'editable') {
                    this.element['contentEditable'] = attributes[attribute];
                } else if (attribute === 'parent') {
                    // @ts-ignore
                    this.parent = attributes[attribute];
                } else {
                    // @ts-ignore
                    this.element[attribute] = attributes[attribute];
                }
            }
        }
        if (!this.parent) {
            // @ts-ignore
            this.parent = document.querySelector('body');
        }
        this.parent.appendChild(this.element);
        return this;
    }

    style(property: string, value: string) {
        // @ts-ignore
        this.element.style[property] = value;
        return this;
    }

    createChild(tagName: string, attributes: { [name: string]: string }) {
        // @ts-ignore
        attributes['parent'] = this.element;
        return new Element(tagName, attributes);
    }
}