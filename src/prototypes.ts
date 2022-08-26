/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/26/2022 13:36
 */

/* Strings */

declare global {
    interface String {
        toTitleCase(): string

        stripTags(): string

        trimChar(char: string): string

        trimPrefix(phrase: string): string

        trimSuffix(phrase: string): string

        listAdd(value: string, separator?: string): string

        listRemove(value: string, separator?: string): string
    }
}

String.prototype.listAdd = function (value: string, separator: string = ',') {
    let values = this.split(separator);
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== value) {
            values.push(value);
        }
    }
    return values.join(separator);
};

String.prototype.listRemove = function (value: string, separator: string = ',') {
    let values = this.split(separator);
    for (let i = 0; i < values.length; i++) {
        if (values[i] === value) {
            values.splice(i, 1);
        }
    }
    return values.join(separator);
};

String.prototype.trimChar = function (char: string): string {
    // @ts-ignore
    return this.toString().replaceAll(char, '');
};

String.prototype.trimPrefix = function (phrase: string) {
    let string = this.toString().split('');
    let phraseSlice = phrase.split('');
    let hasPrefix = true;
    for (let i = 0; i < phraseSlice.length; i++) {
        if (string[i] !== phraseSlice[i]) {
            hasPrefix = false;
        }
    }
    if (hasPrefix) {
        phraseSlice.forEach(function (c: string, i: number) {
            string.splice(i, 1);
        });
    }
    return string.join('');
};

String.prototype.trimSuffix = function (phrase: string) {
    let string = this.toString().split('').reverse();
    let phraseSlice = phrase.split('').reverse();
    let hasPrefix = true;
    for (let i = 0; i < phraseSlice.length; i++) {
        if (string[i] !== phraseSlice[i]) {
            hasPrefix = false;
        }
    }
    if (hasPrefix) {
        phraseSlice.forEach(function (c: string, i: number) {
            string.splice(i, 1);
        });
    }
    return string.reverse().join('');
};

String.prototype.stripTags = function () {
    return this.toString().replace(/<\/?[^>]+(>|$)/gi, '');
};

String.prototype.toTitleCase = function () {
    let nonTitles = ['of', 'a', 'the', 'and', 'an', 'or', 'nor', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'over', 'to', 'into', 'with'];
    let words: string[] = this.toString().split(' ');
    words.forEach(function (word: string, idx: number) {
        if (idx === 0 || !nonTitles.includes(word)) {
            words[idx] = word[0].toUpperCase() + word.substring(1, word.length);
        }
    });
    return words.join(' ')
}

/* Arrays */

Object.defineProperty(Array.prototype, 'end', {
    enumerable: false,
    value: function () {
        return this[this.length - 1];
    }
});

Object.defineProperty(Array.prototype, 'pluck', {
    enumerable: false,
    value: function (key: string) {
        let plucked: string[] = [];
        if (this.length !== 0) {
            this.forEach(function (object: Object) {
                if (key in object) {
                    // @ts-ignore
                    plucked.push(object[key]);
                }
            });
        }
        return plucked;
    }
});

Object.defineProperty(Array.prototype, 'remove', {
    enumerable: false,
    value: function (key: string) {
        this.removeByKey(key);
    }
});

Object.defineProperty(Array.prototype, 'removeByKey', {
    enumerable: false,
    value: function (key: string) {
        let index = this.indexOf(key);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
});

Object.defineProperty(Array.prototype, 'removeByValue', {
    enumerable: false,
    value: function (value: string) {
        let i = 0;
        while (i < this.length) {
            if (this[i] === value) {
                this.splice(i, 1);
            } else {
                ++i;
            }
        }
    }
});

/* Objects */

Object.defineProperty(Object.prototype, 'keysToLowerCase', {
    enumerable: false,
    value: function () {
        for (let key in this) {
            // @ts-ignore
            delete Object.assign(this, {[key.toLowerCase()]: this[key]})[key];
        }
    }
});

Object.defineProperty(Object.prototype, 'keysToUpperCase', {
    enumerable: false,
    value: function () {
        for (let key in this) {
            // @ts-ignore
            delete Object.assign(this, {[key.toUpperCase()]: this[key]})[key];
        }
    }
});

Object.defineProperty(Object.prototype, 'keysToTitleCase', {
    enumerable: false,
    value: function () {
        for (let key in this) {
            // @ts-ignore
            delete Object.assign(this, {[key.toTitleCase()]: this[key]})[key];
        }
    }
});

export {}