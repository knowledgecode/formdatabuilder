/*global expect, FormDataBuilder */
(function () {
    'use strict';

    var url = 'http://localhost:3000/test/upload',
        worker = new Worker('worker.js'),
        post = function (form) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(xhr.status);
                        }
                    }
                };
                xhr.open('POST', url, true);
                xhr.send(form);
            });
        },
        work = function (data) {
            return new Promise(function (resolve, reject) {
                var success, failure, id = Math.random();

                success = function (evt) {
                    if (evt.data.id === id) {
                        worker.removeEventListener('message', success);
                        worker.removeEventListener('error', failure);
                        resolve(evt.data.body);
                    }
                };
                failure = function (evt) {
                    if (evt.data.id === id) {
                        worker.removeEventListener('message', success);
                        worker.removeEventListener('error', failure);
                        reject(evt.data.body);
                    }
                };
                worker.addEventListener('message', success, false);
                worker.addEventListener('error', failure, false);
                data.id = id;
                worker.postMessage(data);
            });
        };

    describe('FormDataBuilder', function () {

        it('one string', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    name = document.getElementById('name').value,
                    data = {
                        url: url,
                        profile: [
                            { key: 'name', value: name }
                        ]
                    };

                form.append('name', name);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('two strings', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    name = document.getElementById('name').value,
                    email = document.getElementById('email').value,
                    data = {
                        url: url,
                        profile: [
                            { key: 'name', value: name },
                            { key: 'email', value: email }
                        ]
                    };

                form.append('name', name);
                form.append('email', email);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('one blob', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    photo1 = document.getElementById('photo1').files[0],
                    data = {
                        url: url,
                        profile: [
                            { key: 'photo1', value: photo1 }
                        ]
                    };

                form.append('photo1', photo1);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('two blobs', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    photo1 = document.getElementById('photo1').files[0],
                    photo2 = document.getElementById('photo2').files[0],
                    data = {
                        url: url,
                        profile: [
                            { key: 'photo1', value: photo1 },
                            { key: 'photo2', value: photo2 }
                        ]
                    };

                form.append('photo1', photo1);
                form.append('photo2', photo2);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('one string and one blob', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    name = document.getElementById('name').value,
                    photo1 = document.getElementById('photo1').files[0],
                    data = {
                        url: url,
                        profile: [
                            { key: 'name', value: name },
                            { key: 'photo1', value: photo1 }
                        ]
                    };

                form.append('name', name);
                form.append('photo1', photo1);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('two strings and two blobs', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    name = document.getElementById('name').value,
                    email = document.getElementById('email').value,
                    photo1 = document.getElementById('photo1').files[0],
                    photo2 = document.getElementById('photo2').files[0],
                    data = {
                        url: url,
                        profile: [
                            { key: 'name', value: name },
                            { key: 'email', value: email },
                            { key: 'photo1', value: photo1 },
                            { key: 'photo2', value: photo2 }
                        ]
                    };

                form.append('name', name);
                form.append('email', email);
                form.append('photo1', photo1);
                form.append('photo2', photo2);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('boundary', function () {
            var i, boundary = [];

            for (i = 0; i < 100; i++) {
                boundary[i] = /(?:boundary=)(.*)$/.exec(new FormDataBuilder().type)[1];
            }
            expect(boundary.some(function (r, j, array) {
                return array.indexOf(r) < j;
            })).to.not.be.ok();
        });

        it('empty', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    data = {
                        url: url
                    };

                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('foreign body', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    name = 123,
                    email = true,
                    photo1 = ['1', '2', '3'],
                    photo2 = { key1: null, key2: NaN },
                    data = {
                        url: url,
                        profile: [
                            { key: 'name', value: name },
                            { key: 'email', value: email },
                            { key: 'photo1', value: photo1 },
                            { key: 'photo2', value: photo2 }
                        ]
                    };

                form.append('name', name);
                form.append('email', email);
                form.append('photo1', photo1);
                form.append('photo2', photo2);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

        it('odd name', function (done) {
            Promise.resolve().then(function () {
                var form = new FormData(),
                    name = document.getElementById('name').value,
                    email = document.getElementById('email').value,
                    photo1 = document.getElementById('photo1').files[0],
                    photo2 = document.getElementById('photo2').files[0],
                    data = {
                        url: url,
                        profile: [
                            { key: ' ', value: name },
                            { key: 'メール', value: email },
                            { key: '\'\t;:[]@`~^\\|=-()&%$#_/+*{}', value: photo1 },
                            { key: '1', value: photo2 }
                        ]
                    };

                form.append(' ', name);
                form.append('メール', email);
                form.append('\'\t;:[]@`~^\\|=-()&%$#_/+*{}', photo1);
                form.append('1', photo2);
                return Promise.all([post(form), work(data)]);
            }).then(function (results) {
                expect(results[0]).to.eql(results[1]);
                done();
            }).catch(function (e) {
                done(e);
            });
        });

    });

}());
