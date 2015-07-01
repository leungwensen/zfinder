/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/color/Color', [
    'pastry/pastry',
    'pastry/color/hexByName',
    'pastry/oop/declare'
], function(
    pastry,
    hexByName,
    declare
) {
    'use strict';
    /*
     * @author      : 绝云
     * @description : 颜色构造函数
     * @note        : can be used in nodejs
     */
    var lc    = pastry.lc,
        round = Math.round,

        initProps = {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },

        Color = function (/*Array|String|Object*/ color) {
            var instance = this;

            if (color) {
                instance.initialise(color);
            }
        },

        classMaker;

    pastry.extend(Color, {
        hexByName: hexByName,

        makeGrey: function (/*Number*/ g, /*Number?*/ a) {
            return Color.fromArray([g, g, g, a]);
        },

        blendColors : function(/*Color*/ start, /*Color*/ end, /*Number*/ weight, /*Color?*/ obj){
            var t = obj || new Color();
            pastry.each(['r', 'g', 'b', 'a'], function(x){
                t[x] = start[x] + (end[x] - start[x]) * weight;
                if (x !== 'a') {
                    t[x] = Math.round(t[x]);
                }
            });
            return t.sanitize();
        },

        fromHex: function (/*String*/ color, /*Color?*/ obj) {
            var result = obj || new Color(),
                bits   = (color.length === 4) ? 4 : 8,
                mask   = (1 << bits) - 1;

            color = Number('0x' + color.substr(1));

            if (pastry.isNaN(color)) {
                return null;
            }
            pastry.each(['b', 'g', 'r'], function (x) {
                var c = color & mask;
                color >>= bits;
                result[x] = bits === 4 ? 17 * c : c;
            });
            result.a = 1;
            return result;
        },
        fromRgb: function (/*String*/ color, /*Color?*/ obj) {
            var matches = lc(color).match(/^rgba?\(([\s\.,0-9]+)\)/);
            return matches && Color.fromArray(matches[1].split(/\s*,\s*/), obj);
        },
        fromHsl: function (/*String*/ color, /*Color?*/ obj) {
            var matches = lc(color).match(/^hsla?\(([\s\.,0-9]+)\)/);
            if (matches) {
                var c  = matches[2].split(/\s*,\s*/),
                    l  = c.length,
                    H  = ((parseFloat(c[0]) % 360) + 360) % 360 / 360,
                    S  = parseFloat(c[1]) / 100,
                    L  = parseFloat(c[2]) / 100,
                    m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S,
                    m1 = 2 * L - m2,
                    a  = [
                        hue2rgb(m1, m2, H + 1 / 3) * 256,
                        hue2rgb(m1, m2, H) * 256,
                        hue2rgb(m1, m2, H - 1 / 3) * 256,
                        1
                    ];
                if(l === 4){
                    a[3] = c[3];
                }
                return Color.fromArray(a, obj);
            }
        },
        fromArray: function (/*Array*/ arr, /*Color?*/ obj) {
            var result = obj || new Color();
            result.set(Number(arr[0]), Number(arr[1]), Number(arr[2]), Number(arr[3]));
            if (isNaN(result.a)) {
                result.a = 1;
            }
            return result.sanitize();
        },
        fromString: function (/*String*/ str, /*Color?*/ obj) {
            var s = Color.hexByName[str];
            return s && Color.fromHex(s, obj) ||
                Color.fromRgb(str, obj) ||
                Color.fromHex(str, obj) ||
                Color.fromHsl(str, obj);
        }
    });


    function confine (c, low, high) {
        c = Number(c);
        return pastry.isFinite(c) ? (c < low ? low : c > high ? high : c) : high;
    }
    function hue2rgb (m1, m2, h) {
        if (h < 0) {
            ++h;
        }
        if (h > 1) {
            --h;
        }
        var h6 = 6 * h;
        if (h6 < 1) {
            return m1 + (m2 - m1) * h6;
        }
        if (2 * h < 1) {
            return m2;
        }
        if (3 * h < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        return m1;
    }
    function rgb2hsl (r, g, b, a) {
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2;               break;
                case b: h = (r - g) / d + 4;               break;
            }
            h /= 6;
        }
        return [h, s, l, a];
    }

    classMaker = pastry.extend(initProps, {
        constructor: Color,
        initialise: function (color) {
            var instance = this;
            if (pastry.isString(color)) {
                Color.fromString(color, this);
            } else if (pastry.isArray(color)) {
                Color.fromArray(color, this);
            } else {
                instance.set(color.r, color.g, color.b, color.a);
                if (!(color instanceof Color)) {
                    instance.sanitize();
                }
            }
            return instance;
        },
        set: function(r, g, b, a){
            var instance = this;
            instance.r = r;
            instance.g = g;
            instance.b = b;
            instance.a = a;
            return instance;
        },
        sanitize: function () {
            var instance = this;

            instance.r = round(confine(instance.r, 0, 255));
            instance.g = round(confine(instance.g, 0, 255));
            instance.b = round(confine(instance.b, 0, 255));
            instance.a = confine(instance.a, 0, 1);
            return instance;
        },
        toRgba: function () {
            var instance = this;
            return [instance.r, instance.g, instance.b, instance.a];
        },
        toHsla: function () {
            var instance = this;
            return rgb2hsl(instance.r, instance.g, instance.b, instance.a);
        },
        toHex: function () {
            var instance = this,
                arr = pastry.map(['r', 'g', 'b'], function (x) {
                    var str = instance[x].toString(16);
                    return str.length < 2 ? '0' + str : str;
                });
            return '#' + arr.join('');
        },
        toCss: function (/*Boolean?*/ includeAlpha) {
            var instance = this,
                rgb = instance.r + ', ' + instance.g + ', ' + instance.b;
            return (includeAlpha ? 'rgba(' + rgb + ',' + instance.a : 'rgb(' + rgb) + ')';
        },
        toString: function () {
            return this.toCss(true);
        },
        toGrey: function () {
            var instance = this,
                g = round((instance.r + instance.g + instance.b) / 3);
            return Color.makeGrey(g, instance.a);
        },
        destroy: function () {
            pastry.destroy(this);
        }
    });

    return pastry.Color = declare('pastry/color/Color', classMaker);
});

