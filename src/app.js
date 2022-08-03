/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 17:45
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
			const tags = $(tag.name);
			if (tags && tags.length !== 0) {
				tags.forEach(function (element) {
					tag.callback(element);
				});
			}
		});
		App.attributes.forEach(function (attr) {
			const tags = $('[' + attr.name + ']');
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