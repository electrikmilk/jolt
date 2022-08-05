/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:6
 */

App.registerReactiveAttribute('html', function (value, node) {
    // @ts-ignore
    if (App.Data(value)) {
        const nonHTMLTags = [
            'INPUT',
            'TEXTAREA',
            'SELECT',
            'BUTTON'
        ];
        if (!nonHTMLTags.includes(node.nodeName)) {
            // @ts-ignore
            if (node.innerHTML !== App.data[value]) {
                // @ts-ignore
                node.innerHTML = App.data[value];
            }
        } else {
            App.errorMsg('[html] Data property \'' + value + '\' cannot be modeled as HTML because the element is a <' + node.nodeName + '> tag.', node);
        }
    } else {
        App.errorMsg('[html] Data property \'' + value + '\' does not exist.', node);
    }
});