module.exports = function (grunt) {
    'use strict';

    var spawn = require( 'child_process' ).spawn,
        pkg   = grunt.file.readJSON('package.json');

    grunt.registerTask('compileTemplates', function () {
        var done = this.async();
        spawn('node', [
            './bin/compileTemplate.js',
        ], {
            stdio: 'inherit'
        }).on('close', function(code) {
            done(code === 0);
        });
    });

    require('load-grunt-config')(grunt, {
        init: true,
        data: {
            pkg: pkg,
            livereload: false,
            build: {
                css: {
                    'client/stylesheet/base.css': 'client/stylesheet/base.less',
                    'client/stylesheet/directory.css': 'client/stylesheet/directory.less',
                    'client/stylesheet/file-markdown.css': 'client/stylesheet/file-markdown.less',
                    'client/stylesheet/app-markdownEditor.css': 'client/stylesheet/app-markdownEditor.less',
                    'client/stylesheet/app-mindEditor.css': 'client/stylesheet/app-mindEditor.less',
                },
                js: {
                    'markdownPreviewer': {
                        baseUrl: 'client/markdownPreviewer',
                        src: 'client/markdownPreviewer/main.js',
                        out: 'client/markdownPreviewer/main.all.js',
                    }
                },
                requirejs: {
                    paths: {
                        'pastry': 'empty:',
                    }
                },
                concat: {
                    markdownPreviewer: {
                        src: [
                            'lib/leungwensen/forked/marked.min.js',
                            'lib/Khan/KaTeX/katex.min.js',
                            'lib/knsv/mermaid/dist/mermaid.min.js',
                            'lib/DmitryBaranovskiy/raphael/raphael-min.js',
                            'lib/adrai/flowchart.js/release/flowchart-1.4.0.js',
                        ],
                        dest: 'client/markdownPreviewer/libs.min.js'
                    }
                },
                uglify: {
                    markdownPreviewer: {
                        files: {
                            'client/markdownPreviewer/main.min.js': 'client/markdownPreviewer/main.all.js',
                        }
                    }
                }
            }
        }
    });
};
