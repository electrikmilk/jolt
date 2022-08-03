/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/2/2022 23:4
 */

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