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
		if (Object.keys(App.data).includes(property) && document.querySelector('#' + tag)) {
			let modelElement = document.querySelector('#' + tag);
			if (modelElement.innerText !== escape(App.data[property])) {
				modelElement.innerText = App.data[property];
			}
		}
	}
});