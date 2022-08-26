/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/25/2022 0:0
 */

import {Random, $} from "../helpers";
import {registerReactiveTag} from "../tags";
import {registerLoop} from "../app";

let modelTags: Array<string> = [];

registerReactiveTag('model', function (node: HTMLElement) {
    if (node.id === '') {
        node.id = Random.id('id');
    }
    if (!Object.keys(modelTags).includes(node.id)) {
        if (node.innerText) {
            if (dataKeys.includes(node.innerText)) {
                // @ts-ignore
                modelTags[node.id] = node.innerText;
            } else {
                node.innerText = '';
                errorMsg(' <model> Data property \'' + node.innerText + '\' does not exist.', node);
            }
        }
    }
});

registerLoop(function () {
    for (let tag in modelTags) {
        let property = modelTags[tag];
        let tagSelect = $('#' + tag);
        if (dataKeys.includes(property) && tagSelect) {
            let modelElement = tagSelect;
            // @ts-ignore
            if (instance[property] !== null) {
                // @ts-ignore
                let value = instance[property].toString().stripTags();
                if (modelElement.innerText !== value) {
                    modelElement.innerText = value;
                }
            } else {
                modelElement.innerText = '';
            }
        }
    }
});