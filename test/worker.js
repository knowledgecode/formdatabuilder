/*global importScripts, FormDataBuilder */
'use strict';

importScripts('../formdatabuilder.js');

self.onmessage = function (evt) {
    var form = new FormDataBuilder(),
        xhr = new XMLHttpRequest();

    (evt.data.profile || []).forEach(function (profile) {
        form.append(profile.key, profile.value);
    });
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                self.postMessage({
                    id: evt.data.id,
                    body: xhr.responseText
                });
            } else {
                self.postMessage({
                    id: evt.data.id,
                    body: 'error'
                });
            }
        }
    };
    xhr.open('POST', evt.data.url, true);
    xhr.setRequestHeader('Content-Type', form.type);
    xhr.send(form.getBlob());
};
