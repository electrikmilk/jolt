/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/16/2022 22:11
 */

import {Random} from "../helpers";
import {registerReactiveTag} from "../tags";
import {registerLoop} from "../app";

let evals: Array<string> = [];

registerReactiveTag('eval', function (node: HTMLElement) {
    if (node.id === '') {
        node.id = Random.id('id');
    }
    if (!Object.keys(evals).includes(node.id)) {
        // @ts-ignore
        evals[node.id] = node.innerText;
    }
});

registerLoop(function () {
    for (let e in evals) {
        let element = document.getElementById(e);
        if (element) {
            let result = eval(context.join('\n') + evals[e]).toString();
            if (result !== element.innerText) {
                element.innerText = result;
            }
        }
    }
});
