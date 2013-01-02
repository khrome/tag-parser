var ext = require('prime-ext');
var prime = ext(require('prime'));
var array = ext(require('prime/es5/array'));
var fn = require('prime/es5/function');

var TagParser = require('./tag-parser');

function pushChild(parent, child){
    if(!parent.children) parent.children = [];
    parent.children.push(child);
}

var HTMLParser = new prime({
    inherits : TagParser,
    targets : {},
    strict : true,
    constructor: function(){
        this.setEnvironments([
            {
                name : 'escape',
                sentinels : [['<![CDATA[', ']]>']],
                onParse : fn.bind(function(tag, parser){
                    pushChild(this.tagStack[this.tagStack.length-1], tag);
                }, this)
            },
            {
                name : 'comment',
                sentinels : [['<!--', '-->']],
                onParse : fn.bind(function(tag, parser){
                    pushChild(this.tagStack[this.tagStack.length-1], tag);
                }, this)
            },
            {
                name : 'tag',
                sentinels : [['<', '>']],
                onParse : fn.bind(function(tag, parser){
                    if(tag.name[0] == '/'){
                        tag.name = tag.name.substring(1);
                        var matched = this.tagStack.pop();
                        if(matched.name.toLowerCase() !== tag.name.toLowerCase()) throw('strict parse error!');
                        if(parser.text != ''){
                            pushChild(matched, parser.text);
                            parser.text = ''
                        }
                        pushChild(this.tagStack[this.tagStack.length-1], matched);
                    }else{
                        this.tagStack.push(tag);
                    }
                }, this)
            }
        ]);
        this.attributeDelimiters = ['"'];
        this.on('parse', function(node){
            if(node.type == 'tag'){
                var tag = this.parseTag(node.text);
                array.forEach(prime.keys(tag), function(key){
                    node[key] = tag[key];
                });
            }
        });
    },
    parse : function(html){
        this.tagStack = [{}];
        var result = TagParser.prototype.parse.apply(this, arguments);
        return this.tagStack[0];
    }
});
module.exports = HTMLParser;