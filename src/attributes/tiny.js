/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/2/2022 23:4
 */

App.registerReactiveAttribute('toggle', function (value, node) {
	if (!App.events.includes(value)) {
		if (document.querySelector(value).length !== 0) {
			node.onclick = () => {
				if (document.querySelector(value).length !== 0) {
					document.querySelector(value).style.display = document.querySelector(value).style.display === 'none' ? 'block' : 'none';
				}
			};
			App.events.push(value);
		} else {
			App.error(`[toggle] Element ${value} does not exist.`, node);
		}
	}
});
App.registerReactiveAttribute('if', function (value, node) {
	if (eval(App.context.join('\n') + value) === true) {
		node.style.display = 'block';
	} else {
		node.style.display = 'none';
	}
});
App.registerReactiveAttribute('eval', function (value, node) {
	let result = eval(App.context.join('\n') + value).toString();
	if (result !== node.innerText) {
		node.innerText = result;
	}
});