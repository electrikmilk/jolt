/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:1
 */

App.registerReactiveAttribute('toggle', function (value: string, node: HTMLElement) {
    // @ts-ignore
    if (!App.events.includes(value)) {
        if ($(value)) {
            node.onclick = () => {
                let node = $(value);
                if (node !== null) {
                    node.style.display = node.style.display === 'none' ? 'block' : 'none';
                }
            };
            // @ts-ignore
            App.events.push(value);
        } else {
            App.errorMsg(`[toggle] Element ${value} does not exist.`, node);
        }
    }
});
App.registerReactiveAttribute('if', function (value: string, node: HTMLElement) {
    if (eval(App.context.join('\n') + value) === true) {
        node.style.display = 'block';
    } else {
        node.style.display = 'none';
    }
});
App.registerReactiveAttribute('eval', function (value: string, node: HTMLElement) {
    let result = eval(App.context.join('\n') + value).toString();
    if (result !== node.innerText) {
        node.innerText = result;
    }
});