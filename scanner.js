var fs = require('fs');

module.exports = function(data, callback){ //true(descention), false/undefined(process), <string>(the explicit dir)
    var handler = function(err, body){
        var selector = /require\((.*)\)/g;
        var matches = [];
        var match;
        while(match = selector.exec( body )){
            if(match[1]) matches.push(match[1]);
        }
        var dir = data.main.split('/');
        dir.pop();
        matches.forEach(function(match, key){
            var relative = false;
            if(!match) return;
            if(!(match[0] == '\'' || match[0] == '"')) throw('non-literal require['+match+']!');
            if(match[0] == match[match.length]) throw('mismatched quotation');
            match = match.substring(1, match.length-1);
            var parts = match.split('/');
            var dirz = dir.slice(0);
            if(dirz[0] == '.') dirz.shift();
            if(parts[0] == '.' || parts[0] == '..'){
                relative = true;
                if(parts[0] == '.') parts.shift();
                while(parts[0] == '..'){
                    parts.shift();
                    if(!dirz.pop()) throw('inclusion outside of module: please reconsider your choice of pasta');
                }
            }
            match = dirz.join('/');
            match = (relative?data.name+'/'+match+(match?'/':''):'')+parts.join('/');
            matches[key] = match;
        });
        data.scanned_dependencies = matches;
        data.merged_dependencies = JSON.parse(JSON.stringify(data.dependencies || {}));
        data.scanned_dependencies.forEach(function(dependency){
            if(!data.merged_dependencies[dependency]) data.merged_dependencies[dependency] = '*';
        });
        if(callback) callback(data);
        return data;
    };
    var filename = (data.base_directory+'/'+data.name+'/'+data.main).replace('/./', '/');
    if(callback) fs.readFile(filename, 'utf8', handler);
    else return handler(null, fs.readFileSync(filename, 'utf8'))
};
module.exports.directory = function(data, callback){
    var sys = require('sys')
    var Process = require('child_process');
    var removes = [];
    if(data.base_directory){
        var command = "cd "+data.base_directory+'/'+data.name+"; grep -rl --include '*.js' 'exports'  .|grep -v /test/|grep -v /node_modules/";
        Process.exec(command, function (error, stdout, stderr) {
            if (error === null){
                data.scanned_subpackages = stdout.split('\n')
                data.scanned_subpackages.forEach(function(value, index){
                    if( value.replace('./', '') == data.main.replace('./', '') || !value) removes.push(index);
                    else data.scanned_subpackages[index] = data.name+'/'+value.replace('./', '').replace('.js', '');
                });
                removes.reverse().forEach(function(index){
                    data.scanned_subpackages.splice(index, 1);
                });
            }
            callback(data);
        });
    }else callback(data);
}
module.exports.full = function(data, callback){
    if(typeof data == 'string'){
        var pkg = require('./npm-trospect');
        data = pkg(data);
    }
    var count = 2;
    var returnFunction = function(){
        count--;
        if(count == 0) callback(data);
    }
    module.exports(data, returnFunction);
    module.exports.directory(data, returnFunction);
}