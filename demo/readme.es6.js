/**
 * Created by liangwensen on 2/22/16.
 */
import fetch from 'zero-net/fetch';
import domQuery from 'zero-dom/query';

fetch('./README.md?raw')
    .then(function (res) {
        return res.text();
    })
    .then(function (markdownString) {
        mpr.render(domQuery.one('#container'), markdownString);
    });
