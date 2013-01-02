var HTMLParser = require('./html-parser');
var parser = new HTMLParser();
var woo = parser.parse('<html><head><title>skjd</title></head><body><h1>fdsdf</h1><p>sjdnjsnd</p></body></html>');
console.log('woo', woo);
