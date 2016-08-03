/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(rc, pathInfo) {
        __p += '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <import src="./partial/common-header.html"></import>\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/explorer.css">\n</head>\n<body>\n<svg-sprite/>\n<nav>\n  <z-svg-icon type="arrow-left"></z-svg-icon>\n  <span class="header"></span>\n  <z-svg-icon type="more-vertical"></z-svg-icon>\n</nav>\n<nav>\n  <z-breadcrumb>\n    <z-crumb>\n      <z-svg-icon type="home"></z-svg-icon>\n    </z-crumb>\n  </z-breadcrumb>\n  <z-search-query placehoder="search"></z-search-query>\n</nav>\n<main>\n  <z-path-item basename="../" type="directory"></z-path-item>\n</main>\n<z-path-dialog root="' +
            ((__t = (pathInfo.relativePath)) == null ? '' : __t) +
            '" type="directory"></z-path-dialog>\n<z-action-panel></z-action-panel>\n<import src="./partial/loading.html"></import>\n<import src="./partial/global-variables.html"></import>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/webcomponents.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/skate-with-deps.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/explorer.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.rc, data.pathInfo);
};