/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/sprintf', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - sprintf
     */

    var reg = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([%bcdfosxX])/g,

        isUndefined = pastry.isUndefined,
        some = pastry.some,
        abs = Math.abs,
        toInt = pastry.toInt,

        sprintf = function (format) {
            if (!pastry.isString(format)) {
                throw 'sprintf: The first arguments need to be a valid format string.';
            }

            var part,
                parts = [],
                paramIndex = 1,
                args = pastry.toArray(arguments);

            while (part = reg.exec(format)) {
                if ((paramIndex >= args.length) && (part[8] !== '%')) {
                    throw 'sprintf: At least one argument was missing.';
                }

                parts[parts.length] = {
                    begin: part.index,
                    end: part.index + part[0].length,
                    sign: (part[1] === '+'),
                    negative: (parseFloat(args[paramIndex]) < 0) ? true : false,
                    padding: (isUndefined(part[2])) ? (' ') : ((part[2].substring(0, 1) === "'") ? (part[3]) : (part[2])),
                    alignLeft: (part[4] === '-'),
                    width: (!isUndefined(part[5])) ? part[5] : false,
                    precision: (!isUndefined(part[7])) ? part[7] : false,
                    type: part[8],
                    data: (part[8] !== '%') ? String(args[paramIndex++]) : false
                };
            }

            var i, j, preSubStr, origLength,
                newString = '',
                start     = 0;

            for (i = 0; i < parts.length; i ++) {
                newString += format.substring(start, parts[i].begin);

                start = parts[i].end;

                preSubStr = '';
                switch (parts[i].type) {
                    case '%':
                        preSubStr = '%';
                        break;
                    case 'b':
                        preSubStr = abs(toInt(parts[i].data)).toString(2);
                        break;
                    case 'c':
                        preSubStr = String.fromCharCode(abs(toInt(parts[i].data)));
                        break;
                    case 'd':
                        preSubStr = String(abs(toInt(parts[i].data)));
                        break;
                    case 'f':
                        preSubStr = (parts[i].precision === false) ?
                            (String((abs(parseFloat(parts[i].data))))) :
                            (abs(parseFloat(parts[i].data)).toFixed(parts[i].precision));
                        break;
                    case 'o':
                        preSubStr = abs(toInt(parts[i].data)).toString(8);
                        break;
                    case 's':
                        preSubStr = parts[i].data.substring(0, parts[i].precision ? parts[i].precision : parts[i].data.length);
                        break;
                    case 'x':
                        preSubStr = abs(toInt(parts[i].data)).toString(16).toLowerCase();
                        break;
                    case 'X':
                        preSubStr = abs(toInt(parts[i].data)).toString(16).toUpperCase();
                        break;
                    default:
                        throw 'sprintf: Unknown type "' + parts[i].type + '" detected. This should never happen. Maybe the regex is wrong.';
                }

                if (parts[i].type === '%') {
                    newString += preSubStr;
                    continue;
                }

                if (parts[i].width !== false) {
                    if (parts[i].width > preSubStr.length) {
                        origLength = preSubStr.length;
                        for(j = 0; j < parts[i].width - origLength; ++j) {
                            preSubStr = (parts[i].alignLeft === true) ?
                                (preSubStr + parts[i].padding) :
                                (parts[i].padding + preSubStr);
                        }
                    }
                }

                /*jshint -W083 */ // make function in loop
                if (
                    some([
                        'b',
                        'd',
                        'o',
                        'f',
                        'x',
                        'X'
                    ], function(type) {
                        return type === parts[i].type;
                    })
                ) {
                    if (parts[i].negative === true) {
                        preSubStr = '-' + preSubStr;
                    } else if (parts[i].sign === true) {
                        preSubStr = '+' + preSubStr;
                    }
                }
                newString += preSubStr;
            }

            newString += format.substring(start, format.length);
            return newString;
        };

    return pastry.sprintf = sprintf;
});

