/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:27
 */

window.onload = () => {
    User.getAgent();
    App.start();
    App.ready();
    setInterval(function () {
        // @ts-ignore
        App.loop(document);
    }, 100);
};