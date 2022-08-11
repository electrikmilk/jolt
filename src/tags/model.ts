/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/9/2022 10:5
 */

App.registerReactiveTag('model', function (node: HTMLElement) {
    if (node.id === '') {
        node.id = Random.id('id');
    }
    if (!Object.keys(App.modelTags).includes(node.id)) {
        if (node.innerText) {
            if (Object.keys(App.data).includes(node.innerText)) {
                // @ts-ignore
                App.modelTags[node.id] = node.innerText;
            } else {
                node.innerText = '';
                App.errorMsg(' <model> Data property \'' + node.innerText + '\' does not exist.', node);
            }
        }
    }
});
App.registerLoop(function () {
    for (let tag in App.modelTags) {
        let property = App.modelTags[tag];
        let tagSelect = $('#' + tag);
        if (Object.keys(App.data).includes(property) && tagSelect) {
            let modelElement = tagSelect;
            // @ts-ignore
            if (App.data[property] !== null) {
                // @ts-ignore
                let value = App.data[property].toString().stripTags();
                if (modelElement.innerText !== value) {
                    modelElement.innerText = value;
                }
            } else {
                modelElement.innerText = '';
            }
        }
    }
});