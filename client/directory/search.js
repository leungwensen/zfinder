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
    //'../component/Modal',
    '../global/CONST',
    '../global/utils',
    '../template/noSearchResult',
    //'../template/searchDialogBody',
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
    //Modal,
    CONST,
    utils,
    tmplNoSearchResult,
    //tmplSearchDialogBody,
    tmplSearchResult
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map;
        //dialog = new Modal({
            //classname: 'search-dialog',
            //title: 'Search',
            //width: '800px',
            //onShow: function() {
                //domNodeQuery.focus();
            //}
        //});

    //domConstruct.place(
        //domConstruct.toDom(tmplSearchDialogBody()),
        //dialog.domNodes.body
    //);

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
    // }
    return search;
});

