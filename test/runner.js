/*global phantom */
'use strict';

var page = require('webpage').create(),
    url = 'http://localhost:3000/test/';

page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.onCallback = function (data) {
    phantom.exit(data | 0);
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
