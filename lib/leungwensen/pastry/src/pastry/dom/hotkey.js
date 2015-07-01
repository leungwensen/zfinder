/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/dom/hotkey', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/dom/class',
    'pastry/dom/event'
], function(
    pastry,
    bomUtils,
    domClass,
    domEvent
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : bind / unbind / trigger hotkeys
     * @reference   : https://github.com/ccampbell/mousetrap/blob/master/mousetrap.js
     */
    var hotkey,
        doc = document,

        _MAP = {
            8   : 'backspace',
            9   : 'tab',
            13  : 'enter',
            16  : 'shift',
            17  : 'ctrl',
            18  : 'alt',
            20  : 'capslock',
            27  : 'esc',
            32  : 'space',
            33  : 'pageup',
            34  : 'pagedown',
            35  : 'end',
            36  : 'home',
            37  : 'left',
            38  : 'up',
            39  : 'right',
            40  : 'down',
            45  : 'ins',
            46  : 'del',
            91  : 'meta',
            93  : 'meta',
            224 : 'meta'
        },
        _KEYCODE_MAP = {
            106 : '*',
            107 : '+',
            109 : '-',
            110 : '.',
            111 : '/',
            186 : ';',
            187 : '=',
            188 : ',',
            189 : '-',
            190 : '.',
            191 : '/',
            192 : '`',
            219 : '[',
            220 : '\\',
            221 : ']',
            222 : '\''
        },
        _SHIFT_MAP = {
            '~'  : '`',
            '!'  : '1',
            '@'  : '2',
            '#'  : '3',
            '$'  : '4',
            '%'  : '5',
            '^'  : '6',
            '&'  : '7',
            '*'  : '8',
            '('  : '9',
            ')'  : '0',
            '_'  : '-',
            '+'  : '=',
            ':'  : ';',
            '\"' : '\'',
            '<'  : ',',
            '>'  : '.',
            '?'  : '/',
            '|'  : '\\'
        },
        _SPECIAL_ALIASES = {
            'option'  : 'alt',
            'command' : 'meta',
            'return'  : 'enter',
            'escape'  : 'esc',
            'mod'     : bomUtils.isApple
        },
        _REVERSE_MAP,

        _resetTimer,
        _callbacks          = {},
        _directMap          = {},
        _sequenceLevels     = {},
        _ignoreNextKeyup    = false,
        _ignoreNextKeypress = false,
        _nextExpectedAction = false,

        lc      = pastry.lc,
        indexOf = pastry.indexOf,
        each    = pastry.each;

    // fulfill key maps {
        for (var i = 1; i < 20; ++i) {
            _MAP[111 + i] = 'f' + i;
        }
        for (i = 0; i <= 9; ++i) {
            _MAP[i + 96] = i;
        }
    // }

    function _characterFromEvent(e) {
        var which = e.which;
        if (e.type === 'keypress') {
            var character = String.fromCharCode(which);

            if (!e.shiftKey) {
                character = lc(character);
            }
            return character;
        }

        if (_MAP[which]) {
            return _MAP[which];
        }
        if (_KEYCODE_MAP[which]) {
            return _KEYCODE_MAP[which];
        }
        return lc(String.fromCharCode(which));
    }
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }
    function _resetSequences(doNotReset) {
        doNotReset = doNotReset || {};

        var activeSequences = false,
            key;

        for (key in _sequenceLevels) {
            if (doNotReset[key]) {
                activeSequences = true;
                continue;
            }
            _sequenceLevels[key] = 0;
        }
        if (!activeSequences) {
            _nextExpectedAction = false;
        }
    }
    function _isModifier(key) {
        return indexOf(['shift', 'ctrl', 'alt', 'meta'], key) > -1;
    }
    function _getMatches(character, modifiers, e, sequenceName, combination, level) {
        var i,
            callback,
            matches = [],
            action = e.type;

        if (!_callbacks[character]) {
            return [];
        }
        if (action === 'keyup' && _isModifier(character)) {
            modifiers = [character];
        }

        for (i = 0; i < _callbacks[character].length; ++i) {
            callback = _callbacks[character][i];
            if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] !== callback.level) {
                continue;
            }
            if (action !== callback.action) {
                continue;
            }
            if ((action === 'keypress' && !e.metaKey && !e.ctrlKey) ||
                _modifiersMatch(modifiers, callback.modifiers)) {
                var deleteCombo = !sequenceName && callback.combo === combination,
                    deleteSequence = sequenceName &&
                        callback.seq === sequenceName &&
                        callback.level === level;
                if (deleteCombo || deleteSequence) {
                    _callbacks[character].splice(i, 1);
                }
                matches.push(callback);
            }
        }
        return matches;
    }
    function _eventModifiers(e) {
        var modifiers = [];

        each([
            'shift',
            'alt',
            'ctrl',
            'meta'
        ], function (type) {
            if (e[type + 'Key']) {
                modifiers.push(type);
            }
        });
        return modifiers;
    }
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }
        e.returnValue = false;
    }
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }
        e.cancelBubble = true;
    }
    function _fireCallback(callback, e, combo, sequence) {
        if (hotkey.stop(e, e.target || e.srcElement, combo, sequence)) {
            return;
        }
        if (callback(e, combo) === false) {
            _preventDefault(e);
            _stopPropagation(e);
        }
    }
    function _handleKey(character, modifiers, e) {
        var callbacks = _getMatches(character, modifiers, e),
            i,
            doNotReset = {},
            maxLevel = 0,
            processedSequenceCallback = false;

        for (i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].seq) {
                maxLevel = Math.max(maxLevel, callbacks[i].level);
            }
        }
        for (i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].seq) {
                if (callbacks[i].level !== maxLevel) {
                    continue;
                }
                processedSequenceCallback = true;
                doNotReset[callbacks[i].seq] = 1;
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                continue;
            }
            if (!processedSequenceCallback) {
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
            }
        }
        var ignoreThisKeypress = e.type === 'keypress' && _ignoreNextKeypress;
        if (e.type === _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
            _resetSequences(doNotReset);
        }

        _ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown';
    }
    function _handleKeyEvent(e) {
        if (!pastry.isNumber(e.which)) {
            e.which = e.keyCode;
        }
        var character = _characterFromEvent(e);
        if (!character) {
            return;
        }
        if (e.type === 'keyup' && _ignoreNextKeyup === character) {
            _ignoreNextKeyup = false;
            return;
        }
        hotkey.handleKey(character, _eventModifiers(e), e);
    }
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }
    function _pickBestAction(key, modifiers, action) {
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }
        if (action === 'keypress' && modifiers.length) {
            action = 'keydown';
        }
        return action;
    }
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }
        return combination.split('+');
    }
    function _getKeyInfo(combination, action) {
        var keys,
            key,
            i,
            modifiers = [];
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            if (action && action !== 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        action = _pickBestAction(key, modifiers, action);
        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }
    function _resetSequenceTimer() {
        clearTimeout(_resetTimer);
        _resetTimer = setTimeout(_resetSequences, 1000);
    }
    function _bindSequence(combo, keys, callback, action) {
        _sequenceLevels[combo] = 0;

        function _increaseSequence(nextAction) {
            return function() {
                _nextExpectedAction = nextAction;
                ++_sequenceLevels[combo];
                _resetSequenceTimer();
            };
        }
        function _callbackAndReset(e) {
            _fireCallback(callback, e, combo);
            if (action !== 'keyup') {
                _ignoreNextKeyup = _characterFromEvent(e);
            }

            setTimeout(_resetSequences, 10);
        }

        for (var i = 0; i < keys.length; ++i) {
            var isFinal = i + 1 === keys.length,
                wrappedCallback = isFinal ? _callbackAndReset :
                    _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
            _bindSingle(keys[i], wrappedCallback, action, combo, i);
        }
    }
    function _bindSingle(combination, callback, action, sequenceName, level) {
        _directMap[combination + ':' + action] = callback;
        combination = combination.replace(/\s+/g, ' ');

        var sequence = combination.split(' '),
            info;

        if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
        }

        info = _getKeyInfo(combination, action);

        _callbacks[info.key] = _callbacks[info.key] || [];

        _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

        _callbacks[info.key][sequenceName ? 'unshift' : 'push']({
            callback: callback,
            modifiers: info.modifiers,
            action: info.action,
            seq: sequenceName,
            level: level,
            combo: combination
        });
    }
    function _bindMultiple(combinations, callback, action) {
        each(combinations, function (combination) {
            _bindSingle(combination, callback, action);
        });
    }

    each([
        'keypress',
        'keydown' ,
        'keyup'
    ], function (type) {
        domEvent.on(doc, type, _handleKeyEvent);
    });

    return hotkey = {
        on: function (keys, callback, action) {
            keys = pastry.isArray(keys) ? keys : [keys];
            _bindMultiple(keys, callback, action);
            return this;
        },
        off: function (keys, action) {
            return hotkey.on(keys, function () {}, action);
        },
        trigger: function (keys, action) {
            if (_directMap[keys + ':' + action]) {
                _directMap[keys + ':' + action]({}, keys);
            }
            return this;
        },
        reset: function () {
            _callbacks = {};
            _directMap = {};
            return this;
        },
        stop: function (e, element) {
            // stop for input / select / textarea / contentEditable
            if (domClass.contains(element, 'js-hotkey')) {
                // if element has the classname 'js-hotkey', then no need to stop
                return false;
            }
            var tagName = element.tagName;
            return indexOf(['INPUT', 'SELECT', 'TEXTAREA'], tagName) > -1 ||
                element.isContentEditable;
        },
        handleKey: _handleKey
    };
});

