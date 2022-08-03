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