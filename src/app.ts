/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/10/2022 22:37
 */

interface App {
    data: [],
    errorNodes: HTMLElement[],
    functions: Function[],
    events: HTMLElement[],
    fors: Array<For>,
    loops: Function[],
    inits: Function[],
    tags: Array<Callback>,
    nodes: Array<KeyValue>,
    evals: Array<string>
    reactiveAttributes: Array<AttributeCallback>,
    attributes: Array<AttributeCallback>,
    replaces: Array<Loop>,
    modelTags: Array<string>
    context: Array<string>,
    urlParams: Array<string>,
    ready: Function,
    start: Function,
    create: (app: App) => void,
    error: (message: Error, node: HTMLElement) => void,
    errorMsg: (message: string, node: HTMLElement) => void,
    replacers: Function,
    buildContext: Function,
    loop: (node: HTMLElement) => void,
    registerReactiveAttribute: (attribute: string, callback: (value: string, node: HTMLElement) => void) => void,
    registerAttribute: (attribute: string, callback: (value: string, node: HTMLElement) => void) => void,
    registerReactiveTag: (nodeName: string, callback: (node: HTMLElement) => void) => void,
    registerTag: (tagName: string, callback: (element: HTMLElement) => void) => void,
    registerLoop: (callback: Function) => void,
    registerInit: (callback: Function) => void,
    Data: (key: string, value: any) => any | boolean,
    get: (key: string) => any | boolean,
}

interface KeyValue {
    key: string,
    value: any
}

interface Callback {
    name: string,
    callback: Function
}

interface AttributeCallback {
    name: string,
    callback: (node: HTMLElement) => void
}

interface Loop {
    id: string,
    name: string,
    value: string
}

interface Random {
    id: (prefix: string) => string,
    number: (max: number) => number
    color: () => string
}

interface For {
    node: string,
    replace: string,
    parent: string,
    property: string,
    items: Array<any>
}

