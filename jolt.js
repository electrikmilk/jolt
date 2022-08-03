/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: August 2, 2022 at 22:37
 */

let App = {
	data: {},
	errorNodes: [],
	functions: [],
	events: [],
	fors: [],
	loops: [],
	tags: [],
	nodes: [],
	evals: [],
	reactiveAttributes: [], // reactive
	attributes: [], // static
	replaces: [],
	modelTags: [],
	context: [],
	ready: () => null,
	start: () => {
		App.tags.forEach(function (tag) {
			const tags = document.querySelectorAll(tag.name);
			if (tags && tags.length !== 0) {
				tags.forEach(function (element) {
					tag.callback(element);
				});
			}
		});
		App.attributes.forEach(function (attr) {
			const tags = document.querySelectorAll('[' + attr.name + ']');
			if (tags && tags.length !== 0) {
				tags.forEach(function (element) {
					tag.callback(element);
				});
			}
		});
	},
	create: function (obj) {
		if (obj.ready && typeof obj.ready === 'function') {
			this.ready = obj.ready;
		}
		if (obj.data && typeof obj.data === 'object') {
			this.data = obj.data;
		}
		if (obj.functions && typeof obj.functions === 'object') {
			this.functions = obj.functions;
		}
	},
	error: function (message, node) {
		if (node) {
			this.errorNodes.push(node);
		}
		if (message.stack) {
			console.error(`[Framework] ${message}`, node, message.stack);
		} else {
			console.trace(`[Framework] ${message}`, node);
		}
	},
	replacers: function () {
		for (rep in this.replaces) {
			let elementID = this.replaces[rep].id;
			if (document.getElementById(elementID)) {
				let repString = this.replaces[rep].value;
				let elementName = this.replaces[rep].name;
				let repElement = document.getElementById(elementID);
				for (key in this.data) {
					if (this.data[key] !== null) {
						repString = repString.replaceAll('{' + key + '}', this.data[key].toString().stripTags());
					}
				}
				if (!repElement.getAttribute(elementName) || repElement.getAttribute(elementName) !== repString) {
					repElement.setAttribute(elementName, repString);
				}
			}
		}
	},
	buildContext: function () {
		let dataKeys = Object.keys(this.data);
		this.context = [];
		dataKeys.forEach(function (key) {
			let keyValue = App.data[key];
			if (Array.isArray(keyValue)) {
				let arrayValues = [];
				keyValue.forEach(function (item) {
					if (typeof item === 'string') {
						arrayValues.push(`"${item}"`);
					}
				});
				keyValue = '[' + arrayValues.join(',') + ']';
			} else if (typeof keyValue === 'object') {
				keyValue = JSON.stringify(keyValue);
			} else if (typeof keyValue === 'string') {
				keyValue = `"${keyValue}"`;
			}
			App.context.push(`let ${key} = ${keyValue};`);
		});
	},
	loop: function (node) {
		if (!this.errorNodes.includes(node)) {
			try {
				this.replacers();
				this.loops.forEach(callback => callback());
				if (Object.keys(this.nodes).includes(node.nodeName)) {
					this.nodes[node.nodeName](node);
				}
				if (node.attributes) {
					if (node.attributes.length !== 0) {
						this.buildContext();
						let attrs = getAttributes(node);
						if (attrs.includes('model') && attrs.includes('eval')) {
							this.error('Do not use model and eval attributes on the same element!', node);
						}
						for (let attr in node.attributes) {
							let attribute = node.attributes[attr].nodeName;
							if (attribute === undefined) {
								continue;
							}
							let value = node.attributes[attr].nodeValue;
							let attributeName = attribute.toLowerCase();
							if (Object.keys(this.reactiveAttributes).includes(attributeName)) {
								this.reactiveAttributes[attributeName](value, node);
							}
							if (attribute.split('')[0] === '.') {
								if (node.id === '') {
									node.id = App.random.id('id');
								}
								App.replaces[App.random.id()] = {
									id: node.id,
									name: attribute.trimPrefix('.'),
									value: value
								};
								node.removeAttribute(attribute);
							}
						}
					}
				}
			} catch (err) {
				this.error(err, node);
			}
		}
		let nodes = node.childNodes;
		for (let i = 0; i < nodes.length; i++) {
			if (!nodes[i]) {
				continue;
			}
			if (nodes[i].childNodes) {
				this.loop(nodes[i]);
			}
		}
	},
	registerReactiveAttribute: function (attribute, callback) {
		attribute = attribute.toLowerCase();
		if (!this.reactiveAttributes.includes(attribute)) {
			this.reactiveAttributes[attribute] = callback;
		}
	},
	registerAttribute: function (attribute, callback) {
		attribute = attribute.toLowerCase();
		if (!this.attributes.includes(attribute)) {
			this.attributes[attribute] = callback;
		}
	},
	registerNode: function (nodeName, callback) {
		nodeName = nodeName.toUpperCase();
		if (!this.nodes.includes(nodeName)) {
			this.nodes[nodeName] = callback;
		}
	},
	registerTag: function (tagName, callback) {
		this.tags.push({name: tagName, callback: callback});
	},
	registerLoop: function (callback) {
		this.loops.push(callback);
	},
	Data: function (key, value) {
		if (key.constructor === Object) {
			for (k in key) {
				App.data[k] = key[k];
			}
		} else {
			if (value) {
				return App.data[key] = value;
			} else {
				if (Object.keys(this.data).includes(key)) {
					return App.data[key];
				} else {
					return false;
				}
			}
		}
	},
	random: {
		id: (prefix = null) => {
			let S4 = () => {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return prefix + (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
		},
		number: (max) => {
			return Math.floor(Math.random() * max);
		}
	}
};
/* attributes */
App.registerReactiveAttribute('click', function (value, node) {
	makeEvent('click',value,node);
});
App.registerReactiveAttribute('change', function (value, node) {
	makeEvent('change',value,node);
});
function makeEvent(type,value,node) {
	if (!App.events.includes(node)) {
		let functionName = value.split('(')[0];
		if (!value.includes('(') && !value.includes(')')) {
			value += '()';
		}
		if (eval(`typeof App.functions.${functionName} === 'function'`)) {
			switch(type) {
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
			App.error(`[click] Function ${value} is not a registered function.`, node);
		}
	}
}
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
			const parent = document.querySelector('#' + loop.parent);
			App.data[loop.property].forEach(function (item) {
				list += loop.node.replaceAll(loop.replace, item);
			});
			if (parent.innerHTML !== list) {
				parent.innerHTML = list;
			}
		}
	});
});
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
App.registerReactiveAttribute('model', function (value, node) {
	if (Object.keys(App.data).includes(value)) {
		if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
			if (node.id === '') {
				node.id = App.random.id('id');
			}
			if (node.type !== 'checkbox' && typeof App.data[value] === 'boolean') {
				App.error('Only checkbox and radio inputs can model booleans', node);
			}
			if (!App.events.includes(node.id)) {
				if (node.type === 'checkbox') {
					if (typeof App.data[value] === 'boolean') {
						node.onchange = () => {
							App.data[value] = node.checked;
						};
					} else {
						App.error('Checkbox inputs can only model booleans', node);
					}
				} else if (node.type === 'range' || node.nodeName === 'SELECT') {
					node.onchange = () => {
						let val = node.value;
						if (typeof App.data[value] === 'number') {
							if (val) {
								val = parseInt(val);
							} else {
								val = 0;
							}
						}
						App.data[value] = val;
					};
				} else {
					node.onkeyup = () => {
						let val = node.value;
						if (typeof App.data[value] === 'number') {
							if (val) {
								val = parseInt(val);
							} else {
								val = 0;
							}
						}
						App.data[value] = val;
					};
				}
				App.events.push(node.id);
			}
			if (node !== document.activeElement) {
				if (node.type === 'checkbox') {
					if (node.checked !== App.data[value]) {
						node.checked = App.data[value];
					}
				} else {
					if (node.type === 'text' || node.type === 'range' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
						if (node.value !== App.data[value]) {
							node.value = App.data[value];
						}
					}
				}
			}
		} else {
			let dataValue = App.data[value];
			if (dataValue === null) {
			} else if (Array.isArray(dataValue)) {
				if (node.nodeName === 'UL' || node.nodeName === 'OL') {
					let list = '<li>' + dataValue.join('</li><li>') + '</li>';
					if (node.innerHTML !== list) {
						node.innerHTML = '';
						dataValue.forEach(function (item) {
							let listItem = document.createElement('li');
							listItem.innerText = item;
							node.appendChild(listItem);
						});
					}
				} else if (node.nodeName === 'TABLE') {
					let table = '';
					let arrayOfObjects = false;
					dataValue.forEach(function (item) {
						if (item.constructor === Object) {
							arrayOfObjects = true;
						}
					});
					if (arrayOfObjects) {
						table = '<thead><tr>';
						let headers = Object.keys(dataValue[0]);
						headers.forEach(function (header) {
							table += '<th>' + header.stripTags() + '</th>';
						});
						table += '</tr></thead><tbody>';
						dataValue.forEach(function (item) {
							table += '<tr>';
							if (item.constructor === Object) {
								Object.values(item).forEach(function (cell) {
									table += '<td>' + cell.toString().stripTags() + '</td>';
								});
							}
							table += '</tr>';
						});
						table += '</tbody>';
					} else {
						// TODO: other types of arrays
					}
					if (node.innerHTML !== table) {
						node.innerHTML = table;
					}
				}
			} else if (dataValue.constructor === Object) {
				if (node.nodeName === 'TABLE') {
					let table = '<tbody>';
					for (let key in dataValue) {
						let columnValue = dataValue[key];
						if (Array.isArray(dataValue[key])) {
							columnValue = dataValue[key].join(', ');
						}
						table += `<tr><td>${key.stripTags()}</td><td>` + columnValue.toString().stripTags() + `</td></tr>`;
					}
					table += '</tbody>';
					if (node.innerHTML !== table) {
						node.innerHTML = table;
					}
				}
			} else {
				if (node.innerText !== dataValue.toString()) {
					node.innerText = dataValue;
				}
			}
		}
	} else {
		App.error('[model] Data property \'' + value + '\' does not exist.', node);
	}
});
App.registerAttribute('prevent', function (element) {
	let prevent = element.attributes.prevent.value;
	switch (prevent) {
		case 'submit':
			element.onsubmit = function () {
				return false;
			};
			break;
	}
});
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
window.onload = () => {
	User.getAgent();
	App.start();
	App.ready();
	setInterval(function () {
		App.loop(document);
	}, 100);
};
/* nodes */
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
/* Strings */
String.prototype.listAdd = function (value, separator = ',') {
	let values = this.split(separator);
	for (let i = 0; i < values.length; i++) {
		if (values[i] !== value) {
			values.push(value);
			return values.join(separator);
		}
	}
};
String.prototype.listRemove = function (value, separator = ',') {
	let values = this.split(separator);
	for (let i = 0; i < values.length; i++) {
		if (values[i] === value) {
			values.splice(i, 1);
			return values.join(separator);
		}
	}
};
String.prototype.trimChar = function (char) {
	this.toString().replace(char, '');
};
String.prototype.trimPrefix = function (phrase) {
	let string = this.toString().split('');
	phrase = phrase.split('');
	let hasPrefix = true;
	for (let i = 0; i < phrase.length; i++) {
		if (string[i] !== phrase[i]) {
			hasPrefix = false;
		}
	}
	if (hasPrefix === true) {
		phrase.forEach(function (c, i) {
			string.splice(i, 1);
		});
	}
	return string.join('');
};
String.prototype.trimSuffix = function (phrase) {
	let string = this.toString().split('').reverse();
	phrase = phrase.split('').reverse();
	let hasPrefix = true;
	for (let i = 0; i < phrase.length; i++) {
		if (string[i] !== phrase[i]) {
			hasPrefix = false;
		}
	}
	if (hasPrefix === true) {
		phrase.forEach(function (c, i) {
			string.splice(i, 1);
		});
	}
	return string.reverse().join('');
};
String.prototype.stripTags = function () {
	return this.toString().replace(/<\/?[^>]+(>|$)/gi, '');
};
String.prototype.stripTagsExcept = function (allowed) {
	let regExp = /<\/?[^>]+(>|$)/g;
	let str = this.toString();
	if (!allowed) {
		return str.replace(regExp, '');
	}
	allowed = allowed.split(',');
	let matches = str.match(regExp);
	matches.forEach(function (match) {
		tag = match.match(/<(.*?)>/g)[0];
		if (!allowed.includes(tag)) {
		}
	});
};
/* Arrays */
Array.prototype.end = () => this[this.length - 1];
Array.prototype.pluck = function (key) {
	let plucked = [];
	if (this.length !== 0) {
		this.forEach(function (array) {
			if (key in array) {
				plucked.push(array[key]);
			}
		});
	}
	return plucked;
};
Array.prototype.remove = function (value) {
	let index = this.indexOf(value);
	if (index > -1) {
		this.splice(index, 1);
	}
};
Array.prototype.removeAll = function (value) {
	let i = 0;
	while (i < this.length) {
		if (this[i] === value) {
			this.splice(i, 1);
		} else {
			++i;
		}
	}
};
/* tags */
App.registerTag('shortcut', (element) => {
	if (element.innerText) {
		if (User.platform.name !== 'windows' && User.platform.name !== 'macos') {
			element.innerHTML = makeShortcut(element.innerText, 'windows') + ' on Windows or ' + makeShortcut(element.innerText, 'macos') + ' on macOS';
		} else {
			element.innerHTML = makeShortcut(element.innerText, User.platform.name);
		}
	}
});
function makeShortcut(shortcut, platform) {
	let platformSymbols = {
		'macos': {
			'cmd': '&#8984;',
			'opt': '&#8997;',
			'delete': '&#9003;',
			'esc': '&#9099;',
			'return': '&#9166;'
		},
		'windows': {
			'enter': '&#9166;'
		}
	};
	let symbols = {
		'ctrl': '&#8963;',
		'shift': '&#8679;',
		'up': '&uarr;',
		'left': '&larr;',
		'right': '&rarr;',
		'down': '&darr;'
	};
	let keys = [];
	shortcut
		.replace(' ', '')
		.trim()
		.split('+')
		.forEach(function (shortcutKey) {
			shortcutKey = shortcutKey.trim().stripTags();
			if (shortcutKey === 'super') {
				if (platform === 'windows') {
					shortcutKey = 'ctrl';
				} else if (platform === 'macos') {
					shortcutKey = 'cmd';
				}
			} else if (shortcutKey === 'control') {
				shortcutKey = 'ctrl';
			} else if (shortcutKey === 'command') {
				shortcutKey = 'cmd';
			} else if (shortcutKey === 'option') {
				shortcutKey = 'opt';
			} else if (shortcutKey === 'escape') {
				shortcutKey = 'esc';
			} else if (shortcutKey === 'alt' && User.platform.name === 'macos') {
				shortcutKey = 'opt';
			} else if (shortcutKey === 'enter' || shortcutKey === 'return') {
				if (platform === 'windows') {
					shortcutKey = 'enter';
				} else if (platform === 'macos') {
					shortcutKey = 'return';
				}
			}
			let platformSymbol = platformSymbols[User.platform.name][shortcutKey];
			if (platformSymbol) {
				shortcutKey = `${platformSymbol} ${shortcutKey}`;
			}
			let symbol = symbols[shortcutKey];
			if (symbol) {
				shortcutKey = `${symbol} ${shortcutKey}`;
			}
			keys.push(shortcutKey);
		});
	return '<kbd>' + keys.join('</kbd> + <kbd>') + '</kbd>';
}
let User = {
	language: navigator.language,
	browser: {name: null, version: null, fullVersion: null, headless: false, webview: false, bot: false},
	engine: {name: null, version: null, fullVersion: null},
	platform: {name: null, mobile: null, version: null},
	getAgent: function () {
		const userAgent = navigator.userAgent;
		/* headless */
		User.browser.headless = !!userAgent.includes('Headless');
		/* bots/crawlers/spiders */
		let hiddenBots = [
			'addthis.com',
			'Mediapartners-Google',
			'newspaper/0.2.8',
			'zgrab',
			'ggpht.com',
			'naver.me',
			'admantx.com',
			'BingPreview',
			'facebookexternalhit',
			'Daum/'
		];
		hiddenBots.forEach(function (bot) {
			User.browser.bot = !!userAgent.includes(bot);
		});
		User.browser.bot = !!(userAgent.includes('bot') || userAgent.includes('spider'));
		// Use modern navigator.userAgentData if available
		if (navigator.userAgentData) {
			const userAgentData = navigator.userAgentData;
			if (userAgentData.brands[1]) {
				this.browser.name = userAgentData.brands[1].brand;
				this.browser.version = userAgentData.brands[1].version;
			}
			if (userAgentData.brands[2]) {
				this.engine.name = userAgentData.brands[2].brand;
				this.engine.version = userAgentData.brands[2].version;
			}
			this.platform.name = userAgentData.platform.toLowerCase();
			this.platform.mobile = userAgentData.mobile;
			switch (this.browser.name) {
				case 'Google Chrome':
					this.browser.name = 'chrome';
			}
			switch (this.engine.name) {
				case 'Chromium':
					this.engine.name = 'blink';
			}
		} else {
			this.oldUserAgent();
		}
	},
	oldUserAgent: function () {
		const userAgent = navigator.userAgent;
		/* browser */
		if (userAgent.includes('Edge/') || userAgent.includes('Edg/')) {
			User.browser.name = 'edge';
		} else if (userAgent.includes('OPR/')) {
			User.browser.name = 'opera';
		} else if (userAgent.includes('Chrome/')) {
			User.browser.name = 'chrome';
		} else if (userAgent.includes('Macintosh;') && userAgent.includes('AppleWebKit/')) {
			let version = this.parseVersion('Version');
			User.browser.name = 'safari';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Safari/') && userAgent.includes('AppleWebKit/')) {
			let version = this.parseVersion('Version');
			User.browser.name = 'safari';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('iPhone OS')) {
			let version = this.parseVersion('AppleWebKit');
			User.browser.name = 'safari';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Waterfox/')) {
			let version = this.parseVersion('Waterfox');
			User.browser.name = 'waterfox';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Firefox/')) {
			let version = this.parseVersion('Firefox');
			User.browser.name = 'firefox';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Trident/') && userAgent.includes('MSIE')) {
			User.browser.name = 'ie';
		}
		/* engine */
		if (userAgent.includes('Edge')) {
			let version = this.parseVersion('Edge');
			User.engine.name = 'edgeHTML';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Edg')) {
			let version = this.parseVersion('Edg');
			User.engine.name = 'blink';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Chrome')) {
			let version = this.parseVersion('Chrome');
			User.engine.name = 'blink';
			User.browser.version = version.version;
			User.browser.fullVersion = version.fullVersion;
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if ((userAgent.includes('AppleWebKit') && userAgent.includes('Macintosh')) || userAgent.includes('iPhone OS')) {
			let version = this.parseVersion('AppleWebKit');
			User.engine.name = 'webkit';
			User.engine.version = version.version;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Gecko')) {
			let version = this.parseVersion('Gecko');
			User.engine.name = 'gecko';
			User.engine.version = version.fullVersion;
			User.engine.fullVersion = version.fullVersion;
		} else if (userAgent.includes('Trident')) {
			let version = this.parseVersion('Trident');
			User.engine.name = 'trident';
			User.engine.version = version.fullVersion;
			User.engine.fullVersion = version.fullVersion;
		}
		/* platform */
		if (userAgent.includes('Windows NT')) {
			User.platform.name = 'windows';
			User.platform.mobile = false;
		} else if (userAgent.includes('Macintosh')) {
			User.platform.name = 'macos';
			User.platform.mobile = false;
		} else if (userAgent.includes('iPhone OS')) {
			User.platform.name = 'ios';
			User.platform.mobile = true;
			User.browser.webview = !!userAgent.includes('WKWebView');
		} else if (userAgent.includes('Android')) {
			User.platform.name = 'android';
			User.platform.mobile = true;
			User.browser.webview = !!userAgent.includes('; wv)');
		} else if (userAgent.includes('Linux')) {
			User.platform.name = 'linux';
			User.platform.mobile = false;
		}
		if (User.platform.mobile === false && userAgent.includes('Mobile')) {
			User.platform.mobile = true;
		}
		if (userAgent.includes('Android')) {
			User.platform.version = userAgent.split(' Android ')[1].split(';')[0].trim();
		} else if (userAgent.includes('iPhone OS')) {
			User.platform.version = userAgent.split(' iPhone OS ')[1].split('like')[0].replaceAll('_', '.').trim();
		} else if (userAgent.includes('Mac OS X')) {
			User.platform.version = userAgent.split(' X ')[1].split(')')[0].replaceAll('_', '.').trim();
		} else if (userAgent.includes('Windows NT')) {
			User.platform.version = userAgent.split('Windows NT ')[1].split(';')[0].trim();
		}
	},
	parseVersion(keyword) {
		let ver = navigator.userAgent.split(keyword + '/')[1].split(' ')[0];
		let version = ver.split('.')[0];
		return {
			version: version,
			fullVersion: ver
		};
	}
};
