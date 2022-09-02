import * as Jolt from 'jolt';

Jolt.create({
	ready: function() {
		console.log('ready!');
	},
	data: {
		nav: ['item 1','item 2'],
		docs: 'https://github.com/electrikmilk/jolt/wiki',
		doList: [
			'Be easy to learn',
			'Keep things simple',
			'Memorable APIs',
			'Create abstractions that make life easier for the developer',
			'Use dependencies only when absolutely necessary',
		],
		dontList: [
			'Add unnecessary bloat that a few devs will use (DIY!)',
			'Create the next fully featured framework for huge websites',
			'Create unnecessarily complex abstractions, APIs, and tools',
			'Add bloating, unnecessary, needlessly complex dependencies',
		]
	},
	functions: {

	}
});