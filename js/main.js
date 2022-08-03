window.onload = () => {
	User.getAgent();
	App.start();
	App.ready();
	setInterval(function () {
		App.loop(document);
	}, 100);
};