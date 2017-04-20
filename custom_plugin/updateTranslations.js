'use strict';
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

function updateTranslations(options) {
    this.options = options;
}

updateTranslations.prototype.apply = function (compiler) {
    const options = this.options;
    compiler.plugin('done', (compilation, callback) => {
        var messages = path.resolve(options.directory, options.pot);
        var command = options.languages.map((ln) => {
            ln = path.resolve(options.directory, ln + '.po');
            return 'msgmerge --no-fuzzy-matching --output-file=' + ln + ' ' + ln + ' ' + messages;
        }).join(' & ');
        console.log("Updating translation files...");
        exec(command, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                return;
            }
            console.log(stdout);
        });
    });
};

module.exports = updateTranslations;
