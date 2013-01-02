var ext = require('prime-ext');
var prime = ext(require('prime'));
var array = ext(require('prime/es5/array'));
var string = ext(require('prime/es5/string'));
var fn = require('prime/es5/function');
var Emitter = require('prime/util/emitter');

var strictError = 'Strict parse error: Unmatched Tag!';
function opener(item){
    return item[0] || item.opener || item;
}
function closer(item){
    return item[1] || item.closer || item;
}
function byKey(arr, key){
    var result = {};
    array.forEach(arr, function(item){
        result[item[key]] = item;
    });
    return result;
}
var EnvironmentParser = new prime({
    inherits : Emitter,
    states : {},
    content : {},
    text : '',
    environments : [],
    constructor : function(environments){
        if(environments) this.setEnvironments(environments);
    },
    setEnvironments : function(environments){
        this.environments = environments;
        this.environmentsByKey = byKey(this.environments, 'name');
    },
    checkEnvironment : function(environment, job){
        if(this.states[environment.name]){ //in?
            var cls = closer(this.states[environment.name]);
            if(string.startsWithAt( job.text, job.lcv, cls )){
                job.lcv += cls.length-1;
                this.states[environment.name] = false;
                var tag = {
                    type : environment.name,
                    text : this.content[environment.name]
                };
                this.emit('parse', tag, this);
                if(environment.onParse) environment.onParse(tag, this);
                this.content[environment.name] = '';
            }else this.content[environment.name] += job.text[job.lcv];
            return true;
        }else{
            if(this.states[environment.name] = this.isTypeAt(job.text, job.lcv, environment.name)){ //beginning?
                this.content[environment.name] = '';
                job.lcv += opener(this.states[environment.name]).length-1;
                return true;
            }
            return false;
        }
    },
    isTypeAt: function(string, position, type){
        var result;
        array.forEach(this.environmentsByKey[type].sentinels, function(sentinel){
            var op = opener(sentinel);
            var cls = closer(sentinel);
            if(result) return;
            if(
                op[0] === string[position] && 
                string.substring(position, position+op.length) == op
            ) result = sentinel;
        });
        return result || false;
    },
    parse: function(xmlChars){
        var environmentNames = prime.keys(this.environmentsByKey);
        var job = {text: xmlChars};
        this.tagStack = [{name:'root'}];
        for(job.lcv = 0; job.lcv < job.text.length; job.lcv++){
            var handled = false;
            array.forEach(environmentNames, fn.bind(function(environmentName){ //todo: switch to real for
                if(handled) return;
                handled = this.checkEnvironment(this.environmentsByKey[environmentName], job);
            }, this));
            if(!handled) this.text += xmlChars[job.lcv];
        }
        return this.tagStack;
    }
});
module.exports = EnvironmentParser;