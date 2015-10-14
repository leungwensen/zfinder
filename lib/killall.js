/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var shelljs = require('shelljs');
var sudo = require('sudo');
var arrayUtils = require('zero-lang-array');

module.exports = function () {
    var psOutput = shelljs.exec('ps ux | grep zfinder', {silent:true}).output;
    arrayUtils.each(psOutput.split('\n'), function(line) {
        var parts = line.split(/\s+/);
        if (parts.length >= 12) {
            var cmd = parts[10];
            var zfinderScript = parts[11];
            var pid = parts[1];
            // if it is a zfinder process
            if (cmd.match(/node$/) && zfinderScript.match(/zfinder|zfinder-cli$/)) {
                console.log(line, ' is being killed!!!');
                var child = sudo(['kill', '-9', pid], {
                    cachePassword: true,
                    prompt: 'Input Sudo Password:',
                    spawnOptions: {
                        /* other options for spawn */
                    }
                });
                child.stdout.on('data', function (data) {
                    console.log(data.toString());
                });
            }
        }
    });
};

