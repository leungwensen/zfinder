/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/fmt/sprintf',
    'pastry/ui/Tree',
    './store',
    '../cgi/api',
    '../component/Modal',
    '../global/CONST',
    '../global/utils',
    '../template/confirmSave',
    '../template/save',
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    sprintf,
    Tree,
    store,
    api,
    Modal,
    CONST,
    utils,
    tmplConfirmSave,
    tmplSave
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map,
        some = pastry.some,
        processNode = utils.processNode,
        afterSaved = function(){},
        confirmDialog = new Modal({
            classname: 'confirm-save-dialog',
            width: '400px',
        }),
        confirmDialogDomNode = confirmDialog.domNode,
        saveDialog = new Modal({
            title: 'save',
            classname: 'save-dialog',
            onShow: function() {
                saveFilenameDomNode.focus();
            }
        }),
        saveDialogDomNode = saveDialog.domNode,
        saveLocation = CONST.root,
        saveLocationDomNode,
        saveFilenameDomNode;
    // initialize {
        domConstruct.place(tmplConfirmSave(), confirmDialog.domNode);
        domConstruct.place(tmplSave(), saveDialog.domNode);
        saveLocationDomNode = domQuery.one('#save-location');
        saveFilenameDomNode = domQuery.one('#save-filename');
        // file tree {
            saveDialog.tree = new Tree({
                hasIcon: true,
                hasExpanderIcon: false,
                onExpand: function(node) {
                    api.ls(node.id, 'directory,markdown').then(function(data) {
                        var nodes = map(data, function(n) {
                            n.parentId = node.id;
                            return processNode(n);
                        });
                        saveDialog.tree.addNodes(nodes);
                    });
                },
                onSelect: function(node) {
                    if (node.isBranch) {
                        saveLocation = node.id;
                    } else {
                        var partsOfPath = node.id.split('/');
                        saveFilenameDomNode.value = partsOfPath.pop();
                        saveLocation = partsOfPath.join('/');
                    }
                },
                onDblclick: function(node) {
                    if (node.isBranch) {
                        node.expand();
                    }
                },
                getIconClass: utils.getIconClass,
            }).placeAt(saveLocationDomNode);
            saveDialog.tree.addNode(processNode({
                id: CONST.root,
                fullPathname: CONST.root,
                isBranch: true,
                name: CONST.root,
                relativePathname: '.'
            }));
            saveDialog.tree.nodeById[CONST.root]._setSelected();
            api.ls(CONST.path, 'directory,markdown').then(function(data) {
                saveDialog.tree.addNodes(map(data, function(node) {
                    node.parentId = CONST.root;
                    return processNode(node);
                }));
            });
        // }
    // }
    // dom events {
        domEvent.on(confirmDialogDomNode, 'click', '.donot-save', function() {
            afterSaved();
            confirmDialog.hide();
        });
        domEvent.on(confirmDialogDomNode, 'click', '.confirm-save', function() {
            processSave();
            confirmDialog.hide();
        });
        domEvent.on(confirmDialogDomNode, 'click', '.cancel-save', function() {
            confirmDialog.hide();
        });
        domEvent.on(saveDialogDomNode, 'click', '.confirm-save', function() {
            var filename = saveFilenameDomNode.value,
                regexps = [
                    /\.markdown$/,
                    /\.md$/,
                ];
            if (!validateFilename(filename)) {
                return;
            }
            filename = saveLocation.replace(CONST.root, '') + '/' + filename;
            filename = filename.replace(/^\//, '');
            // fix filename {
                if (!some(regexps, function(re) {
                    return re.test(filename);
                })) {
                    filename += '.markdown';
                }
            // }
            save(filename, store.get('current-value', ''));
        });
        domEvent.on(saveDialogDomNode, 'click', '.cancel-save', function() {
            saveDialog.hide();
        });
        domEvent.on(saveFilenameDomNode, 'input', function() {
            validateFilename(saveFilenameDomNode.value);
        });
    // }
    function validateFilename(filename) {
        var result = filename.length > 0 &&
            filename.length < 255 &&
            /^[-\w^&'@{}[\],$=!#().%+~ ]+$/.test(filename);
        if (!result) {
            saveFilenameDomNode.focus();
            domClass.add(saveFilenameDomNode, 'error');
        } else {
            domClass.remove(saveFilenameDomNode, 'error');
        }
        return result;
    }
    function save(filename, content) {
        api.saveFile(filename, content).then(function() {
            store.set('old-value', content);
            store.set('current-filename', filename);
            store.set('is-saved', true);
            saveDialog.hide();
            utils.pushState(sprintf('?file=%s', filename));
            afterSaved();
        });
    }
    function processSave() {
        var currentFilename = store.get('current-filename'),
            currentValue = store.get('current-value', '');
        if (currentFilename) {
            save(currentFilename, currentValue);
        } else {
            saveDialog.show();
        }
    }
    return function(callback, confirm) {
        afterSaved = callback;
        if (confirm) {
            confirmDialog.show();
        } else {
            processSave();
        }
    };
});

