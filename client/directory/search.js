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
    '../global/CONST',
    '../global/utils',
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
    CONST,
    utils,
    tmplSearchResult
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map,
        domNodeBtn = domQuery.one('#file-search'),
        domNodeDialog = domQuery.one('#search-dialog'),
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
        noResultHtml = '<div class="no-result align-center"><span>No Result</span></div>',
        search = {
            isShown: false,
            show: function() {
                domClass.add(domNodeDialog, 'show');
                domNodeQuery.focus();
                search.isShown = true;
            },
            hide: function() {
                domClass.remove(domNodeDialog, 'show');
                search.isShown = false;
            },
            toggle: function() {
                search[search.isShown ? 'hide' : 'show']();
            },
            searchGlob: function(query) {
                new LoadingSpinner().placeAt(domNodeGlobResult, 'only');
                api.globSearch(query)
                    .then(function(files) {
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
                api.contentSearch(query)
                    .then(function(files) {
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
            search.hide();
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
            search.show();
        });
        domEvent.on(domNodeDialog, 'click', '.close', function() {
            search.hide();
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

