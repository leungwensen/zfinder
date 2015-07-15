/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/hotkey',
    'pastry/dom/query',
    '../cgi/api',
    '../component/LoadingSpinner',
    '../component/Modal',
    '../global/CONST',
    '../global/utils',
    '../template/noSearchResult',
    '../template/searchDialogBody',
    '../template/searchResult'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domHotkey,
    domQuery,
    api,
    LoadingSpinner,
    Modal,
    CONST,
    utils,
    tmplNoSearchResult,
    tmplSearchDialogBody,
    tmplSearchResult
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map,
        dialog = new Modal({
            classname: 'search-dialog',
            title: 'Search',
            width: '800px',
            onShow: function() {
                domNodeQuery.focus();
            }
        });

    domConstruct.place(
        domConstruct.toDom(tmplSearchDialogBody()),
        dialog.domNodes.body
    );

    var domNodeBtn = domQuery.one('#file-search'),
        domNodeQuery = domQuery.one('#search-query'),
        domNodeGlobResult = domQuery.one('#search-glob-result'),
        domNodeContentResult = domQuery.one('#search-content-result'),
        domNodeSubmit = domQuery.one('#submit-search'),
        processFiles = function (files) {
            return map(files, function(file) {
                file.iconClass = utils.getIconClass(file);
                return file;
            });
        },
        noResultHtml = tmplNoSearchResult(),
        search = {
            toggle: function() {
                dialog[dialog.isShown ? 'hide' : 'show']();
            },
            searchGlob: function(query) {
                new LoadingSpinner().placeAt(domNodeGlobResult, 'only');
                api.globSearch(query).then(function(files) {
                    domNodeGlobResult.innerHTML = noResultHtml;
                    var result = tmplSearchResult({
                        files: processFiles(files),
                        options: CONST
                    }, true);
                    if (result) {
                        domConstruct.place(result, domNodeGlobResult, 'only');
                    }
                });
            },
            searchContent: function(query) {
                new LoadingSpinner().placeAt(domNodeContentResult, 'only');
                api.contentSearch(query).then(function(files) {
                    domNodeContentResult.innerHTML = noResultHtml;
                    var result = tmplSearchResult({
                        files: processFiles(files),
                        options: CONST
                    }, true);
                    if (result) {
                        domConstruct.place(result, domNodeContentResult, 'only');
                    }
                });
            }
        };

    // shortcuts {
        domHotkey.on('esc', function() {
            dialog.hide();
        });
        domHotkey.on('ctrl+f', function() {
            search.toggle();
        });
    // }
    // dom events {
        function submitSearch() {
            var query = domNodeQuery.value;
            if (query.length > 0) {
                search.searchGlob(/^\w/.test(query) ? '**/' + query : query);
                search.searchContent(domNodeQuery.value);
            }
        }
        domEvent.on(domNodeBtn, 'click', function() {
            dialog.show();
        });
        domEvent.on(domNodeQuery, 'keyup', function(e) {
            if (e.keyCode === 13) {
                submitSearch();
            }
        });
        domEvent.on(domNodeSubmit, 'click', function() {
            submitSearch();
        });
    // }
    return search;
});

