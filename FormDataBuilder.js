/**
 * @preserve FormDataBuilder.js (c) 2015 KNOWLEDGECODE | MIT
 */
/*jslint plusplus: true */
/*global Blob, define */
(function (global) {
    'use strict';

    var FormDataBuilder = function () {
        this.boundary = '----WebKitFormBoundary' + Math.random().toString(36).slice(2);
        this.type = 'multipart/form-data; boundary=' + this.boundary;
        this.crlf = '\r\n';
        this.pairs = [];
    };

    FormDataBuilder.prototype.append = function (name, value) {
        var pair = {
            disposition: 'form-data; name="' + (name || '').replace(/"/g, '%22') + '"'
        };

        if (value instanceof Blob) {
            pair.disposition += '; filename="' + (value.name || 'blob').replace(/"/g, '%22') + '"';
            pair.type = value.type || 'application/octet-stream';
            pair.value = value;
        } else {
            pair.value = String(value);
        }
        this.pairs.push(pair);
    };
    FormDataBuilder.prototype.getBlob = function () {
        var array = [], i, len = this.pairs.length;

        for (i = 0; i < len; i++) {
            array.push('--' + this.boundary + this.crlf + 'Content-Disposition: ' + this.pairs[i].disposition);
            if (this.pairs[i].type) {
                array.push(this.crlf + 'Content-Type: ' + this.pairs[i].type);
            }
            array.push(this.crlf + this.crlf);
            array.push(this.pairs[i].value);
            array.push(this.crlf);
        }
        if (len) {
            array.push('--' + this.boundary + '--' + this.crlf);
        }
        return new Blob(array);
    };

    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return FormDataBuilder;
        });
    } else {
        global.FormDataBuilder = FormDataBuilder;
    }

}(this));
