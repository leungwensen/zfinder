/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/oop/c3mro', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var indexOf = pastry.indexOf;

    function cloneArray (arr) {
        return arr.slice(0);
    }
    function isGoodHead (head, rest) {
        var isGood = true;
        pastry.some(rest, function (lin) {
            if (indexOf(lin, head) > 0) {
                isGood = false;
            }
        });

        if (isGood) {
            pastry.each(rest, function (lin) {
                if (indexOf(lin, head) === 0) {
                    lin.shift();
                }
            });
        }
        return isGood;
    }
    function eachHead (bases) {
        var result = [],
            badLinearization = 0;

        while (bases.length) {
            var base = bases.shift();
            if (!base.length) {
                continue;
            }

            if (isGoodHead(base[0], bases)) {
                result.push(base.shift());
                badLinearization = 0;
            } else {
                badLinearization += 1;
                if (badLinearization === bases.length) {
                    throw 'Bad Linearization';
                }
            }
            if (base.length) {
                bases.push(base);
            }
        }
        return result;
    }

    return pastry.c3mroMerge = function () {
        var bases = pastry.map(pastry.toArray(arguments), cloneArray);
        return eachHead(bases);
    };
});

