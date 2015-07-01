/* jshint strict: true, undef: true */
/* global define, pastry */

define('pastry/text/i18n', [
    'pastry/pastry',
    'pastry/fmt/vsprintf',
    'pastry/locale/' + pastry.CONFIG.defaultLocale,
    'pastry/locale/' + pastry.CONFIG.locale
], function(
    pastry,
    vsprintf,
    defaultLocaleMessages,
    localeMessages
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : i18n engine
     */

    var extend = pastry.extend,
        toArray = pastry.toArray,
        lc = pastry.lc,

        defaultLocale = pastry.CONFIG.defaultLocale,
        currentLocale = pastry.CONFIG.locale,
        cachedMessages = {},

        i18n = {
            // chaining methods {
                setLocale: function(locale) {
                    currentLocale = lc(locale || defaultLocale);
                    return i18n;
                },
                set: function(messageId, msgStr, locale) {
                    // set message
                    locale = lc(locale || currentLocale);
                    initLocaleMessages(locale);
                    cachedMessages[locale][messageId] = msgStr;
                    return i18n;
                },
                load: function(messages, locale) {
                    // load messages
                    messages = messages || {};
                    locale = lc(locale || currentLocale);
                    initLocaleMessages(locale);
                    extend(cachedMessages[locale], messages);
                    return i18n;
                },
            // }
            // non-chaining methods {
                get: function(messageId, locale) {
                    // get messageStr
                    // if `messageStr` of `locale` exists, return it
                    // if not, check `messageStr` of `defaultLocale`
                    // if both not found, return `messageId` itself
                    initLocaleMessages(locale);
                    return (cachedMessages[locale][messageId] ?
                        cachedMessages[locale][messageId] : (
                            cachedMessages[defaultLocale][messageId] ?
                            cachedMessages[defaultLocale][messageId] :
                            messageId
                        )
                    );
                },
                translate: function(messageId) {
                    // translate messages to locale language
                    var args = toArray(arguments).slice(1);
                    return vsprintf(i18n.get(messageId, currentLocale), args);
                },
                translateToLocale: function(locale, messageId) {
                    var args = toArray(arguments).slice(2);
                    return vsprintf(i18n.get(messageId, locale), args);
                }
            // }
        };

    function initLocaleMessages(locale) {
        locale = lc(locale);
        cachedMessages[locale] = extend({}, cachedMessages[locale] || {});
    }

    return pastry.i18n = i18n
        .load(defaultLocaleMessages, defaultLocale)
        .load(localeMessages);
});

