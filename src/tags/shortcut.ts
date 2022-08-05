/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:23
 */

App.registerTag('shortcut', (element: HTMLElement) => {
    if (element.innerText) {
        if (User.platform.name !== 'windows' && User.platform.name !== 'macos') {
            element.innerHTML = makeShortcut(element.innerText, 'windows') + ' on Windows or ' + makeShortcut(element.innerText, 'macos') + ' on macOS';
        } else {
            element.innerHTML = makeShortcut(element.innerText);
        }
    }
});

function makeShortcut(shortcut: string, platform?: string) {
    if (typeof platform === 'undefined') {
        platform = User.platform.name;
    }
    let platformSymbols = {
        'macos': {
            'cmd': '&#8984;',
            'opt': '&#8997;',
            'delete': '&#9003;',
            'esc': '&#9099;',
            'return': '&#9166;'
        },
        'windows': {
            'enter': '&#9166;'
        }
    };
    let symbols = {
        'ctrl': '&#8963;',
        'shift': '&#8679;',
        'up': '&uarr;',
        'left': '&larr;',
        'right': '&rarr;',
        'down': '&darr;'
    };
    let keys: Array<string> = [];
    shortcut
        .replace(' ', '')
        .trim()
        .split('+')
        .forEach(function (shortcutKey) {
            shortcutKey = shortcutKey.trim().stripTags();
            if (shortcutKey === 'super') {
                if (platform === 'windows') {
                    shortcutKey = 'ctrl';
                } else if (platform === 'macos') {
                    shortcutKey = 'cmd';
                }
            } else if (shortcutKey === 'control') {
                shortcutKey = 'ctrl';
            } else if (shortcutKey === 'command') {
                shortcutKey = 'cmd';
            } else if (shortcutKey === 'option') {
                shortcutKey = 'opt';
            } else if (shortcutKey === 'escape') {
                shortcutKey = 'esc';
            } else if (shortcutKey === 'alt' && platform === 'macos') {
                shortcutKey = 'opt';
            } else if (shortcutKey === 'enter' || shortcutKey === 'return') {
                if (platform === 'windows') {
                    shortcutKey = 'enter';
                } else if (platform === 'macos') {
                    shortcutKey = 'return';
                }
            }
            // @ts-ignore
            let platformSymbol = platformSymbols[platform][shortcutKey];
            if (platformSymbol) {
                shortcutKey = `${platformSymbol} ${shortcutKey}`;
            }
            // @ts-ignore
            let symbol = symbols[shortcutKey];
            if (symbol) {
                shortcutKey = `${symbol} ${shortcutKey}`;
            }
            keys.push(shortcutKey);
        });
    return '<kbd>' + keys.join('</kbd> + <kbd>') + '</kbd>';
}