/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 17:45
 */

App.registerReactiveAttribute('foreach', function (value, node) {
	let copyNode = node;
	if (node.parentNode.id === '') {
		node.parentNode.id = App.random.id('id');
	}
	let parentID = node.parentNode.id;
	node.parentNode.innerHTML = '';
	node.remove();
	let expression = copyNode.attributes.foreach.nodeValue.split(' in ');
	copyNode.removeAttribute('foreach');
	let forloop = {
		node: copyNode.outerHTML,
		replace: '{' + expression[0] + '}',
		parent: parentID,
		property: expression[1],
		items: []
	};
	App.fors.push(forloop);
});
App.registerLoop(function () {
	App.fors.forEach(function (loop) {
		if (App.Data(loop.property) && Array.isArray(App.data[loop.property])) {
			let list = '';
			const parent = $('#' + loop.parent);
			App.data[loop.property].forEach(function (item) {
				list += loop.node.replaceAll(loop.replace, item);
			});
			if (parent.innerHTML !== list) {
				parent.innerHTML = list;
			}
		}
	});
});