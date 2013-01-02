tag-parser.js
==============
An NPM for parsing text markup

TagParser
---------
First include the module:

    var TagParser = require('tag-parser');

then, instantiate the object:

    var parser = new TagParser([environments]);
    
where environments may contain:

1. *name* : 
2. *sentinels* : a list of the following mixed types:
    1. an array of 2 strings, the first being the 'open' sentinel, the second, 'close'.
    2. an object containing 'opener' && 'closer'
    3. a single string that is both the opener and closer
3. *onParse* : a callback allowing you to make custom modifications of an existing tag

parse with:

    var parseTree = parser.parse(text);

HTMLParser
----------
First include the module:

    var HTMLParser = require('tag-parser/html');
    
then, instantiate the object:

    var parser = new HTMLParser();
    
parse with:

    var parseTree = parser.parse('<html><head><title>Awesome!</title></head><body onload="callReady()"><h1>Congrats</h1><p>It worked.</p><!--a comment--></body></html>');
    
which will produce:
    
    {
        type: 'tag',
        text: 'html',
        name: 'html',
        attributes: {},
        children: [
            {
                type: 'tag',
                text: 'head',
                name: 'head',
                attributes: {},
                children: [
                    {
                        type: 'tag',
                        text: 'title',
                        name: 'title',
                        attributes: {},
                        children: [
                            'Awesome!'
                        ]
                    }
                ]
            },
            {
                type: 'tag',
                text: 'body onload="callReady()"',
                name: 'body',
                attributes: {
                    onload : 'callReady()'
                },
                children: [
                    {
                        type: 'tag',
                        text: 'h1',
                        name: 'h1',
                        attributes: {},
                        children: [
                            'Congrats!'
                        ]
                    },
                    {
                        type: 'tag',
                        text: 'p',
                        name: 'p',
                        attributes: {},
                        children: [
                            'It worked.'
                        ]
                    },
                    {
                        type: 'comment',
                        text: 'a comment',
                        children: [
                            'a comment'
                        ]
                    }
                ]
            }
        ]
    }

Testing
-------

Run the tests at the project root with:

    mocha

Enjoy,

-Abbey Hawk Sparrow