/* jshint strict: true, undef: true, unused: true, newcap: false */
/* global define, CodeMirror, window, location, clearTimeout, setTimeout */

define([
    'pastry/pastry',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/fmt/sprintf',
    'pastry/url/querystring',
    '../cgi/api',
    '../global/utils',
    '../component/markedRenderer',
    './event',
    './open',
    './save',
    './store'//,
    //'./tips'
], function(
    pastry,
    domEvent,
    domQuery,
    domStyle,
    sprintf,
    querystring,
    api,
    utils,
    markdownRenderer,
    event,
    openDialog,
    saveDialog,
    store//,
    //tips
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    function noop(){}

    var indexOf = pastry.indexOf;
    var domNodes = {
        btnNew: domQuery.one('#btn-new'),
        btnOpen: domQuery.one('#btn-open'),
        btnPreviewLink: domQuery.one('#btn-preview-link'),
        btnRedo: domQuery.one('#btn-redo'),
        btnSave: domQuery.one('#btn-save'),
        btnTips: domQuery.one('#btn-tips'),
        btnUndo: domQuery.one('#btn-undo'),
        editor: domQuery.one('#editor'),
        previewer: domQuery.one('#previewer .markdown-body'),
        selectKeymap: domQuery.one('#switch-keymap'),
    };
    var codeEditor = CodeMirror(domNodes.editor, {
        autofocus: true,
        lineNumbers: true,
        matchBrackets: true,
        mode: 'text/markdown',
        showCursorWhenSelecting: true,
    });
    var markdownEditor = {
        init: function() {
            markdownEditor.editor = codeEditor;
            domNodes.codeMirror = domQuery.one('.CodeMirror', domNodes.editor);
            codeEditor.setOption('extraKeys', {
                // shortcuts {
                    'Ctrl-S': function() {
                        markdownEditor.save();
                    },
                    'Cmd-S': function() {
                        markdownEditor.save();
                    },
                // }
            });
            return markdownEditor
                .refresh()
                .resumeSetting()
                .resumeContent();
        },
        refresh: function() {
            var containerHeight = (domStyle.get(domNodes.editor, 'height') - 32) + 'px';
            domStyle.set(
                domNodes.codeMirror,
                'height',
                containerHeight
            );
            codeEditor.refresh();// hack gutter height

            //domStyle.set(
                //domNodes.previewer,
                //'height',
                //containerHeight
            //);
            return markdownEditor;
        },
        resumeSetting: function() {
            // keymap {
                var keymap = store.get('key-map', 'default');
                markdownEditor.setKeymap(keymap);
            // }
            return markdownEditor;
        },
        resumeContent: function() {
            var qs = querystring.parse(location.search.replace(/^\?/, ''));
            if (qs.file) {
                markdownEditor.openFile(qs.file);
            } else {
                markdownEditor.setFilename('');
                markdownEditor.setValue('');
                markdownEditor.update();
            }
            return markdownEditor;
        },
        setKeymap: function(type) {
            if (indexOf([
                'default',
                'emacs',
                'sublime',
                'vim',
            ], type) > -1) {
                codeEditor.setOption('keyMap', type);
            }
            utils.setSelectValue(domNodes.selectKeymap, type);
            store.set('key-map', type);
        },
        setFilename: function(filename) {
            store.set('current-filename', filename);
            domNodes.btnPreviewLink.href = filename;
        },
        setValue: function(value) {
            store.set('old-value', value);
            codeEditor.setValue(value);
        },
        update: function() {
            var currentValue = codeEditor.getValue() || '',
                oldValue = store.get('old-value', '');
            store.set('current-value', currentValue);
            store.set('is-saved', currentValue === oldValue);
            markdownRenderer(domNodes.previewer, currentValue);
        },
        new: function() {
            markdownEditor.save(function() {
                store.set('old-value', '');
                codeEditor.setValue('');
                markdownEditor.setFilename('');
                markdownEditor.update();
                codeEditor.focus();
                utils.pushState(location.origin + location.pathname);
            }, true);
        },
        open: function() {
            markdownEditor.save(function() {
                openDialog(markdownEditor.openFile);
            }, true);
        },
        openFile: function(filename) {
            api.getFile(filename).then(function(data) {
                markdownEditor.setFilename(filename);
                markdownEditor.setValue(data.content);
                markdownEditor.update();
                utils.pushState(sprintf('?file=%s', filename));
            });
        },
        save: function(callback, confirm) {
            callback = callback || noop;
            if (store.get('is-saved')) { // already saved
                return callback();
            }
            saveDialog(callback, confirm);
        },
    };

    // events {
        event.on('set-value', function(value) {
            markdownEditor.setValue(value);
        });
        event.on('new', function() {
            markdownEditor.new();
        });
        event.on('open', function() {
            markdownEditor.open();
        });
        event.on('save', function() {
            markdownEditor.save();
        });
        event.on('undo', function() {
            codeEditor.undo();
        });
        event.on('redo', function() {
            codeEditor.redo();
        });
        event.on('refresh', function() {
            markdownEditor.refresh();
        });

        var updateTimeout,
            UPDATE_INTERVAL = 600;
        event.on('update', function() {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function() {
                markdownEditor.update();
            }, UPDATE_INTERVAL);
        });

        //event.on('show-tips', function() {
            //tips.show();
        //});

        event.on('set-keymap', function(keymap) {
            markdownEditor.setKeymap(keymap);
        });
    // }
    // codeMirror events {
        codeEditor.on('change', function() {
            event.trigger('update');
        });
    // }
    // dom events {
        domEvent.on(window, 'resize', function() {
            event.trigger('refresh');
        });
        domEvent.on(domNodes.btnNew, 'click', function() {
            event.trigger('new');
        });
        domEvent.on(domNodes.btnOpen, 'click', function() {
            event.trigger('open');
        });
        domEvent.on(domNodes.btnSave, 'click', function() {
            event.trigger('save');
        });
        domEvent.on(domNodes.btnUndo, 'click', function() {
            event.trigger('undo');
        });
        domEvent.on(domNodes.btnRedo, 'click', function() {
            event.trigger('redo');
        });
        //domEvent.on(domNodes.btnTips, 'click', function() {
            //event.trigger('show-tips');
        //});
        domEvent.on(domNodes.selectKeymap, 'change', function() {
            event.trigger('set-keymap', utils.getSelectValue(domNodes.selectKeymap));
        });
        window.onbeforeunload = function() {
            return store.get('is-saved', true) ? null : 'You have unsaved changes!';
        };
    // }
    // shortcuts {
    // }
    return markdownEditor.init();
});

