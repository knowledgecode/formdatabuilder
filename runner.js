/*global phantom */
'use strict';

var page = require('webpage').create(),
    url = 'http://localhost:3000/';

page.onConsoleMessage = function(msg) {
    switch (msg) {
    case 'exit 0':
        phantom.exit(0);
        break;
    case 'exit 1':
        phantom.exit(1);
        break;
    default:
        console.log(msg);
    }
};

page.open(url, function (status) {
    if (status !== 'success') {
        return phantom.exit(1);
    }
    page.uploadFile('#photo1', 'photo1.jpg');
    page.uploadFile('#photo2', 'photo2.jpg');
    page.evaluate(function () {
        var evt = document.createEvent('Event');

        document.getElementById('name').value = 'John Smith';
        document.getElementById('email').value = 'john@example.com';
        evt.initEvent('click', true, true);
        document.getElementById('button').dispatchEvent(evt);
    });
});
