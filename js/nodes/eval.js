App.registerNode('eval', function (node) {
	if (node.id === '') {
		node.id = App.random.id('id');
	}
	if (!Object.keys(App.evals).includes(node.id)) {
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
