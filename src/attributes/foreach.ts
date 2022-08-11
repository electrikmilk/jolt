/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:14
 */

App.registerReactiveAttribute('foreach', function (value, node) {
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
    App.fors.push(forloop);
});
App.registerLoop(function () {
    App.fors.forEach(function (loop) {
        // @ts-ignore
        if (App.Data(loop.property) && Array.isArray(App.data[loop.property])) {
            let list = '';
            const parent = $('#' + loop.parent);
            // @ts-ignore
            App.data[loop.property].forEach(function (item) {
                // @ts-ignore
                list += loop.node.replaceAll(loop.replace, item);
            });
            // @ts-ignore
            if (parent.innerHTML !== list) {
                // @ts-ignore
                parent.innerHTML = list;
            }
        }
    });
});