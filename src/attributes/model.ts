/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:32
 */

import {Random} from "../helpers";

import "./String";
import "../prototypes";
import {registerReactiveAttribute} from "../attributes";

function modelError(message: string, value: string, node: HTMLElement) {
    errorMsg(`[model="${value}"] ${message}`, node);
}

registerReactiveAttribute('model', function (value, node: HTMLElement) {
    if (!dataKeys.includes(value)) {
        modelError(`Data property '${value} does not exist.`, value, node);
    } else {
        if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
            if (node.id === '') {
                node.id = Random.id('id');
            }
            // @ts-ignore
            if (node.type !== 'checkbox' && typeof instance[value] === 'boolean') {
                modelError('Only checkboxes can model booleans.', value, node);
            }
            // @ts-ignore
            if (!events.includes(node.id)) {
                // @ts-ignore
                if (node.type === 'checkbox') {
                    node.onchange = () => {
                        // @ts-ignore
                        if (typeof instance[value] === 'boolean') {
                            // @ts-ignore
                            instance[value] = node.checked;
                        } else {
                            modelError('Checkboxes can only model booleans.', value, node);
                        }
                    };
                    // @ts-ignore
                } else if (node.type === 'range' || node.nodeName === 'SELECT') {
                    node.onchange = () => {
                        // @ts-ignore
                        let val = node.value;
                        // @ts-ignore
                        if (typeof instance[value] === 'number') {
                            if (val) {
                                val = parseInt(val);
                            } else {
                                val = 0;
                            }
                        }
                        // @ts-ignore
                        instance[value] = val;
                    };
                } else {
                    node.onkeyup = () => {
                        // @ts-ignore
                        let val = node.value;
                        // @ts-ignore
                        if (typeof instance[value] === 'number') {
                            if (val) {
                                val = parseInt(val);
                            } else {
                                val = 0;
                            }
                        }
                        // @ts-ignore
                        instance[value] = val;
                    };
                }
                // @ts-ignore
                events.push(node.id);
            }
            if (node !== document.activeElement) {
                // @ts-ignore
                if (node.type === 'checkbox') {
                    // @ts-ignore
                    if (node.checked !== instance[value]) {
                        // @ts-ignore
                        node.checked = instance[value];
                    }
                } else {
                    // @ts-ignore
                    if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
                        // @ts-ignore
                        if (node.value !== instance[value]) {
                            // @ts-ignore
                            node.value = instance[value];
                        }
                    }
                }
            }
        } else {
            // @ts-ignore
            let dataValue = instance[value];
            if (dataValue !== null && dataValue !== false) {
                if (Array.isArray(dataValue)) {
                    if (node.nodeName === 'UL' || node.nodeName === 'OL') {
                        let list: string = '<li>' + dataValue.join('</li><li>') + '</li>';
                        if (node.innerHTML !== list) {
                            node.innerHTML = list;
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
                                if (item === null) {
                                    table += '<td></td>';
                                } else if (item.constructor === Object) {
                                    // @ts-ignore
                                    Object.values(item).forEach(function (cell: string) {
                                        table += '<td>' + cell.toString().stripTags() + '</td>';
                                    });
                                } else {
                                    table += '<td>' + item.toString() + '</td>';
                                }
                                table += '</tr>';
                            });
                            table += '</tbody>';
                        } else {
                            table = '<tbody>';
                            dataValue.forEach(function (item) {
                                if (Array.isArray(item)) {
                                    table += '<tr>';
                                    item.forEach(function (arrayItem) {
                                        table += '<td>' + arrayItem + '</td>';
                                    })
                                    table += '</tr>';
                                } else {
                                    table += '<tr><td>' + item + '</td></tr>';
                                }
                            });
                            table += '</tbody>';
                        }
                        if (node.innerHTML !== table) {
                            node.innerHTML = table;
                        }
                    }
                } else if (dataValue.constructor && dataValue.constructor === Object) {
                    if (node.nodeName === 'TABLE') {
                        let table = '<tbody>';
                        for (let key in dataValue) {
                            let columnValue = dataValue[key];
                            if (Array.isArray(dataValue[key])) {
                                columnValue = dataValue[key].join(', ');
                            }
                            if (columnValue !== null) {
                                columnValue = columnValue.toString().stripTags();
                            }
                            table += `<tr><td>${key.stripTags()}</td><td>` + columnValue + `</td></tr>`;
                        }
                        table += '</tbody>';
                        if (node.innerHTML !== table) {
                            node.innerHTML = table;
                        }
                    } else if (node.nodeName === 'UL' || node.nodeName === 'OL') {
                        let list: string = buildList(node.nodeName,dataValue);
                        if (node.innerHTML !== list) {
                            node.innerHTML = list;
                        }
                    }
                } else if (node.innerText !== dataValue.toString()) {
                    node.innerText = dataValue;
                }
            } else if (node.innerText !== dataValue) {
                node.innerText = dataValue;
            }
        }
    }
});

function buildList(nodeName: string, dataValue: Array<any>): string {
    nodeName = nodeName.toLowerCase();
    let list = '';
    for (let item in dataValue) {
        if(dataValue[item] && dataValue[item].constructor !== Object && !Array.isArray(dataValue[item])) {
            list += `<li><strong>${item}:</strong> ${dataValue[item]}`
        } else {
            list += `<li>${item}`
        }
        if (dataValue[item].constructor && dataValue[item].constructor === Object) {
            list += `<${nodeName}>` + buildList(nodeName, dataValue[item]) + `</${nodeName}>`;
        } else if (Array.isArray(dataValue[item])) {
            list += `<${nodeName}>`;
            dataValue[item].forEach((subitem: any) => {
                list += `<li>${subitem}</li>`;
            })
            list += `</${nodeName}>`;
        }
        list += '</li>';
    }
    return list;
}
