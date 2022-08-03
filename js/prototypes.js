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
