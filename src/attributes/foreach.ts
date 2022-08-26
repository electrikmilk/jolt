/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/16/2022 22:39
 */

import {$} from "../helpers";
import {registerReactiveAttribute} from "../attributes";
import {registerLoop} from "../app";

interface For {
    node: string,
    replace: string,
    parent: string,
    property: string,
    items: Array<any>
}

let fors: Array<For> = [];

registerReactiveAttribute('foreach', function (value, node) {
    let copyNode = node;
    // @ts-ignore
    if (node.parentNode.id === '') {
        // @ts-ignore
        node.parentNode.id = Random.id('id');
    }
    // @ts-ignore
    let parentID = node.parentNode.id;
    // @ts-ignore
    node.parentNode.innerHTML = '';
    node.remove();
    // @ts-ignore
    let expression = copyNode.attributes.foreach.nodeValue.split(' in ');
    copyNode.removeAttribute('foreach');
    let forloop = {
        node: copyNode.outerHTML,
        replace: '{' + expression[0] + '}',
        parent: parentID,
        property: expression[1],
        items: []
    };
    fors.push(forloop);
});

registerLoop(function () {
    fors.forEach(function (forloop) {
        // @ts-ignore
        if (dataKeys.includes(forloop.property) && Array.isArray(instance[forloop.property])) {
            let list = '';
            const parent = $('#' + forloop.parent);
            // @ts-ignore
            instance[forloop.property].forEach(function (item) {
                // @ts-ignore
                list += forloop.node.replaceAll(forloop.replace, item);
            });
            // @ts-ignore
            if (parent.innerHTML !== list) {
                // @ts-ignore
                parent.innerHTML = list;
            }
        }
    });
});