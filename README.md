# FormDataBuilder [![Circle CI](https://circleci.com/gh/knowledgecode/formdatabuilder.svg?style=shield)](https://circleci.com/gh/knowledgecode/formdatabuilder)
This is an alternative [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object in Web Workers. It's not a polyfill, but it has similar interface and can be created blob to send via XHR2.  
## WHY
When we upload files via multipart/form-data, `FormData` object is very useful. However according to my investigation, in Web Workers it seems not to be able to use it except Chrome for now. It would be better if could create the polyfill, but it's probably impossible because at least there is a problem with converting to string from binary.  
## API
### Constructor
```javascript
var form = new FormDataBuilder();
```
### append(name, value)
```javascript
form.append('name', 'John Smith');
form.append('photo', file);
```
### getBlob()
```javascript
var blob = form.getBlob();
```
### type
```javascript
xhr.setRequestHeader('Content-Type', form.type);
```
## Example
```javascript
importScripts('FormDataBuilder.js');

self.onmessage = function (evt) {
    var profile = evt.data,
        form = FormData ? new FormData() : new FormDataBuilder();

    form.append('name', profile.name);      // => String
    form.append('email', profile.email);    // => String
    form.append('photo', profile.file);     // => File

    var xhr = new XMLHttpRequest(),
        url = 'http://example.com/upload';

    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                postMessage(xhr.responseText);
            } else {
                postMessage('error');
            }
        }
    };
    xhr.open('POST', url, true);
    if (form.type) {
        xhr.setRequestHeader('Content-Type', form.type);
    }
    xhr.send(form.getBlob ? form.getBlob() : form);
};
```
## Browser Support
Chrome, Android 4.4+, Firefox, Safari 6+, Opera, and Internet Explorer 10+.  
## License
MIT  
