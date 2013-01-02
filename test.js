var should = require("should");
var request = require("request");
var type = require('prime/util/type');
var HTMLParser = require('./html');
var SimpleParser = require('./core');

describe('SimpleParser', function(){
    var parser;
    
    describe('parses bar contained values', function(){
        
        var parser;
        before(function(){
            var stack = [];
            parser = new SimpleParser([
                {
                    name : 'bar',
                    sentinels : [['|']],
                    onParse : function(tag, parser){
                        stack.push(parser.text);
                        stack.push(tag);
                        parser.text = '';
                    }
                },
            ]);
            
            parser.test = function(text){
                stack = [];
                parser.parse(text);
                stack.push(parser.text);
                return stack;
            }
        })
        
        it('within a block of text', function(done){
            var parsed = parser.test('dflkdf|kjsdf|jkfdjdfsbdfj|dfbbdfj|bdfjkjkd|fjkd|fssfd');
            parsed[0].should.equal('dflkdf');
            parsed[1].text.should.equal('kjsdf');
            parsed[2].should.equal('jkfdjdfsbdfj');
            parsed[3].text.should.equal('dfbbdfj');
            parsed[4].should.equal('bdfjkjkd');
            parsed[5].text.should.equal('fjkd');
            parsed[6].should.equal('fssfd');
            done();
        });
    
    });
    
    describe('implemented by HTMLParser', function(){
        
        var parser;
        before(function(){
            parser = new HTMLParser();
        })
        
        it('parses some HTML', function(done){
            var parsed = parser.parse('<html><head><title>skjd</title></head><body onload="awesome()"><h1>fdsdf</h1><p>sjdnjsnd</p><!--a comment--></body></html>');
            var html = parsed.children[0];
            html.name.should.equal('html');
            html.type.should.equal('tag');
            var head = html.children[0];
            head.name.should.equal('head');
            head.type.should.equal('tag');
            var title = head.children[0];
            title.name.should.equal('title');
            title.type.should.equal('tag');
            title.children[0].should.equal('skjd');
            var body = html.children[1];
            body.name.should.equal('body');
            body.type.should.equal('tag');
            body.attributes.onload.should.equal('awesome()');
            var h1 = body.children[0];
            h1.name.should.equal('h1');
            h1.type.should.equal('tag');
            h1.children[0].should.equal('fdsdf');
            var p = body.children[1];
            p.name.should.equal('p');
            p.type.should.equal('tag');
            p.children[0].should.equal('sjdnjsnd');
            var comment = body.children[2];
            comment.text.should.equal('a comment');
            comment.type.should.equal('comment');
            done();
        });
    
    });
    
    //describe('implemented by UBBParser');
});