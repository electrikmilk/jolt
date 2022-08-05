/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 20:8
 */

interface String {
    listAdd(value: string, separator?: string): string,

    listRemove(value: string, separator?: string): string,

    trimChar(char: string): string

    trimPrefix(phrase: string): string

    trimSuffix(phrase: string): string

    stripTags(): string
}

/* Strings */

String.prototype.listAdd = function (value: string, separator = ',') {
    let values = this.split(separator);
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== value) {
            values.push(value);
        }
    }
    return values.join(separator);
};

String.prototype.listRemove = function (value: string, separator = ',') {
    let values = this.split(separator);
    for (let i = 0; i < values.length; i++) {
        if (values[i] === value) {
            values.splice(i, 1);
        }
    }
    return values.join(separator);
};

String.prototype.trimChar = function (char): string {
    // @ts-ignore
    return this.toString().replaceAll(char, '');
};

String.prototype.trimPrefix = function (phrase) {
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

String.prototype.trimSuffix = function (phrase) {
    let string = this.toString().split('').reverse();
    let phraseSlice = phrase.split('').reverse();
    let hasPrefix = true;
    for (let i = 0; i < phraseSlice.length; i++) {
        if (string[i] !== phraseSlice[i]) {
            hasPrefix = false;
        }
    }
    if (hasPrefix) {
        phraseSlice.forEach(function (c, i) {
            string.splice(i, 1);
        });
    }
    return string.reverse().join('');
};

String.prototype.stripTags = function () {
    return this.toString().replace(/<\/?[^>]+(>|$)/gi, '');
};

/* Arrays */
interface Array<T> {
    end(): any

    pluck(key: string): Array<string>,

    remove(value: string): void,

    removeAll(value: string): void
}

// @ts-ignore
Array.prototype.end = () => this[this.length - 1];

Array.prototype.pluck = function (key) {
    let plucked: string[] = [];
    if (this.length !== 0) {
        this.forEach(function (array) {
            if (key in array) {
                plucked.push(array[key]);
            }
        });
    }
    return plucked;
};

Array.prototype.remove = function (value) {
    let index = this.indexOf(value);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.removeAll = function (value) {
    let i = 0;
    while (i < this.length) {
        if (this[i] === value) {
            this.splice(i, 1);
        } else {
            ++i;
        }
    }
};