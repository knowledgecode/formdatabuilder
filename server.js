'use strict';

var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    crypto = require('crypto');

http.createServer(function (req, res) {
    var buffer = [];
    var boundary;
    var onReadable;

    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
        onReadable = function () {
            buffer.length = 0;
            req.removeListener('readable', onReadable);
        };
        req.on('readable', onReadable);
        req.on('data', function (chunk) {
            buffer.push(chunk);
        });
        req.on('end', function (err) {
            if (err) {
                throw err;
            }
            var body = Buffer.concat(buffer).toString();
            body = body.replace(new RegExp(boundary, 'g'), '').replace(/[\r\n]/g, '');
            var md5 = crypto.createHash('md5');
            md5.update(body);
            var hash = md5.digest('base64');

            res.writeHead(200, {
                'Content-Length': hash.length,
                'content-type': 'text/plain'
            });
            res.end(hash);
        });
        boundary = /(?:boundary=)(.*)$/.exec(req.headers['content-type'])[1];
        return;
    }

    var type = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript'
    };

    if (req.method.toLowerCase() === 'get') {
        var file = path.join(__dirname, req.url === '/' ? '/index.html' : req.url);

        fs.readFile(file, function (err, body) {
            if (err) {
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(200, {
                'Content-Length': body.length,
                'content-type': type[path.extname(file)] || 'text/plain'
            });
            res.end(body);
        });
        return;
    }

    res.writeHead(404);
    res.end();

}).listen(3000);
