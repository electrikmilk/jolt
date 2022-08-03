/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 17:45
 */

App.registerNode('model', function (node) {
	if (node.id === '') {
		node.id = App.random.id('id');
	}
	if (!App.modelTags[node.id]) {
		if (node.innerText) {
			if (Object.keys(App.data).includes(node.innerText)) {
				App.modelTags[node.id] = node.innerText;
			} else {
				node.innerText = '';
				App.error(' <model> Data property \'' + node.innerText + '\' does not exist.', node);
			}
		}
	}
});
App.registerLoop(function () {
	for (let tag in App.modelTags) {
		let property = App.modelTags[tag];
		if (Object.keys(App.data).includes(property) && $('#' + tag)) {
			let modelElement = $('#' + tag);
			if (modelElement.innerText !== escape(App.data[property])) {
				modelElement.innerText = App.data[property];
			}
		}
	}
});