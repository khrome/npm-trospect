require.pkg = require("./npm-trospect");
require.scan = require("./scanner");

//console.log('PKG', require.pkg('prime'));
//console.log('PKG2', require.pkg('prime/es5/array'));

//console.log('PKG', require.scan(require.pkg('should')));
console.log('PKG2', require.scan(require.pkg('prime/es5/array')));
require.scan.full(require.pkg('should'), function(blah){
    console.log('OMG', blah);
});

//npm.load({global:true}, function (er) {
    /*npm.commands.view(['should'], function(err, manifest){
        console.log('args', manifest);
    });*/
    //npm.commands.view(['should'], function(err, manifest){
    //    console.log('args', manifest);
    //});
    /*npm.commands.ls([], function(args){
        console.log('args', arguments);
    });*/
//});