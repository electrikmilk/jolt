/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 20:33
 */

App.registerReactiveAttribute('click', function (value: string, node: HTMLElement) {
    makeEvent('click', value, node);
});
App.registerReactiveAttribute('change', function (value: string, node: HTMLElement) {
    makeEvent('change', value, node);
});

function makeEvent(type: string, value: string, node: HTMLElement) {
    if (!App.events.includes(node)) {
        let functionName = value.split('(')[0];
        if (!value.includes('(') && !value.includes(')')) {
            value += '()';
        }
        if (eval(`typeof App.functions.${functionName} === 'function'`)) {
            switch (type) {
                case 'click':
                    node.onclick = () => {
                        eval(App.context.join('\n') + `App.functions.${value}`);
                    };
                    break;
                case 'change':
                    node.onchange = () => {
                        eval(App.context.join('\n') + `App.functions.${value}`);
                    };
                    break;
            }
            App.events.push(node);
        } else {
            App.errorMsg(`[click] Function ${value} is not a registered function.`, node);
        }
    }
}