/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/hotkey',
    'pastry/dom/query',
    './tab',
    '../cgi/api',
    '../component/LoadingSpinner',
    '../global/CONST',
    '../global/utils',
    '../template/noSearchResult',
    '../template/searchResult'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domHotkey,
    domQuery,
    tab,
    api,
    LoadingSpinner,
    CONST,
    utils,
    tmplNoSearchResult,
    tmplSearchResult
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map;

    var domNodeQuery = domQuery.one('#search-query');
    var domNodeGlobResult = domQuery.one('#search-glob-result');
    var domNodeContentResult = domQuery.one('#search-content-result');
    var domNodeSubmit = domQuery.one('#submit-search');
    var processFiles = function (files) {
        return map(files, function(file) {
            file.iconClass = utils.getIconClass(file);
            return file;
        });
    };
    var noResultHtml = tmplNoSearchResult();
    var search = {
        focus: function() {
            domNodeQuery.focus();
        },
        searchGlob: function(query) {
            tab.show(1);
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
            tab.show(1);
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

    // dom events {
        function submitSearch() {
            var query = domNodeQuery.value;
            if (query.length > 0) {
                search.searchGlob(/^\w/.test(query) ? '**/' + query : query);
                search.searchContent(domNodeQuery.value);
            }
        }
        domEvent.on(domNodeQuery, 'keyup', function(e) {
            if (e.keyCode === 13) {
                submitSearch();
            }
        });
        domEvent.on(domNodeSubmit, 'click', function() {
            submitSearch();
        });
        domHotkey.on('ctrl+f', function() {
            domNodeQuery.focus();
        });

    // }
    return search;
});

