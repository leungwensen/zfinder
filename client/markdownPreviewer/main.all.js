/* jshint strict: true, undef: true, unused: true */
/* global define, GLOBAL_CONST */

define('../global/CONST',[],function() {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    return GLOBAL_CONST;
});


/* jshint ignore:start */
define('../template/modal',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="modal"><header class="modal-header"><span class="modal-title">'+_e(title)+'</span><span class="modal-close float-right fa fa-close"></span></header><div class="modal-body"></div></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('../component/Modal',[
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/oop/declare',
    'pastry/ui/Component',
    '../template/modal'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    domStyle,
    declare,
    Component,
    tmplModal
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var noop = function() { },
        extend = pastry.extend,
        defaulOptions = {
            classname: '',
            title: '',
            width: '600px'
        },
        Modal = declare({
            constructor: function(options) {
                options = extend({}, defaulOptions, options);
                var me = this,
                    domNode = domConstruct.toDom(tmplModal(options));
                extend(me, options);
                domConstruct.place(domNode, document.body);
                me.domNode = domNode;
                domStyle.set(domNode, 'width', options.width);
                domClass.add(domNode, options.classname);
                me.domNodes = {
                    title: domQuery.one('.modal-title', domNode),
                    close: domQuery.one('.modal-close', domNode),
                    body: domQuery.one('.modal-body', domNode),
                };
                me._bindEvents();
                return me;
            },
            show: function() {
                var me = this;
                domClass.add(me.domNode, 'show');
                me.isShown = true;
                me.onShow();
                return me;
            },
            hide: function() {
                var me = this;
                domClass.remove(me.domNode, 'show');
                me.isShown = false;
                me.onHide();
                return me;
            },
            toggle: function() {
                var me = this;
                me[me.isShown ? 'hide' : 'show']();
                return me;
            },
            isShown: false,
            _bindEvents: function() {
                var me = this;
                domEvent.on(me.domNodes.close, 'click', function() {
                    me.hide();
                });
                return me;
            },
            onShow: noop,
            onHide: noop,
        });
    return Modal;
});


/* jshint ignore:start */
define('../template/resizer',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="resizer-wrapper resizer-d resizer-d-'+_e(direction)+'" data-direction="'+_e(direction)+'"><div class="resizer-handler"></div></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define, window, document */

define('../component/Resizer',[
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/oop/declare',
    '../template/resizer'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    domStyle,
    declare,
    tmplResizer
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: resize a domNode
     * @syntax:
     // new Resizer(domNode, {
     //     directions : [],  // ['e', 's', 'w', 'n', 'ne', 'se', 'sw', 'nw'] 的一个子集.
     // });
     */
    var win = window,

        DEFAULT_DIRECTIONS = [
            'e',
            's',
            'se'
        ],
        defaultOpt = {
            minWidth: 0,
            maxWidth: Infinity,
            minHeight: 0,
            maxHeight: Infinity
        },
        ON_RESIZE = function () { },
        body = document.body,
        cssNoSelect = 'non-select',

        Resizer = declare('pastry/ui/Resizer', [], {
            constructor: function (domNode, opts) {
                opts = pastry.merge({}, defaultOpt, opts);
                if (!pastry.isArray(opts.directions) || opts.directions.length === 0) {
                    opts.directions = DEFAULT_DIRECTIONS;
                }
                opts.onResize = opts.onResize || ON_RESIZE;

                var resizer = this;
                resizer.domNode = domQuery.one(domNode);
                resizer.options = opts;
                pastry.each(opts.directions, function (direction) {
                    resizer._createHandler(direction);
                });
                return resizer;
            },
            _createHandler: function (direction) {
                var resizer = this,
                    domNode = resizer.domNode,
                    resizerDom = tmplResizer({
                        direction: direction
                    }),
                    limitRange = resizer._limitRange.bind(resizer, direction),
                    resizerWrapDom,
                    handlerDiv;

                function resize (e) {
                    e.stopPropagation();
                    if (direction.indexOf('n') !== -1) {
                        domStyle.set(domNode, 'height', limitRange(resizer._startH + (resizer._startY - e.pageY)) + 'px');
                    }
                    if (direction.indexOf('s') !== -1) {
                        domStyle.set(domNode, 'height', limitRange(resizer._startH + (e.pageY - resizer._startY)) + 'px');
                    }
                    if (direction.indexOf('e') !== -1) {
                        domStyle.set(domNode, 'width', limitRange(resizer._startW + (e.pageX - resizer._startX)) + 'px');
                    }
                    if (direction.indexOf('w') !== -1) {
                        domStyle.set(domNode, 'width', limitRange(resizer._startW + (resizer._startX - e.pageX)) + 'px');
                    }
                    // prevent selecting
                    domClass.add(body, cssNoSelect);
                }
                function stop (e) {
                    e.stopPropagation();
                    domEvent.off(win, 'mousemove', resize);
                    domEvent.off(win, 'mouseup', stop);

                    resizer._triggerResize();

                    // enable selecting again
                    domClass.remove(body, cssNoSelect);
                }
                function start (e) {
                    e.stopPropagation();
                    resizer._startX = e.pageX;
                    resizer._startY = e.pageY;
                    resizer._startW = domNode.offsetWidth;
                    resizer._startH = domNode.offsetHeight;
                    domEvent.on(win, 'mouseup', stop);
                    domEvent.on(win, 'mousemove', resize);
                }

                domConstruct.place(resizerDom, domNode, 'first');
                resizerWrapDom = domQuery.one('.resizer-d-' + direction, domNode);
                handlerDiv = domQuery.one('.resizer-handler', resizerWrapDom);
                if (resizer.options.needShrink) {
                    resizer.btn = domQuery.one('.resizer-btn', resizerWrapDom);
                    resizer.toggle = function() {
                        resizer._toggle(resizerWrapDom, resizer.btn);
                    };

                    domEvent.on(resizer.btn, 'click', function() {
                        resizer.toggle.call(resizer);
                        if (pastry.isFunction(resizer.options.onClick)) {
                            resizer.options.onClick(resizer.isHide);
                        }
                    });
                }
                domEvent.on(handlerDiv, 'mousedown', start);
            },
            setSize: function(width, height) {
                var resizer = this,
                    domNode = resizer.domNode,
                    limitRange;
                if (width) {
                    limitRange = resizer._limitRange.bind(resizer, 'w');
                    domStyle.set(domNode, 'width', limitRange(width) + 'px');
                }
                if (height) {
                    limitRange = resizer._limitRange.bind(resizer, 'n');
                    domStyle.set(domNode, 'height', limitRange(height) + 'px');
                }
                return resizer;
            },
            _triggerResize: function(){
                var domNode = this.domNode;
                this.options.onResize(
                    domStyle.get(domNode, 'height'),
                    domStyle.get(domNode, 'width')
                );
            },
            _limitRange: function(direction, value) {
                var resizer = this,
                    max = direction === 'w' || direction === 'e' ? resizer.options.maxWidth : resizer.options.maxHeight,
                    min = direction === 'w' || direction === 'e' ? resizer.options.minWidth : resizer.options.minHeight;
                return Math.min(max, Math.max(min, value));
            }
        });
    return Resizer;
});

define('../component/emojiMap',{
    "%)": "😕",
    "%-)": "😕",
    "0:)": "😇",
    "0:-)": "😇",
    "0:-3": "😇",
    "0:3": "😇",
    "3:)": "😈",
    "3:-)": "😈",
    "8)": "😎",
    "8-)": "😎",
    ":$": "😊",
    ":'(": "😢",
    ":(": "😦",
    ":)": "😃",
    ":))": "😄",
    ":*": "😗",
    ":+1:": "👍",
    ":-'(": "😢",
    ":-(": "😦",
    ":-)": "😃",
    ":-))": "😄",
    ":-/": "😒",
    ":-1:": "👎",
    ":-D": "😆",
    ":-O": "😮",
    ":-P": "😛",
    ":-[": "😦",
    ":-\\": "😒",
    ":-o": "😮",
    ":-p": "😛",
    ":-|": "😐",
    ":-||": "😠",
    ":/": "😒",
    ":100:": "💯",
    ":1234:": "🔢",
    ":8ball:": "🎱",
    ":@": "😠",
    ":D": "😆",
    ":O": "😮",
    ":P": "😛",
    ":[": "😦",
    ":\\": "😒",
    ":]": "😃",
    ":^*": "😗",
    ":a:": "🅰",
    ":ab:": "🆎",
    ":abc:": "🔤",
    ":abcd:": "🔡",
    ":accept:": "🉑",
    ":aerial_tramway:": "🚡",
    ":airplane:": "\u2708",
    ":alarm_clock:": "\u23F0",
    ":alien:": "👽",
    ":ambulance:": "🚑",
    ":anchor:": "\u2693",
    ":angel:": "👼",
    ":anger:": "💢",
    ":angry:": "😠",
    ":anguished:": "😧",
    ":ant:": "🐜",
    ":apple:": "🍎",
    ":aquarius:": "\u2652",
    ":aries:": "\u2648",
    ":arrow_backward:": "\u25C0",
    ":arrow_double_down:": "\u23EC",
    ":arrow_double_up:": "\u23EB",
    ":arrow_down:": "\u2B07",
    ":arrow_down_small:": "🔽",
    ":arrow_forward:": "\u25B6",
    ":arrow_heading_down:": "\u2935",
    ":arrow_heading_up:": "\u2934",
    ":arrow_left:": "\u2B05",
    ":arrow_lower_left:": "\u2199",
    ":arrow_lower_right:": "\u2198",
    ":arrow_right:": "\u27A1",
    ":arrow_right_hook:": "\u21AA",
    ":arrow_up:": "\u2B06",
    ":arrow_up_down:": "\u2195",
    ":arrow_up_small:": "🔼",
    ":arrow_upper_left:": "\u2196",
    ":arrow_upper_right:": "\u2197",
    ":arrows_clockwise:": "🔃",
    ":arrows_counterclockwise:": "🔄",
    ":art:": "🎨",
    ":articulated_lorry:": "🚛",
    ":astonished:": "😲",
    ":athletic_shoe:": "👟",
    ":atm:": "🏧",
    ":b:": "🅱",
    ":baby:": "👶",
    ":baby_bottle:": "🍼",
    ":baby_chick:": "🐤",
    ":baby_symbol:": "🚼",
    ":back:": "🔙",
    ":baggage_claim:": "🛄",
    ":balloon:": "🎈",
    ":ballot_box_with_check:": "\u2611",
    ":bamboo:": "🎍",
    ":banana:": "🍌",
    ":bangbang:": "\u203C",
    ":bank:": "🏦",
    ":bar_chart:": "📊",
    ":barber:": "💈",
    ":baseball:": "\u26BE",
    ":basketball:": "🏀",
    ":bath:": "🛀",
    ":bathtub:": "🛁",
    ":battery:": "🔋",
    ":bear:": "🐻",
    ":bee:": "🐝",
    ":beer:": "🍺",
    ":beers:": "🍻",
    ":beetle:": "🐞",
    ":beginner:": "🔰",
    ":bell:": "🔔",
    ":bento:": "🍱",
    ":bicyclist:": "🚴",
    ":bike:": "🚲",
    ":bikini:": "👙",
    ":bird:": "🐦",
    ":birthday:": "🎂",
    ":black_circle:": "\u26AB",
    ":black_joker:": "🃏",
    ":black_large_square:": "\u2B1B",
    ":black_medium_small_square:": "\u25FE",
    ":black_medium_square:": "\u25FC",
    ":black_nib:": "\u2712",
    ":black_small_square:": "\u25AA",
    ":black_square_button:": "🔲",
    ":blossom:": "🌼",
    ":blowfish:": "🐡",
    ":blue_book:": "📘",
    ":blue_car:": "🚙",
    ":blue_heart:": "💙",
    ":blush:": "😊",
    ":boar:": "🐗",
    ":boat:": "\u26F5",
    ":bomb:": "💣",
    ":book:": "📖",
    ":bookmark:": "🔖",
    ":bookmark_tabs:": "📑",
    ":books:": "📚",
    ":boom:": "💥",
    ":boot:": "👢",
    ":bouquet:": "💐",
    ":bow:": "🙇",
    ":bowling:": "🎳",
    ":boy:": "👦",
    ":bread:": "🍞",
    ":bride_with_veil:": "👰",
    ":bridge_at_night:": "🌉",
    ":briefcase:": "💼",
    ":broken_heart:": "💔",
    ":bug:": "🐛",
    ":bulb:": "💡",
    ":bullettrain_front:": "🚅",
    ":bullettrain_side:": "🚄",
    ":bus:": "🚌",
    ":busstop:": "🚏",
    ":bust_in_silhouette:": "👤",
    ":busts_in_silhouette:": "👥",
    ":cactus:": "🌵",
    ":cake:": "🍰",
    ":calendar:": "📆",
    ":calling:": "📲",
    ":camel:": "🐫",
    ":camera:": "📷",
    ":cancer:": "\u264B",
    ":candy:": "🍬",
    ":capital_abcd:": "🔠",
    ":capricorn:": "\u2651",
    ":car:": "🚗",
    ":card_index:": "📇",
    ":carousel_horse:": "🎠",
    ":cat2:": "🐈",
    ":cat:": "🐱",
    ":cd:": "💿",
    ":chart:": "💹",
    ":chart_with_downwards_trend:": "📉",
    ":chart_with_upwards_trend:": "📈",
    ":checkered_flag:": "🏁",
    ":cherries:": "🍒",
    ":cherry_blossom:": "🌸",
    ":chestnut:": "🌰",
    ":chicken:": "🐔",
    ":children_crossing:": "🚸",
    ":chocolate_bar:": "🍫",
    ":christmas_tree:": "🎄",
    ":church:": "\u26EA",
    ":cinema:": "🎦",
    ":circus_tent:": "🎪",
    ":city_sunrise:": "🌇",
    ":city_sunset:": "🌆",
    ":cl:": "🆑",
    ":clap:": "👏",
    ":clapper:": "🎬",
    ":clipboard:": "📋",
    ":clock1030:": "🕥",
    ":clock10:": "🕙",
    ":clock1130:": "🕦",
    ":clock11:": "🕚",
    ":clock1230:": "🕧",
    ":clock12:": "🕛",
    ":clock130:": "🕜",
    ":clock1:": "🕐",
    ":clock230:": "🕝",
    ":clock2:": "🕑",
    ":clock330:": "🕞",
    ":clock3:": "🕒",
    ":clock430:": "🕟",
    ":clock4:": "🕓",
    ":clock530:": "🕠",
    ":clock5:": "🕔",
    ":clock630:": "🕡",
    ":clock6:": "🕕",
    ":clock730:": "🕢",
    ":clock7:": "🕖",
    ":clock830:": "🕣",
    ":clock8:": "🕗",
    ":clock930:": "🕤",
    ":clock9:": "🕘",
    ":closed_book:": "📕",
    ":closed_lock_with_key:": "🔐",
    ":closed_umbrella:": "🌂",
    ":cloud:": "\u2601",
    ":clubs:": "\u2663",
    ":cocktail:": "🍸",
    ":coffee:": "\u2615",
    ":cold_sweat:": "😰",
    ":collision:": "💥",
    ":computer:": "💻",
    ":confetti_ball:": "🎊",
    ":confounded:": "😖",
    ":confused:": "😕",
    ":congratulations:": "\u3297",
    ":construction:": "🚧",
    ":construction_worker:": "👷",
    ":convenience_store:": "🏪",
    ":cookie:": "🍪",
    ":cool:": "🆒",
    ":cop:": "👮",
    ":copyright:": "\u00A9",
    ":corn:": "🌽",
    ":couple:": "👫",
    ":couple_with_heart:": "💑",
    ":couplekiss:": "💏",
    ":cow2:": "🐄",
    ":cow:": "🐮",
    ":credit_card:": "💳",
    ":crocodile:": "🐊",
    ":crossed_flags:": "🎌",
    ":crown:": "👑",
    ":cry:": "😢",
    ":crying_cat_face:": "😿",
    ":crystal_ball:": "🔮",
    ":cupid:": "💘",
    ":curly_loop:": "\u27B0",
    ":currency_exchange:": "💱",
    ":curry:": "🍛",
    ":custard:": "🍮",
    ":customs:": "🛃",
    ":cyclone:": "🌀",
    ":dancer:": "💃",
    ":dancers:": "👯",
    ":dango:": "🍡",
    ":dart:": "🎯",
    ":dash:": "💨",
    ":date:": "📅",
    ":deciduous_tree:": "🌳",
    ":department_store:": "🏬",
    ":diamond_shape_with_a_dot_inside:": "💠",
    ":diamonds:": "\u2666",
    ":disappointed:": "😞",
    ":disappointed_relieved:": "😥",
    ":dizzy:": "💫",
    ":dizzy_face:": "😵",
    ":do_not_litter:": "🚯",
    ":dog2:": "🐕",
    ":dog:": "🐶",
    ":dollar:": "💵",
    ":dolls:": "🎎",
    ":dolphin:": "🐬",
    ":door:": "🚪",
    ":doughnut:": "🍩",
    ":dragon:": "🐉",
    ":dragon_face:": "🐲",
    ":dress:": "👗",
    ":dromedary_camel:": "🐪",
    ":droplet:": "💧",
    ":dvd:": "📀",
    ":e-mail:": "📧",
    ":ear:": "👂",
    ":ear_of_rice:": "🌾",
    ":earth_africa:": "🌍",
    ":earth_americas:": "🌎",
    ":earth_asia:": "🌏",
    ":egg:": "🍳",
    ":eggplant:": "🍆",
    ":eight_pointed_black_star:": "\u2734",
    ":eight_spoked_asterisk:": "\u2733",
    ":electric_plug:": "🔌",
    ":elephant:": "🐘",
    ":email:": "\u2709",
    ":end:": "🔚",
    ":envelope:": "\u2709",
    ":envelope_with_arrow:": "📩",
    ":euro:": "💶",
    ":european_castle:": "🏰",
    ":european_post_office:": "🏤",
    ":evergreen_tree:": "🌲",
    ":exclamation:": "\u2757",
    ":expressionless:": "😑",
    ":eyeglasses:": "👓",
    ":eyes:": "👀",
    ":facepunch:": "👊",
    ":factory:": "🏭",
    ":fallen_leaf:": "🍂",
    ":family:": "👪",
    ":fast_forward:": "\u23E9",
    ":fax:": "📠",
    ":fearful:": "😨",
    ":feet:": "🐾",
    ":ferris_wheel:": "🎡",
    ":file_folder:": "📁",
    ":fire:": "🔥",
    ":fire_engine:": "🚒",
    ":fireworks:": "🎆",
    ":first_quarter_moon:": "🌓",
    ":first_quarter_moon_with_face:": "🌛",
    ":fish:": "🐟",
    ":fish_cake:": "🍥",
    ":fishing_pole_and_fish:": "🎣",
    ":fist:": "\u270A",
    ":flags:": "🎏",
    ":flashlight:": "🔦",
    ":floppy_disk:": "💾",
    ":flower_playing_cards:": "🎴",
    ":flushed:": "😳",
    ":foggy:": "🌁",
    ":football:": "🏈",
    ":footprints:": "👣",
    ":fork_and_knife:": "🍴",
    ":fountain:": "\u26F2",
    ":four_leaf_clover:": "🍀",
    ":free:": "🆓",
    ":fried_shrimp:": "🍤",
    ":fries:": "🍟",
    ":frog:": "🐸",
    ":frowning:": "😦",
    ":fuelpump:": "\u26FD",
    ":full_moon:": "🌕",
    ":full_moon_with_face:": "🌝",
    ":game_die:": "🎲",
    ":gem:": "💎",
    ":gemini:": "\u264A",
    ":ghost:": "👻",
    ":gift:": "🎁",
    ":gift_heart:": "💝",
    ":girl:": "👧",
    ":globe_with_meridians:": "🌐",
    ":goat:": "🐐",
    ":golf:": "\u26F3",
    ":grapes:": "🍇",
    ":green_apple:": "🍏",
    ":green_book:": "📗",
    ":green_heart:": "💚",
    ":grey_exclamation:": "\u2755",
    ":grey_question:": "\u2754",
    ":grimacing:": "😬",
    ":grin:": "😁",
    ":grinning:": "😀",
    ":guardsman:": "💂",
    ":guitar:": "🎸",
    ":gun:": "🔫",
    ":haircut:": "💇",
    ":halo:": "😇",
    ":hamburger:": "🍔",
    ":hammer:": "🔨",
    ":hamster:": "🐹",
    ":hand:": "\u270B",
    ":handbag:": "👜",
    ":hankey:": "💩",
    ":hatched_chick:": "🐥",
    ":hatching_chick:": "🐣",
    ":headphones:": "🎧",
    ":hear_no_evil:": "🙉",
    ":heart:": "\u2764",
    ":heart_decoration:": "💟",
    ":heart_eyes:": "😍",
    ":heart_eyes_cat:": "😻",
    ":heartbeat:": "💓",
    ":heartpulse:": "💗",
    ":hearts:": "\u2665",
    ":heavy_check_mark:": "\u2714",
    ":heavy_division_sign:": "\u2797",
    ":heavy_dollar_sign:": "💲",
    ":heavy_exclamation_mark:": "\u2757",
    ":heavy_minus_sign:": "\u2796",
    ":heavy_multiplication_x:": "\u2716",
    ":heavy_plus_sign:": "\u2795",
    ":helicopter:": "🚁",
    ":herb:": "🌿",
    ":hibiscus:": "🌺",
    ":high_brightness:": "🔆",
    ":high_heel:": "👠",
    ":hocho:": "🔪",
    ":honey_pot:": "🍯",
    ":honeybee:": "🐝",
    ":horse:": "🐴",
    ":horse_racing:": "🏇",
    ":hospital:": "🏥",
    ":hotel:": "🏨",
    ":hotsprings:": "\u2668",
    ":hourglass:": "\u231B",
    ":hourglass_flowing_sand:": "\u23F3",
    ":house:": "🏠",
    ":house_with_garden:": "🏡",
    ":hushed:": "😯",
    ":ice_cream:": "🍨",
    ":icecream:": "🍦",
    ":id:": "🆔",
    ":ideograph_advantage:": "🉐",
    ":imp:": "👿",
    ":inbox_tray:": "📥",
    ":incoming_envelope:": "📨",
    ":information_desk_person:": "💁",
    ":information_source:": "\u2139",
    ":innocent:": "😇",
    ":interrobang:": "\u2049",
    ":iphone:": "📱",
    ":izakaya_lantern:": "🏮",
    ":jack_o_lantern:": "🎃",
    ":japan:": "🗾",
    ":japanese_castle:": "🏯",
    ":japanese_goblin:": "👺",
    ":japanese_ogre:": "👹",
    ":jeans:": "👖",
    ":joy:": "😂",
    ":joy_cat:": "😹",
    ":key:": "🔑",
    ":keycap_ten:": "🔟",
    ":kimono:": "👘",
    ":kiss:": "💋",
    ":kissing:": "😗",
    ":kissing_cat:": "😽",
    ":kissing_closed_eyes:": "😚",
    ":kissing_heart:": "😘",
    ":kissing_smiling_eyes:": "😙",
    ":koala:": "🐨",
    ":koko:": "🈁",
    ":large_blue_circle:": "🔵",
    ":large_blue_diamond:": "🔷",
    ":large_orange_diamond:": "🔶",
    ":last_quarter_moon:": "🌗",
    ":last_quarter_moon_with_face:": "🌜",
    ":laugh:": "😆",
    ":laughing:": "😆",
    ":leaves:": "🍃",
    ":ledger:": "📒",
    ":left_luggage:": "🛅",
    ":left_right_arrow:": "\u2194",
    ":leftwards_arrow_with_hook:": "\u21A9",
    ":lemon:": "🍋",
    ":leo:": "\u264C",
    ":leopard:": "🐆",
    ":libra:": "\u264E",
    ":light_rail:": "🚈",
    ":link:": "🔗",
    ":lips:": "👄",
    ":lipstick:": "💄",
    ":lock:": "🔒",
    ":lock_with_ink_pen:": "🔏",
    ":lollipop:": "🍭",
    ":loop:": "\u27BF",
    ":loudspeaker:": "📢",
    ":love_hotel:": "🏩",
    ":love_letter:": "💌",
    ":low_brightness:": "🔅",
    ":m:": "\u24C2",
    ":mag:": "🔍",
    ":mag_right:": "🔎",
    ":mahjong:": "🀄",
    ":mailbox:": "📫",
    ":mailbox_closed:": "📪",
    ":mailbox_with_mail:": "📬",
    ":mailbox_with_no_mail:": "📭",
    ":man:": "👨",
    ":man_with_gua_pi_mao:": "👲",
    ":man_with_turban:": "👳",
    ":mans_shoe:": "👞",
    ":maple_leaf:": "🍁",
    ":mask:": "😷",
    ":massage:": "💆",
    ":meat_on_bone:": "🍖",
    ":mega:": "📣",
    ":melon:": "🍈",
    ":memo:": "📝",
    ":mens:": "🚹",
    ":metro:": "🚇",
    ":microphone:": "🎤",
    ":microscope:": "🔬",
    ":milky_way:": "🌌",
    ":minibus:": "🚐",
    ":minidisc:": "💽",
    ":mobile_phone_off:": "📴",
    ":money_with_wings:": "💸",
    ":moneybag:": "💰",
    ":monkey:": "🐒",
    ":monkey_face:": "🐵",
    ":monorail:": "🚝",
    ":moon:": "🌙",
    ":mortar_board:": "🎓",
    ":mount_fuji:": "🗻",
    ":mountain_bicyclist:": "🚵",
    ":mountain_cableway:": "🚠",
    ":mountain_railway:": "🚞",
    ":mouse2:": "🐁",
    ":mouse:": "🐭",
    ":movie_camera:": "🎥",
    ":moyai:": "🗿",
    ":muscle:": "💪",
    ":mushroom:": "🍄",
    ":musical_keyboard:": "🎹",
    ":musical_note:": "🎵",
    ":musical_score:": "🎼",
    ":mute:": "🔇",
    ":nail_care:": "💅",
    ":name_badge:": "📛",
    ":necktie:": "👔",
    ":negative_squared_cross_mark:": "\u274E",
    ":neutral_face:": "😐",
    ":new:": "🆕",
    ":new_moon:": "🌑",
    ":new_moon_with_face:": "🌚",
    ":newspaper:": "📰",
    ":ng:": "🆖",
    ":no_bell:": "🔕",
    ":no_bicycles:": "🚳",
    ":no_entry:": "\u26D4",
    ":no_entry_sign:": "🚫",
    ":no_good:": "🙅",
    ":no_mobile_phones:": "📵",
    ":no_mouth:": "😶",
    ":no_pedestrians:": "🚷",
    ":no_smoking:": "🚭",
    ":non-potable_water:": "🚱",
    ":nose:": "👃",
    ":notebook:": "📓",
    ":notebook_with_decorative_cover:": "📔",
    ":notes:": "🎶",
    ":nut_and_bolt:": "🔩",
    ":o": "😮",
    ":o)": "😃",
    ":o2:": "🅾",
    ":o:": "\u2B55",
    ":ocean:": "🌊",
    ":octopus:": "🐙",
    ":oden:": "🍢",
    ":office:": "🏢",
    ":ok:": "🆗",
    ":ok_hand:": "👌",
    ":ok_woman:": "🙆",
    ":older_man:": "👴",
    ":older_woman:": "👵",
    ":on:": "🔛",
    ":oncoming_automobile:": "🚘",
    ":oncoming_bus:": "🚍",
    ":oncoming_police_car:": "🚔",
    ":oncoming_taxi:": "🚖",
    ":open_book:": "📖",
    ":open_file_folder:": "📂",
    ":open_hands:": "👐",
    ":open_mouth:": "😮",
    ":ophiuchus:": "\u26CE",
    ":orange_book:": "📙",
    ":outbox_tray:": "📤",
    ":ox:": "🐂",
    ":p": "😛",
    ":package:": "📦",
    ":page_facing_up:": "📄",
    ":page_with_curl:": "📃",
    ":pager:": "📟",
    ":palm_tree:": "🌴",
    ":panda_face:": "🐼",
    ":paperclip:": "📎",
    ":parking:": "🅿",
    ":part_alternation_mark:": "\u303D",
    ":partly_sunny:": "\u26C5",
    ":passport_control:": "🛂",
    ":paw_prints:": "🐾",
    ":peach:": "🍑",
    ":pear:": "🍐",
    ":pencil2:": "\u270F",
    ":pencil:": "📝",
    ":penguin:": "🐧",
    ":pensive:": "😔",
    ":performing_arts:": "🎭",
    ":persevere:": "😣",
    ":person_frowning:": "🙍",
    ":person_with_blond_hair:": "👱",
    ":person_with_pouting_face:": "🙎",
    ":phone:": "\u260E",
    ":pig2:": "🐖",
    ":pig:": "🐷",
    ":pig_nose:": "🐽",
    ":pill:": "💊",
    ":pineapple:": "🍍",
    ":pisces:": "\u2653",
    ":pizza:": "🍕",
    ":point_down:": "👇",
    ":point_left:": "👈",
    ":point_right:": "👉",
    ":point_up:": "\u261D",
    ":point_up_2:": "👆",
    ":police_car:": "🚓",
    ":poodle:": "🐩",
    ":poop:": "💩",
    ":post_office:": "🏣",
    ":postal_horn:": "📯",
    ":postbox:": "📮",
    ":potable_water:": "🚰",
    ":pouch:": "👝",
    ":poultry_leg:": "🍗",
    ":pound:": "💷",
    ":pouting_cat:": "😾",
    ":pray:": "🙏",
    ":princess:": "👸",
    ":punch:": "👊",
    ":purple_heart:": "💜",
    ":purse:": "👛",
    ":pushpin:": "📌",
    ":put_litter_in_its_place:": "🚮",
    ":question:": "\u2753",
    ":rabbit2:": "🐇",
    ":rabbit:": "🐰",
    ":racehorse:": "🐎",
    ":radio:": "📻",
    ":radio_button:": "🔘",
    ":rage:": "😡",
    ":railway_car:": "🚃",
    ":rainbow:": "🌈",
    ":raised_hand:": "\u270B",
    ":raised_hands:": "🙌",
    ":raising_hand:": "🙋",
    ":ram:": "🐏",
    ":ramen:": "🍜",
    ":rat:": "🐀",
    ":recycle:": "\u267B",
    ":red_car:": "🚗",
    ":red_circle:": "🔴",
    ":registered:": "\u00AE",
    ":relaxed:": "\u263A",
    ":relieved:": "😌",
    ":repeat:": "🔁",
    ":repeat_one:": "🔂",
    ":restroom:": "🚻",
    ":revolving_hearts:": "💞",
    ":rewind:": "\u23EA",
    ":ribbon:": "🎀",
    ":rice:": "🍚",
    ":rice_ball:": "🍙",
    ":rice_cracker:": "🍘",
    ":rice_scene:": "🎑",
    ":ring:": "💍",
    ":rocket:": "🚀",
    ":roller_coaster:": "🎢",
    ":rooster:": "🐓",
    ":rose:": "🌹",
    ":rotating_light:": "🚨",
    ":round_pushpin:": "📍",
    ":rowboat:": "🚣",
    ":rugby_football:": "🏉",
    ":runner:": "🏃",
    ":running:": "🏃",
    ":running_shirt_with_sash:": "🎽",
    ":sa:": "🈂",
    ":sagittarius:": "\u2650",
    ":sailboat:": "\u26F5",
    ":sake:": "🍶",
    ":sandal:": "👡",
    ":santa:": "🎅",
    ":satellite:": "📡",
    ":satisfied:": "😆",
    ":saxophone:": "🎷",
    ":school:": "🏫",
    ":school_satchel:": "🎒",
    ":scissors:": "\u2702",
    ":scorpius:": "\u264F",
    ":scream:": "😱",
    ":scream_cat:": "🙀",
    ":scroll:": "📜",
    ":seat:": "💺",
    ":secret:": "\u3299",
    ":see_no_evil:": "🙈",
    ":seedling:": "🌱",
    ":shaved_ice:": "🍧",
    ":sheep:": "🐑",
    ":shell:": "🐚",
    ":ship:": "🚢",
    ":shirt:": "👕",
    ":shit:": "💩",
    ":shoe:": "👞",
    ":shower:": "🚿",
    ":signal_strength:": "📶",
    ":six_pointed_star:": "🔯",
    ":ski:": "🎿",
    ":skull:": "💀",
    ":sleeping:": "😴",
    ":sleepy:": "😪",
    ":slot_machine:": "🎰",
    ":small_blue_diamond:": "🔹",
    ":small_orange_diamond:": "🔸",
    ":small_red_triangle:": "🔺",
    ":small_red_triangle_down:": "🔻",
    ":smile:": "😄",
    ":smile_cat:": "😸",
    ":smiley:": "😃",
    ":smiley_cat:": "😺",
    ":smiling_imp:": "😈",
    ":smirk:": "😏",
    ":smirk_cat:": "😼",
    ":smoking:": "🚬",
    ":snail:": "🐌",
    ":snake:": "🐍",
    ":snowboarder:": "🏂",
    ":snowflake:": "\u2744",
    ":snowman:": "\u26C4",
    ":sob:": "😭",
    ":soccer:": "\u26BD",
    ":soon:": "🔜",
    ":sos:": "🆘",
    ":sound:": "🔉",
    ":space_invader:": "👾",
    ":spades:": "\u2660",
    ":spaghetti:": "🍝",
    ":sparkle:": "\u2747",
    ":sparkler:": "🎇",
    ":sparkles:": "\u2728",
    ":sparkling_heart:": "💖",
    ":speak_no_evil:": "🙊",
    ":speaker:": "🔊",
    ":speech_balloon:": "💬",
    ":speedboat:": "🚤",
    ":star2:": "🌟",
    ":star:": "\u2B50",
    ":stars:": "🌃",
    ":station:": "🚉",
    ":statue_of_liberty:": "🗽",
    ":steam_locomotive:": "🚂",
    ":stew:": "🍲",
    ":straight_ruler:": "📏",
    ":strawberry:": "🍓",
    ":stuck_out_tongue:": "😛",
    ":stuck_out_tongue_closed_eyes:": "😝",
    ":stuck_out_tongue_winking_eye:": "😜",
    ":sun_with_face:": "🌞",
    ":sunflower:": "🌻",
    ":sunglasses:": "😎",
    ":sunny:": "\u2600",
    ":sunrise:": "🌅",
    ":sunrise_over_mountains:": "🌄",
    ":surfer:": "🏄",
    ":sushi:": "🍣",
    ":suspension_railway:": "🚟",
    ":sweat:": "😓",
    ":sweat_drops:": "💦",
    ":sweat_smile:": "😅",
    ":sweet_potato:": "🍠",
    ":swimmer:": "🏊",
    ":symbols:": "🔣",
    ":syringe:": "💉",
    ":tada:": "🎉",
    ":tanabata_tree:": "🎋",
    ":tangerine:": "🍊",
    ":taurus:": "\u2649",
    ":taxi:": "🚕",
    ":tea:": "🍵",
    ":telephone:": "\u260E",
    ":telephone_receiver:": "📞",
    ":telescope:": "🔭",
    ":tennis:": "🎾",
    ":tent:": "\u26FA",
    ":thought_balloon:": "💭",
    ":thumbsdown:": "👎",
    ":thumbsup:": "👍",
    ":ticket:": "🎫",
    ":tiger2:": "🐅",
    ":tiger:": "🐯",
    ":tired_face:": "😫",
    ":tm:": "\u2122",
    ":toilet:": "🚽",
    ":tokyo_tower:": "🗼",
    ":tomato:": "🍅",
    ":tongue:": "👅",
    ":top:": "🔝",
    ":tophat:": "🎩",
    ":tractor:": "🚜",
    ":traffic_light:": "🚥",
    ":train2:": "🚆",
    ":train:": "🚃",
    ":tram:": "🚊",
    ":triangular_flag_on_post:": "🚩",
    ":triangular_ruler:": "📐",
    ":trident:": "🔱",
    ":triumph:": "😤",
    ":trolleybus:": "🚎",
    ":trophy:": "🏆",
    ":tropical_drink:": "🍹",
    ":tropical_fish:": "🐠",
    ":truck:": "🚚",
    ":trumpet:": "🎺",
    ":tshirt:": "👕",
    ":tulip:": "🌷",
    ":turtle:": "🐢",
    ":tv:": "📺",
    ":twisted_rightwards_arrows:": "🔀",
    ":two_hearts:": "💕",
    ":two_men_holding_hands:": "👬",
    ":two_women_holding_hands:": "👭",
    ":u5272:": "🈹",
    ":u5408:": "🈴",
    ":u55b6:": "🈺",
    ":u6307:": "🈯",
    ":u6708:": "🈷",
    ":u6709:": "🈶",
    ":u6e80:": "🈵",
    ":u7121:": "🈚",
    ":u7533:": "🈸",
    ":u7981:": "🈲",
    ":u7a7a:": "🈳",
    ":umbrella:": "\u2614",
    ":unamused:": "😒",
    ":underage:": "🔞",
    ":unlock:": "🔓",
    ":up:": "🆙",
    ":v:": "\u270C",
    ":vertical_traffic_light:": "🚦",
    ":vhs:": "📼",
    ":vibration_mode:": "📳",
    ":video_camera:": "📹",
    ":video_game:": "🎮",
    ":violin:": "🎻",
    ":virgo:": "\u264D",
    ":volcano:": "🌋",
    ":vs:": "🆚",
    ":walking:": "🚶",
    ":waning_crescent_moon:": "🌘",
    ":waning_gibbous_moon:": "🌖",
    ":warning:": "\u26A0",
    ":watch:": "\u231A",
    ":water_buffalo:": "🐃",
    ":watermelon:": "🍉",
    ":wave:": "👋",
    ":wavy_dash:": "\u3030",
    ":waxing_crescent_moon:": "🌒",
    ":waxing_gibbous_moon:": "🌔",
    ":wc:": "🚾",
    ":weary:": "😩",
    ":wedding:": "💒",
    ":whale2:": "🐋",
    ":whale:": "🐳",
    ":wheelchair:": "\u267F",
    ":white_check_mark:": "\u2705",
    ":white_circle:": "\u26AA",
    ":white_flower:": "💮",
    ":white_large_square:": "\u2B1C",
    ":white_medium_small_square:": "\u25FD",
    ":white_medium_square:": "\u25FB",
    ":white_small_square:": "\u25AB",
    ":white_square_button:": "🔳",
    ":wind_chime:": "🎐",
    ":wine_glass:": "🍷",
    ":wink:": "😉",
    ":wolf:": "🐺",
    ":woman:": "👩",
    ":womans_clothes:": "👚",
    ":womans_hat:": "👒",
    ":womens:": "🚺",
    ":worried:": "😟",
    ":wrench:": "🔧",
    ":x:": "\u274C",
    ":yellow_heart:": "💛",
    ":yen:": "💴",
    ":yum:": "😋",
    ":zap:": "\u26A1",
    ":zzz:": "💤",
    ":|": "😐",
    ";)": "😉",
    ";-)": "😉",
    ">:(": "😠",
    "X-D": "😁",
    "X-P": "😝",
    "X-p": "😝",
    "XD": "😁",
    "XP": "😝",
    "Xp": "😝",
    "x-D": "😁",
    "x-P": "😝",
    "xD": "😁",
    "xP": "😝",
    "}:)": "😈",
    "}:-)": "😈",
});


/* jshint ignore:start */
define('../template/markdown/emojiFix',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<span style="font-weight: normal !important;">'+_e(emoji)+'</span>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define('../template/markdown/figure',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<figure><img src="'+_e(href)+'" alt="'+_e(text)+'" title="'+_e(title)+'"/><figcaption>'+_e(text)+'</figcaption></figure>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define('../template/markdown/flowchart',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="flowchart"><script type="text/template" class="flowchart-code">'+_e(code)+'</script><div class="flowchart-graph"></div></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define('../template/markdown/math',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div data-line="'+_e(lineNumber)+'">'+_e(tex)+'</div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define('../template/markdown/mermaidGraph',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="mermaid">'+_e(code)+'</div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint ignore:start */
define('../template/markdown/taskListItem',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<li class="task-list-item"><input type="checkbox" disabled ';if (checked) { _s+=' checked ';} _s+='>'+_e(text)+'</li>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: false */
/* global define, marked, katex, mermaid */

define('../component/marked',[
    'pastry/pastry',
    'pastry/fmt/sprintf',
    'pastry/html/escape',
    './emojiMap',
    '../template/markdown/emojiFix',
    '../template/markdown/figure',
    '../template/markdown/flowchart',
    '../template/markdown/math',
    '../template/markdown/mermaidGraph',
    '../template/markdown/taskListItem'
], function(
    pastry,
    sprintf,
    htmlEscape,
    emojiMap,
    tmplEmojiFix,
    tmplFigure,
    tmplFlowchart,
    tmplMath,
    tmplMermaidGraph,
    tmplTaskListItem
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var mermaidError;

    var each = pastry.each,
        lc = pastry.lc,
        map = pastry.map,
        trim = pastry.trim;

    var Renderer = marked.Renderer;
    var RendererPrototype = Renderer.prototype;
    var renderer = new Renderer();
    var unescape = htmlEscape.unescape;

    mermaid.parseError = function(err/*, hash*/){
        mermaidError = err;
    };

    renderer.listitem = function(text) { // list item
        if(!/^\[[ x]\]\s/.test(text)) { // normal list item
            return marked.Renderer.prototype.listitem(text);
        }
        return tmplTaskListItem({
            checked: /^\[x\]\s/.test(text),
            text: text.substring(3)
        }, true);
    };

    renderer.codespan = function(code) { // inline code
        if(/^\$.+\$$/.test(code)) { // inline math typesetting
            var raw = /^\$(.+)\$$/.exec(code)[1],
                line = unescape(raw);
            try{
                return katex.renderToString(line, {
                    displayMode: false
                });
            } catch(err) {
                return sprintf('<code>%s</code>', err);
            }
        }
        return RendererPrototype.codespan.apply(this, arguments);
    };

    renderer.code = function(code, lang, escaped, lineNumber) { // code block
        code = trim(code);
        var firstLine = lc(trim(code.split(/\n/)[0]));
        if (lang === 'markdown' || lang === 'md') {
            return RendererPrototype.code.apply(this, arguments);
        }
        if (firstLine === 'math') { // math typesetting
            var tex = '';
            each(code.replace(/^math\s*/, '').split(/\n\n/), function(line){
                // next if we have two empty lines
                line = trim(line);
                if (line.length > 0) {
                    try {
                        tex +=  katex.renderToString(line, {
                            displayMode: true
                        });
                    } catch(err) {
                        tex += sprintf('<pre>%s</pre>', err);
                    }
                }
            });
            return tmplMath({
                lineNumber: lineNumber,
                tex: tex,
            }, true);
        } else if ( // graphs
            firstLine === 'gantt' ||
            firstLine === 'sequencediagram' ||
            firstLine.match(/^graph (?:tb|bt|rl|lr|td);?$/)
        ){
            if(firstLine === 'sequencediagram') {
                code += '\n'; // empty line in the end or error
            }
            return tmplMermaidGraph({
                code: code,
            }, true);
        } else if (firstLine === 'flowchart') { // flowchart
            code = map(code
                // remove firstLine
                .replace(new RegExp('^' + firstLine + '\n', 'ig'), '')
                .replace(/^\n/, '').split(/\n/), function(line) {
                    // have to trim
                    return trim(line);
                }).join('\n');
            return tmplFlowchart({
                code: code
            }, true);
        }
        return RendererPrototype.code.apply(this, arguments);
    };
    renderer.image = function(href, title, text) {
        return tmplFigure({
            href: href,
            text: text,
            title: title || ''
        });
    };

    renderer.text = function(text) { // text span
        var words = text.split(' ');
        return map(words, function(word) {
            word = trim(word);
            if (emojiMap[word]) {
                return tmplEmojiFix({
                    emoji: emojiMap[word]
                });
            }
            return word;
        }).join(' ');
    };

    marked.setOptions({
        breaks: false,
        pedantic: false,
        renderer: renderer,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        tables: true,
    });
    return marked;
});


/* jshint strict: true, undef: true, unused: true */
/* global define, flowchart, console, document, mermaid */

define('../component/markedRenderer',[
    'pastry/pastry',
    'pastry/dom/attr',
    'pastry/dom/query',
    'pastry/dom/style',
    './marked'
], function(
    pastry,
    domAttr,
    domQuery,
    domStyle,
    marked
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var each = pastry.each,
        destroy = pastry.destroy;

    var flowchartOptions = {
        'x': 0,
        'y': 0,
        'line-width': 2,
        'line-length': 40,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'grey',
        'element-color': 'grey',
        'fill': 'lightyellow',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        'scale': 1,
    };
    var flowchartInstanceCache = [];

    function drawFlowcharts(scope) {
        /*
         * scope is a node with structure like:
         *     <div class="flowchart">
         *         <div class="flowchart-graph"></div>
         *         <script class="flowchart-code">{%= code %}</script>
         *     </div>
         */
        each(flowchartInstanceCache, function(instance) {
            destroy(instance);
        });
        flowchartInstanceCache = [];
        each(domQuery.all('.flowchart', scope), function(container) {
            try {
                var codeElement = domQuery.one('.flowchart-code', container);
                var graphElement = domQuery.one('.flowchart-graph', container);
                var diagram = flowchart.parse(codeElement.innerHTML);
                diagram.drawSVG(graphElement, flowchartOptions);
                flowchartInstanceCache.push(diagram);
            } catch(e) {
                console.log(e);
            }
        });
    }
    function renderMermaidGraphs(scope) {
        /*
         * scope is the node to render in
         */
        scope = scope || document.body;
        try {
            mermaid.init(null, domQuery.all('.mermaid', scope));
        } catch(e) {
            console.log(e);
        }

        // fix GANTT diagrams (width of lanes is not set correctly) {
            var ganttGraphs = domQuery.all('.mermaid[data-type=gantt] svg', scope);
            each(ganttGraphs, function(svg) {
                var lanes = domQuery.all('g rect.section');
                each(lanes, function(lane) {
                    domAttr.set(lane, 'width', domStyle.get(svg, 'width'));
                });
            });
        // }
    }

    return function(container, markdownString) {
        container.innerHTML = marked(markdownString);
        renderMermaidGraphs(container); // render mermaid graphs
        drawFlowcharts(container);
    };
});


/* jshint ignore:start */
define('../template/tocAnchor',["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div data-hash="'+_e(hash)+'"></div>';}return _s;
}});
/* jshint ignore:end */;
/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('../component/toc',[
    'pastry/pastry',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/fmt/sprintf',
    'pastry/ui/Tree',
    '../template/tocAnchor'
], function(
    pastry,
    domConstruct,
    domQuery,
    sprintf,
    Tree,
    tmplTocAnchor
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var each = pastry.each;
    //var lc = pastry.lc;
    //var map = pastry.map;
    var toInt = pastry.toInt;
    var uuid = pastry.uuid;

    var tocTree = new Tree({
        onClick: function(node) {
            scrollToNode(node);
        },
        //onDblclick: function(node) {
            //scrollToNode(node);
        //}
    });

    function scrollToNode(node) {
        var anchorSelector = sprintf('[data-hash="%s"]', node.id);
        var anchorNode = domQuery.one(anchorSelector);
        if (anchorNode) {
            anchorNode.scrollIntoView(true);
        }
    }
    function getHeaderId(/*header*/) {
        //var idSeperater = '-';
        //var text = getHeaderText(header);
        //text = lc(text).replace(/\s/g, idSeperater)
            //.replace(/--/g, idSeperater)
            //.replace(/:-/g, idSeperater);
        //if (tocTree.nodeById[text]) {
            //text = uuid(text + idSeperater);
        //}
        //return text;
        return uuid();
    }
    function getHeaderLevel(header) {
        var tagName = header.tagName;
        return toInt(tagName.replace(/h/i, ''));
    }
    function getHeaderText(header) {
        return header.textContent || header.innerText || header.innerHTML;
    }
    function getHeaderSelector(level) {
        var headers = [];
        for (var i = 1; i <= level; i ++) {
            headers.push(sprintf('h%d', i));
        }
        return headers.join(',');
    }

    return function (article, container, maxLevel) {
        container = container || document.body;
        article = article || document.body;
        maxLevel = maxLevel || 3;
        var headers = article.querySelectorAll(getHeaderSelector(maxLevel));
        var currentNode;
        var nodeMetas = [];
        var nodeMetaById = {};

        each(headers, function(header) {
            var id = getHeaderId(/*header*/);

            var anchorNode = domConstruct.toDom(tmplTocAnchor({
                hash: id
            }));
            domConstruct.place(anchorNode, header, 'before');

            var level = getHeaderLevel(header);
            var meta = {
                id: id,
                isBranch: true,
                //isExpanded: false,
                name: getHeaderText(header),
                level: level,
                childIds: [],
            };
            if (currentNode) {
                if (currentNode.level < level) {
                    meta.parentId = currentNode.id;
                    currentNode.childIds.push(meta.id);
                } else {
                    var parentNode = nodeMetaById[currentNode.parentId];
                    while (parentNode) {
                        if (parentNode.level >= level) {
                            parentNode = nodeMetaById[parentNode.parentId];
                        } else {
                            break;
                        }
                    }
                    if (parentNode) {
                        meta.parentId = parentNode.id;
                        parentNode.childIds.push(meta.id);
                    }
                }
            }
            nodeMetas.push(meta);
            nodeMetaById[id] = meta;
            currentNode = meta;
        });
        each(nodeMetas, function(n) {
            if (n.childIds.length === 0) {
                n.isBranch = false;
            }
            tocTree.addNode(n);
        });

        tocTree.placeAt(container);
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define, setTimeout */

define('main',[
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/hotkey',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/io/ajax',
    '../global/CONST',
    '../component/Modal',
    '../component/Resizer',
    '../component/markedRenderer',
    '../component/toc'
    //'../component/remarkableRenderer'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domHotkey,
    domQuery,
    domStyle,
    ajax,
    CONST,
    Modal,
    Resizer,
    markdownRenderer,
    toc
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    // preview {
        var previewerDomNode = domQuery.one('#markdown-previewer');
        var content = domQuery.one('script#markdown-content').innerHTML;
        markdownRenderer(previewerDomNode, content);
    // }
    // resizer {
        var articleNode = domQuery.one('.markdown-container');
        new Resizer(articleNode, {
            directions: ['e', 'w'],
            minWidth: 400,
            maxWidth: 1400
        });
    // }
    // toc {
        setTimeout(function() { // optimize markdown rendering
            var tocNode = domQuery.one('#toc');
            var hideOrShowBtn = domQuery.one('#hide-or-show-toc');
            var hideOrShowIcon = domQuery.one('.fa', hideOrShowBtn);
            var headerNode = domQuery.one('header', tocNode);
            var treeHolderNode = domQuery.one('.tree-holder', tocNode);
            var isShown = true;
            function hideToc() {
                domClass.remove(hideOrShowIcon, 'fa-angle-right');
                domClass.add(hideOrShowIcon, 'fa-angle-left');
                domStyle.hide(headerNode);
                domStyle.hide(treeHolderNode);
                domStyle.set(tocNode, 'width', '0');
                isShown = false;
            }
            function showToc() {
                domClass.remove(hideOrShowIcon, 'fa-angle-left');
                domClass.add(hideOrShowIcon, 'fa-angle-right');
                domStyle.show(headerNode);
                domStyle.show(treeHolderNode);
                domStyle.set(tocNode, 'width', '160px');
                isShown = true;
            }

            toc(articleNode, treeHolderNode, 3);

            new Resizer(tocNode, {
                directions: ['w'],
                minWidth: 140,
                maxWidth: 1400,
            });
            new Resizer(treeHolderNode, {
                directions: ['s'],
            });

            domEvent.on(hideOrShowBtn, 'click', function() {
                if (isShown) {
                    hideToc();
                } else {
                    showToc();
                }
            });
            hideToc(); // hide by default
        }, 300);
    // }
});


