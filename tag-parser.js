var ext = require('prime-ext');
var prime = ext(require('prime'));
var array = ext(require('prime/es5/array'));
var string = ext(require('prime/es5/string'));
var fn = require('prime/es5/function');
var Emitter = require('prime/util/emitter');
var SimpleParser = require('./core');

var TagParser = prime({
    inherits : SimpleParser,
    attributeDelimiters : ['"'],
    constructor : function(opts, onComplete){
        this.setEnvironments(opts);
        if(onComplete) this.onComplete = onComplete;
        this.on('parse', function(node){
            if(node.type == 'tag'){
                var tag = this.parseTag(node.text);
                array.forEach(prime.keys(tag), function(key){
                    node[key] = tag[key];
                });
            }
        });
    },
    parseTag: function(tag, results){
        if(!results) results = {};
        var position = tag.indexOf(' ');
        var name = tag.substring(0, position) || tag;
        var remainder = tag.substring(position);
        var attributes = {};
        if(remainder && position != -1){
            var attributeStrings = string.splitHonoringQuotes(remainder, ' ', this.attributeDelimiters);
            array.forEach(attributeStrings, fn.bind(function(attr){
                var parts = attr.split('=');
                if(parts.length < 2) return;
                if(array.contains(this.attributeDelimiters, parts[1][0])){ //quoted?
                    parts[1].substring(1, parts[1].length-1);
                }
                attributes[parts[0]] = parts[1];
            }, this));
            results.parts = attributeStrings;
        }else results.parts = [];
        results.name = name;
        results.attributes = attributes;
        return results;
    }
});
module.exports = TagParser;