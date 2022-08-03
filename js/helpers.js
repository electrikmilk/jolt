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