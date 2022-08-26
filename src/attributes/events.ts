/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:34
 */

import {registerAttribute, registerReactiveAttribute} from "../attributes";
import {$} from "../helpers";

registerReactiveAttribute('click', function (value: string, node: HTMLElement) {
    makeEvent('click', value, node);
});

registerReactiveAttribute('change', function (value: string, node: HTMLElement) {
    makeEvent('change', value, node);
});

registerReactiveAttribute('toggle', function (value: string, node: HTMLElement) {
    // @ts-ignore
    if (!events.includes(value)) {
        if ($(value)) {
            node.onclick = () => {
                let node = $(value);
                if (node !== null) {
                    node.style.display = node.style.display === 'none' ? 'block' : 'none';
                }
            };
            // @ts-ignore
            events.push(value);
        } else {
            errorMsg(`[toggle] Element ${value} does not exist.`, node);
        }
    }
});

function makeEvent(type: string, value: string, node: HTMLElement) {
    if (!events.includes(node)) {
        let functionName = value.split('(')[0];
        if (!value.includes('(') && !value.includes(')')) {
            value += '()';
        }
        if (eval(`typeof instance.${functionName} === 'function'`)) {
            switch (type) {
                case 'click':
                    node.onclick = () => {
                        eval(context.join('\n') + `instance.${value}`);
                    };
                    break;
                case 'change':
                    node.onchange = () => {
                        eval(context.join('\n') + `instance.${value}`);
                    };
                    break;
            }
            events.push(node);
        } else {
            errorMsg(`[click] Function ${value} is not a registered function.`, node);
        }
    }
}