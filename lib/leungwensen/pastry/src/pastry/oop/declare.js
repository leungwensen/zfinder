/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/oop/declare', [
    'pastry/pastry',
    'pastry/oop/c3mro'
], function(
    pastry,
    c3mroMerge
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Class utils
     */

    return pastry.declare = function(/*name, superClasses, protoObj*/) {
        var uberClass,
            tempConstructor,
            lin          = '_linearization',
            args         = pastry.toArray(arguments),
            name         = pastry.isString(args[0]) ? args.shift() : '',
            superClasses = args.length > 1 ? args.shift() : [],
            protoObj     = args[0] ? args.shift() : {},
            bases        = [],
            Tmp          = function () {},
            hasCtor      = false,
            ctor         = function () {};

        superClasses = pastry.isArray(superClasses) ? superClasses : [superClasses];
        pastry.each(superClasses, function(clazz) {
            clazz[lin] = clazz[lin] || [clazz];
            bases.push(clazz[lin]);
        });

        if (bases.length) {
            bases.push(superClasses);
            bases = c3mroMerge.apply(null, bases);
        }

        tempConstructor = protoObj.constructor;
        if (tempConstructor !== Object.prototype.constructor) {
            hasCtor = true;
            ctor = tempConstructor;
        }

        ctor[lin]    = [ctor].concat(bases);
        ctor.parents = bases.slice(0);

        protoObj.constructor = ctor;
        while ((uberClass = bases.shift())) {
            protoObj = pastry.extend({}, uberClass.prototype, protoObj);
            Tmp.prototype = protoObj;
            if (!hasCtor) {
                protoObj.constructor = ctor;
            }
            protoObj = new Tmp();
        }

        ctor.className = name;
        ctor.prototype = protoObj;
        ctor.prototype.constructor = ctor;

        return ctor;
    };
});

