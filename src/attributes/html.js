/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/2/2022 23:4
 */

App.registerReactiveAttribute('html', function (value, node) {
	if (App.Data(value)) {
		const nonHTMLTags = [
			'INPUT',
			'TEXTAREA',
			'SELECT',
			'BUTTON'
		];
		if (!nonHTMLTags.includes(node.nodeName)) {
			if (node.innerHTML !== App.data[value]) {
				node.innerHTML = App.data[value];
			}
		} else {
			App.error('[html] Data property \'' + value + '\' cannot be modeled as HTML because the element is a <' + node.nodeName + '> tag.', node);
		}
	} else {
		App.error('[html] Data property \'' + value + '\' does not exist.', node);
	}
});