/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/16/2022 22:29
 */

import {registerAttribute} from "../attributes";

registerAttribute('prevent', function (value, node) {
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