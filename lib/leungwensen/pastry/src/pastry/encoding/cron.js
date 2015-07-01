/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/encoding/cron', [
    'pastry/pastry',
    'pastry/fmt/sprintf',
    'pastry/fmt/vsprintf'
], function(
    pastry,
    sprintf,
    vsprintf
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: cron expression parser/stringifier
     * @note: accepted format
     *   (*) * * * * *
     *    |  | | | | |
     *    |  | | | | --- day of week       (1 - 7 )
     *    |  | | | ----- month             (1 - 12)
     *    |  | | ------- day of month      (1 - 31)
     *    |  | --------- hour              (0 - 23)
     *    |  ----------- minute            (0 - 59)
     *    -------------- (optional) second (0 - 59)
     * @syntax:
     *   cron.parse('1 * /5 1,2,3 3 2'); => {
     *       second     : [1],
     *       minute     : [*],
     *       hour       : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
     *       dayOfMonth : [1, 2, 3],
     *       month      : [3],
     *       month      : [2],
     *   }
     *   cron.stringify({
     *       second     : [1],
     *       minute     : [*],
     *       hour       : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
     *       dayOfMonth : [1, 2, 3],
     *       month      : [3],
     *       month      : [2],
     *   }); => '1 * 0,5,10,15,20,25,30,35,40,45,50,55 1,2,3 3 2'
     */

    var
        clone = pastry.clone,
        each = pastry.each,
        indexOf = pastry.indexOf,
        isArray = pastry.isArray,
        toInt = pastry.toInt,
        uc = pastry.uc,
        RANGE = {
            second     : [0, 59],
            minute     : [0, 59],
            hour       : [0, 23],
            dayOfMonth : [1, 31],
            month      : [1, 12],
            dayOfWeek  : [1, 7 ],
        },
        NAMES = [
            'second',
            'minute',
            'hour',
            'dayOfMonth',
            'month',
            'dayOfWeek'
        ],
        ALIAS = {
            dayOfWeek: [
                'MON',
                'TUE',
                'WED',
                'THU',
                'FRI',
                'SAT',
                'SUN'
            ],
            month: [
                'JAN',
                'FEB',
                'MAR',
                'APR',
                'MAY',
                'JUN',
                'JUL',
                'AUG',
                'SEP',
                'OCT',
                'NOV',
                'DEC'
            ],
        };

    function alias2number(alias, name) {
        var errorStr = sprintf('Invalid str: %s', alias);
        alias = uc(alias);
        if (isNaN(alias) && name !== 'month' && name !== 'dayOfWeek') {
            throw errorStr;
        }
        if (isNaN(alias) && indexOf(ALIAS[name], alias) < 0) {
            throw errorStr;
        }
        return isNaN(alias) ? indexOf(ALIAS[name], alias) + 1 : toInt(alias);
    }
    function isInRange(min, max, check) {
        return min <= check && check <= max;
    }

    return pastry.cron = {
        alias: ALIAS,
        parse: function(expression) {
            var parts = expression.split(' '),
                length = parts.length,
                partNames = clone(NAMES),
                cronObj = {};

            // check and pre-process
            switch (length) {
                case 5:
                    pastry.remove(partNames, 0);
                    break;
                case 6:
                    break;
                default:
                    throw sprintf('Invalid cron expression: %s', expression);
            }

            // parse
            function parseRange(atom, name) {
                var fromTo = atom.split('-'),
                    from = alias2number(fromTo[0], name),
                    to = alias2number(fromTo[1], name),
                    minMax = RANGE[name],
                    min = minMax[0],
                    max = minMax[1];

                if (!isInRange(min, max, from) || !isInRange(from, max, to)) {
                    throw sprintf('%s: %s should be in range %s-%s', name, atom, min, max);
                }

                for (var i = from; i <= to; i++) {
                    cronObj[name].push(i);
                }

            }
            function parseStep(atom, name) {
                var step = toInt(atom.split('/')[1]);
                for (var i = 0; i < RANGE[name][1]; i++) {
                    if (i % step === 0) {
                        cronObj[name].push(i);
                    }
                }
            }
            function parseSingle(atom, name) {
                atom = alias2number(atom, name);
                var minMax = RANGE[name],
                    min = minMax[0],
                    max = minMax[1];
                if (!isInRange(min, max, atom)) {
                    throw sprintf('%s: %s should be in range %s-%s', name, atom, min, max);
                }
                cronObj[name].push(atom);
            }
            function parse(part, name) {
                if (part === '*') {
                    return cronObj[name].push(parts);
                }
                each(part.split(','), function(atom) {
                    if (atom.indexOf('-') >= 0) {
                        parseRange(atom, name);
                    } else if (atom.indexOf('/') >= 0) {
                        parseStep(atom, name);
                    } else {
                        parseSingle(atom, name);
                    }
                });
            }

            // process
            each(partNames, function(name, index) {
                cronObj[name] = [];
                parse(parts[index], name);
            });
            return cronObj;
        },
        stringify: function(cronObj) {
            var patterns = [],
                args = [];
            each(NAMES, function(name) {
                var attrs = cronObj[name];
                if (isArray(attrs)) {
                    patterns.push('%s');
                    args.push(attrs.join(','));
                }
            });
            if (args.length !== 5 && args.length !== 6) {
                throw 'Invalid cront object!';
            }
            return vsprintf(patterns.join(' '), args);
        }
    };
});