let App: App = {
    data: [],
    errorNodes: [],
    functions: [],
    events: [],
    fors: [],
    loops: [],
    inits: [],
    tags: [], // static
    nodes: [], // reactive
    evals: [],
    reactiveAttributes: [], // reactive
    attributes: [], // static
    replaces: [],
    modelTags: [],
    context: [],
    urlParams: [],
    ready: () => null,
    start: () => {
        App.tags.forEach(function (tag: Callback) {
            const tags = $all(tag.name);
            if (tags && tags.length !== 0) {
                tags.forEach(function (element: HTMLElement) {
                    tag.callback(element);
                });
            }
        });
        App.attributes.forEach(function (attribute: AttributeCallback) {
            const tags = $all('[' + attribute.name + ']');
            if (tags && tags.length !== 0) {
                tags.forEach(function (element: HTMLElement) {
                    attribute.callback(element);
                });
            }
        });
        App.inits.forEach(callback => callback());
    },
    create: function (app: App) {
        if (app.ready && typeof app.ready === 'function') {
            this.ready = app.ready;
        }
        if (app.data && typeof app.data === 'object') {
            this.data = app.data;
        }
        if (app.functions && typeof app.functions === 'object') {
            this.functions = app.functions;
        }
    },
    error: function (message: any, node: HTMLElement) {
        if (node) {
            this.errorNodes.push(node);
        }
        console.error(`[Framework] ${message}`, node, message.stack);
    },
    errorMsg: function (message: string, node: HTMLElement) {
        if (node) {
            this.errorNodes.push(node);
        }
        console.trace(`[Framework] ${message}`, node);
    },
    replacers: function () {
        for (let rep in this.replaces) {
            let elementID = this.replaces[rep].id;
            if (elementID && $(`#${elementID}`)) {
                let repString: string = this.replaces[rep].value;
                let elementName: string = this.replaces[rep].name;
                let repElement = document.getElementById(elementID);
                for (let key in this.data) {
                    if (this.data[key] !== null) {
                        // @ts-ignore
                        repString = repString.replaceAll('{' + key + '}', this.data[key]);
                    }
                }
                if (repElement) {
                    if (!repElement.getAttribute(elementName) || repElement.getAttribute(elementName) !== repString) {
                        repElement.setAttribute(elementName, repString);
                    }
                }
            }
        }
    },
    buildContext: function () {
        let dataKeys = Object.keys(this.data);
        this.context = [];
        dataKeys.forEach(function (key) {
            // @ts-ignore
            let keyValue = App.data[key];
            if (Array.isArray(keyValue)) {
                let arrayValues: Array<string> = [];
                keyValue.forEach(function (item) {
                    if (typeof item === 'string') {
                        arrayValues.push(`"${item}"`);
                    }
                });
                keyValue = '[' + arrayValues.join(',') + ']';
            } else if (typeof keyValue === 'object') {
                keyValue = JSON.stringify(keyValue);
            } else if (typeof keyValue === 'string') {
                keyValue = `"${keyValue}"`;
            }
            App.context.push(`let ${key} = ${keyValue};`);
        });
    },
    loop: function (node) {
        if (!this.errorNodes.includes(node)) {
            try {
                this.replacers();
                this.loops.forEach(callback => callback());
                if (Object.keys(this.nodes).includes(node.nodeName)) {
                    // @ts-ignore
                    this.nodes[node.nodeName](node);
                }
                if (node.attributes) {
                    if (node.attributes.length !== 0) {
                        this.buildContext();
                        let attrs = getAttributes(node);
                        if (attrs.includes('model') && attrs.includes('eval')) {
                            this.errorMsg('Do not use model and eval attributes on the same element!', node);
                        }
                        for (let attr in node.attributes) {
                            let attribute = node.attributes[attr].nodeName;
                            if (attribute === undefined) {
                                continue;
                            }
                            // @ts-ignore
                            let value = node.attributes[attr].nodeValue;
                            let attributeName = attribute.toLowerCase();
                            if (Object.keys(this.reactiveAttributes).includes(attributeName)) {
                                // @ts-ignore
                                this.reactiveAttributes[attributeName](value, node);
                            }
                            if (attribute.split('')[0] === '.') {
                                if (node.id === '') {
                                    node.id = Random.id('id');
                                }
                                let generateId = Random.id('');
                                // @ts-ignore
                                App.replaces[generateId] = {
                                    // @ts-ignore
                                    id: node.id,
                                    name: attribute.trimPrefix('.'),
                                    value: value
                                };
                                node.removeAttribute(attribute);
                            }
                        }
                    }
                }
            } catch (err: any) {
                this.error(err, node);
            }
        }
        let nodes = node.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i]) {
                continue;
            }
            if (nodes[i].childNodes) {
                // @ts-ignore
                this.loop(nodes[i]);
            }
        }
    },
    registerReactiveAttribute: function (attribute: string, callback: (value: string, node: HTMLElement) => void) {
        attribute = attribute.toLowerCase();
        // @ts-ignore
        if (!this.reactiveAttributes.includes(attribute)) {
            // @ts-ignore
            this.reactiveAttributes[attribute] = callback;
        }
    },
    registerAttribute: function (attribute: string, callback: (value: string, node: HTMLElement) => void) {
        attribute = attribute.toLowerCase();
        // @ts-ignore
        if (!this.attributes.includes(attribute)) {
            // @ts-ignore
            this.attributes[attribute] = callback;
        }
    },
    registerReactiveTag: function (nodeName: string, callback: (node: HTMLElement) => void) {
        nodeName = nodeName.toUpperCase();
        // @ts-ignore
        if (!this.nodes.includes(nodeName)) {
            // @ts-ignore
            this.nodes[nodeName] = callback;
        }
    },
    registerTag: function (tagName: string, callback: (element: HTMLElement) => void) {
        this.tags.push({name: tagName, callback: callback});
    },
    registerLoop: function (callback: Function) {
        this.loops.push(callback);
    },
    registerInit: function (callback: Function) {
        this.inits.push(callback);
    },
    Data: (key: string, value?: any): any | boolean => {
        if (key.constructor === Object) {
            // @ts-ignore
            for (let k in key) {
                // @ts-ignore
                App.data[k] = key[k];
            }
        } else if (!value) {
            if (Object.keys(App.data).includes(key)) {
                // @ts-ignore
                return App.data[key];
            } else {
                return false;
            }
        } else if (typeof value !== 'undefined') {
            // @ts-ignore
            return App.data[key] = value;
        }
    },
    get: (key: string): string | null | undefined | boolean => {
        if (Object.keys(App.urlParams).includes(key)) {
            // @ts-ignore
            return App.urlParams[key];
        } else {
            return false;
        }
    }
};
