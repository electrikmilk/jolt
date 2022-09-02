/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:3
 */

import {Random} from "./helpers";
import "./prototypes";
import {registerTag} from "./tags";

interface AttributeCallback {
    name: string,
    callback: (node: HTMLElement) => void
}

interface TagCallback {
    name: string,
    callback: Function
}

export let User = {
    language: navigator.language,
    browser: {name: '', version: '', fullVersion: '', headless: false, webview: false, bot: false},
    engine: {name: '', version: '', fullVersion: ''},
    platform: {name: '', mobile: false, version: ''},
};

let instance: App;

let context: Array<string> = [];
let inits: Function[] = [];
let loops: Function[] = [];
let dataKeys: Array<string> = [];

let attributes: Array<AttributeCallback> = [];
let reactiveAttributes: Array<AttributeCallback> = [];

let tags: Array<TagCallback> = [];
let reactiveTags: Array<TagCallback> = [];

let errorNodes: HTMLElement[] = [];

let events: HTMLElement[] = [];

interface App {
    ready: Function
}

class App {
    constructor() {
    }
}

interface AppTemplate extends Object {
    data: Object,
    functions: Function[]
    ready: () => void,
    inits: Function[]
}

window.onload = () => {
    getUserAgent();
    // @ts-ignore
    if (instance) {
        if (instance.ready) {
            instance.ready();
        }
        inits.forEach(callback => callback());
        setInterval(function () {
            // @ts-ignore
            loop(document);
        }, 100);
    }
};

export function create(options: AppTemplate) {
    if (options.constructor && options.constructor === Object) {
        if (options.data && options.data.constructor && options.data.constructor === Object) {
            for (let property in options.data) {
                dataKeys.push(property);
                // @ts-ignore
                App.prototype[property] = options.data[property];
            }
        }
        if (options.functions && options.functions.constructor && options.functions.constructor === Object) {
            for (let func in options.functions) {
                // @ts-ignore
                App.prototype[func] = options.functions[func];
            }
        }
        if (options.ready && typeof options.ready === 'function') {
            App.prototype.ready = options.ready;
        }
    }
    instance = new App();
}

function error(message: any, node: HTMLElement) {
    if (node) {
        errorNodes.push(node);
    }
    console.error(`[Jolt] ${message}`, node, message.stack);
}

function errorMsg(message: string, node: HTMLElement) {
    if (node) {
        errorNodes.push(node);
    }
    console.trace(`[Jolt] ${message}`, node);
}

export function registerInit(callback: Function) {
    inits.push(callback);
}

export function registerLoop(callback: Function) {
    loops.push(callback);
}

function buildContext() {
    context.splice(0);
    dataKeys.forEach(function (key) {
        let arrayValues: string[] = [];
        arrayValues.splice(0)
        // @ts-ignore
        let keyValue = instance[key];
        if (Array.isArray(keyValue)) {
            keyValue.forEach(function (item) {
                if (typeof item === 'string') {
                    arrayValues.push(`"${item}"`);
                }
            });
            // @ts-ignore
            keyValue = '[' + arrayValues.join(',') + ']';
        } else if (typeof keyValue === 'object') {
            keyValue = JSON.stringify(keyValue);
        } else if (typeof keyValue === 'string') {
            keyValue = `"${keyValue}"`;
        }
        context.push(`let ${key} = ${keyValue};`);
    });
}

function loop(node: HTMLElement) {
    if (!errorNodes.includes(node)) {
        try {
            loops.forEach(callback => callback());
            for (let tag in reactiveTags) {
                if (reactiveTags[tag].name === node.nodeName) {
                    reactiveTags[tag].callback(node);
                }
            }
            if (node.attributes) {
                if (node.attributes.length !== 0) {
                    buildContext();
                    let attrs = getAttributes(node);
                    if (attrs.includes('model') && attrs.includes('eval')) {
                        errorMsg('Do not use model and eval attributes on the same element!', node);
                    }
                    for (let attr in node.attributes) {
                        let attribute = node.attributes[attr].nodeName;
                        if (attribute === undefined) {
                            continue;
                        }
                        // @ts-ignore
                        let value = node.attributes[attr].nodeValue;
                        let attributeName = attribute.toLowerCase();
                        if (Object.keys(reactiveAttributes).includes(attributeName)) {
                            // @ts-ignore
                            reactiveAttributes[attributeName](value, node);
                        }
                        if (attribute.split('')[0] === '.') {
                            if (node.id === '') {
                                node.id = Random.id('id');
                            }
                            let generateId = Random.id('');
                            // @ts-ignore
                            replaces[generateId] = {
                                // @ts-ignore
                                id: node.id,
                                name: attribute.trimPrefix('.'),
                                // @ts-ignore
                                value: value
                            };
                            node.removeAttribute(attribute);
                        }
                    }
                }
            }
        } catch (err: any) {
            error(err, node);
        }
    }
    let nodes = node.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i]) {
            continue;
        }
        if (nodes[i].childNodes) {
            // @ts-ignore
            loop(nodes[i]);
        }
    }
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