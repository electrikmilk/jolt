/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:25
 */

import {registerReactiveAttribute} from "../attributes";

registerReactiveAttribute('if', function (value: string, node: HTMLElement) {
    if (eval(context.join('\n') + value) === true) {
        node.style.display = 'block';
    } else {
        node.style.display = 'none';
    }
});

registerReactiveAttribute('eval', function (value: string, node: HTMLElement) {
    let result = eval(context.join('\n') + value).toString();
    if (result !== node.innerText) {
        node.innerText = result;
    }
});

registerReactiveAttribute('html', function (value, node) {
    if (dataKeys.includes(value)) {
        const nonHTMLTags = [
            'INPUT',
            'TEXTAREA',
            'SELECT',
            'BUTTON'
        ];
        if (!nonHTMLTags.includes(node.nodeName)) {
            // @ts-ignore
            if (node.innerHTML !== instance[value]) {
                // @ts-ignore
                node.innerHTML = instance[value];
            }
        } else {
            errorMsg('[html] Data property \'' + value + '\' cannot be modeled as HTML because the element is a <' + node.nodeName + '> tag.', node);
        }
    } else {
        errorMsg('[html] Data property \'' + value + '\' does not exist.', node);
    }
});