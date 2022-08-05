/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:10
 */

App.registerReactiveAttribute('model', function (value, node: HTMLElement) {
    if (Object.keys(App.data).includes(value)) {
        if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
            if (node.id === '') {
                node.id = App.random.id('id');
            }
            // @ts-ignore
            if (node.type !== 'checkbox' && typeof App.data[value] === 'boolean') {
                App.errorMsg('Only checkbox and radio inputs can model booleans', node);
            }
            // @ts-ignore
            if (!App.events.includes(node.id)) {
                // @ts-ignore
                if (node.type === 'checkbox') {
                    // @ts-ignore
                    if (typeof App.data[value] === 'boolean') {
                        node.onchange = () => {
                            // @ts-ignore
                            App.data[value] = node.checked;
                        };
                    } else {
                        App.errorMsg('Checkbox inputs can only model booleans', node);
                    }
                    // @ts-ignore
                } else if (node.type === 'range' || node.nodeName === 'SELECT') {
                    node.onchange = () => {
                        // @ts-ignore
                        let val = node.value;
                        // @ts-ignore
                        if (typeof App.data[value] === 'number') {
                            if (val) {
                                val = parseInt(val);
                            } else {
                                val = 0;
                            }
                        }
                        // @ts-ignore
                        App.data[value] = val;
                    };
                } else {
                    node.onkeyup = () => {
                        // @ts-ignore
                        let val = node.value;
                        // @ts-ignore
                        if (typeof App.data[value] === 'number') {
                            if (val) {
                                val = parseInt(val);
                            } else {
                                val = 0;
                            }
                        }
                        // @ts-ignore
                        App.data[value] = val;
                    };
                }
                // @ts-ignore
                App.events.push(node.id);
            }
            if (node !== document.activeElement) {
                // @ts-ignore
                if (node.type === 'checkbox') {
                    // @ts-ignore
                    if (node.checked !== App.data[value]) {
                        // @ts-ignore
                        node.checked = App.data[value];
                    }
                } else {
                    // @ts-ignore
                    if (node.type === 'text' || node.type === 'range' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
                        // @ts-ignore
                        if (node.value !== App.data[value]) {
                            // @ts-ignore
                            node.value = App.data[value];
                        }
                    }
                }
            }
        } else {
            // @ts-ignore
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
                                // @ts-ignore
                                Object.values(item).forEach(function (cell: string) {
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
        App.errorMsg('[model] Data property \'' + value + '\' does not exist.', node);
    }
});