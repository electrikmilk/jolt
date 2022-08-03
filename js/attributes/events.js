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