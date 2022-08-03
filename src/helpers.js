/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 17:49
 */

function $(selector) {
	let selection = document.querySelectorAll(selector);
	if (selection.length === 1) {
		return document.querySelector(selector);
	} else if (selection.length === 0) {
		return null;
	} else {
		return selection;
	}
}

function escape(unsafe) {
	if (unsafe === null) {
		return unsafe;
	}
	if (typeof unsafe !== 'string') {
		unsafe = unsafe.toString();
	}
	return unsafe.replace(/[&<"']/g, function (m) {
		switch (m) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			default:
				return '&#039;';
		}
	});
}

function getAttributes(element) {
	let attrs = [];
	for (let attr in element.attributes) {
		let attribute = element.attributes[attr].nodeName;
		if (attribute !== undefined) {
			attrs.push(attribute);
		}
	}
	return attrs;
}