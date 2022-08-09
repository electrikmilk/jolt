/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/9/2022 10:5
 */

App.registerReactiveTag('eval', function (node: HTMLElement) {
    if (node.id === '') {
        node.id = App.random.id('id');
    }
    if (!Object.keys(App.evals).includes(node.id)) {
        // @ts-ignore
        App.evals[node.id] = node.innerText;
    }
});
App.registerLoop(function () {
    for (let e in App.evals) {
        let element = document.getElementById(e);
        if (element) {
            let result = eval(App.context.join('\n') + App.evals[e]).toString();
            if (result !== element.innerText) {
                element.innerText = result;
            }
        }
    }
});
