npm-trospect.js
==============
A utility to wrap: require('<name>/package')

It will also allow you to perform additional operations as well as gracefully autogenerate some info for directly referenced classes (as is common for optional subcomponents). Really, it's just for my own use in [protolus-resource](https://npmjs.org/package/protolus-resource) and I'd prefer to keep it separate to stay neat.

Usage
-----
First include the module:

    require.package = require('npm-trospect');

then, use it... in this case we introspect on ourselves:

    require.package('npm-trospect');
    
and we get back the package info, so far no different than a request through require(<name>/package), but if you require a submodule like the optional file body scanner

    require.package('npm-trospect/scanner');
    
Speaking of the scanner, just include it:

    require.scan = require('npm-trospect/scanner');
    
then it will add an entry to the package of 'scanned\_dependencies' and combine dependencies and it for 'combined\_dependencies' async style:

    require.scan(require('npm-trospect/scanner'), function(pkg){
        //do stuff
    });
    
or sync style, because you are a callous, freewheeling bastard:

    require.scan(require('npm-trospect/scanner'));

if you want to find all commonjs modules inside a particular package you can get a scanned\_subpackages entry by:

    require.scan.directory(packageData, function(data){
        //do stuff
    });
    
and you can put it all together with:

    require.scan.full('package', function(packageData){
        //do stuff
    });
    
which also accepts the package data itself.
    
    

Testing
-------

Run the tests at the project root with:

    mocha

Enjoy,

-Abbey Hawk Sparrow