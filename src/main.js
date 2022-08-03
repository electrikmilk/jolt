/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/2/2022 23:4
 */

window.onload = () => {
	User.getAgent();
	App.start();
	App.ready();
	setInterval(function () {
		App.loop(document);
	}, 100);
};