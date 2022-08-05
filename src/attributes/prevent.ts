/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:18
 */

App.registerAttribute('prevent', function (value, node) {
    // @ts-ignore
    let prevent = node.attributes.prevent.value;
    switch (prevent) {
        case 'submit':
            node.onsubmit = function () {
                return false;
            };
            break;
    }
});