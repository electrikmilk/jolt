/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:9
 */

import {$} from "./helpers";
import {registerLoop} from "./app";

interface Loop {
    id: string,
    name: string,
    value: string
}

let replaces: Array<Loop> = [];

registerLoop(function() {
    for (let rep in replaces) {
        let elementID = replaces[rep].id;
        if (elementID && $(`#${elementID}`)) {
            let repString: string = replaces[rep].value;
            if (repString !== null) {
                let elementName: string = replaces[rep].name;
                let repElement = document.getElementById(elementID);
                dataKeys.forEach(function(key: string) {
                    // @ts-ignore
                    if (instance[key] !== null) {
                        // @ts-ignore
                        repString = repString.replaceAll('{' + key + '}', instance[key]);
                    }
                });
                if (repElement) {
                    if (!repElement.getAttribute(elementName) || repElement.getAttribute(elementName) !== repString) {
                        repElement.setAttribute(elementName, repString);
                    }
                }
            }
        }
    }
});