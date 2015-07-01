/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/ui/Collapse', [
    'pastry/pastry',
    'pastry/oop/declare',
    'pastry/ui/Component',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/utils',
    'pastry/template/collapse',
    'pastry/template/collapseSection'
], function (
    pastry,
    declare,
    Component,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    domUtils,
    templateWrapper,
    templateSection
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Collapse component
     */

    var NS         = 'p_u_collapse',
        NS_SECTION = 'p_u_collapse_section',

        each       = pastry.each,
        extend     = pastry.extend,
        isArray    = pastry.isArray,
        isDomNode  = domUtils.isString,
        isFunction = pastry.isFunction,
        isString   = pastry.isString,
        uuid       = pastry.uuid,

        Section = declare('pastry/ui/CollapseSection', [Component], {
            constructor: function (option) {
                var instance = this;
                extend(instance, {
                    isOpen: false
                }, option);
                domEvent.on(instance.head, 'click', function () {
                    instance._onClick();
                });
                return instance.isOpen ? instance.open() : instance.close();
            },
            _onClick: function () {
                var instance = this;
                runIfIsFunction(instance.onClick, instance);
                return instance;
            },
            open: function () {
                var instance = this;
                instance.isOpen = true;
                domClass.add(instance.body, 'in');
                // domStyle.show(instance.body);
                return instance;
            },
            close: function () {
                var instance = this;
                instance.isOpen = false;
                domClass.remove(instance.body, 'in');
                // domStyle.hide(instance.content);
                return instance;
            },
            toggle: function () {
                var instance = this;
                domClass.toggle(instance.body, 'in');
                // return instance.isOpen ? instance.close() : instance.open();
                return instance;
            },
            destroy: function () {
                var instance = this;
                domConstruct.destroy(instance.head);
                domConstruct.destroy(instance.body);
                Component.prototype.destroy.call(instance);
                return instance;
            }
        }),
        Collapse = declare('pastry/ui/Collapse', [Component], {
            constructor: function (element, option) {
                var instance = this;
                option = option || {};
                if (isDomNode(element)) {
                    option.domNode = element;
                } else {
                    option = element;
                }
                extend(instance, {
                    isAccordion : true,
                    _sections   : {}
                }, option);
                instance.id = instance.id || uuid(NS);
                if (!instance.domNode) {
                    instance.domNode = domConstruct.toDom(templateWrapper(instance));
                } else {
                    instance.id = instance.domNode.id || instance.id;
                }
                each(domQuery.all('.panel', instance.domNode), function (element) {
                    instance.addSection(element);
                });
                if (isArray(instance.sections)) {
                    each(instance.sections, function (section) {
                        instance.addSection(section);
                    });
                }
                return instance;
            },
            eachSection: function (callback) {
                var instance = this;
                each(instance._sections, function (section) {
                    runIfIsFunction(callback, section);
                });
                return instance;
            },
            addSection: function (option) {
                /*
                 * option can be an element(or string) or object
                 */
                var domNode,
                    id,
                    section,
                    onClick,
                    instance = this;
                if (option instanceof Section) {
                    instance._sections[option.id] = option;
                    return instance;
                }

                if (isDomNode(option) || isString(option)) {
                    domNode = domQuery.one(option);
                    option = {
                        domNode : domNode
                    };
                } else {
                    if (option.head && isString(option.head)) {
                        domNode = domConstruct.toDom(templateSection(option));
                        extend(option, {
                            domNode: domNode
                        });
                    } else if (option.domNode) {
                        domNode = option.domNode;
                    }
                }
                if (!option.id) {
                    option.id = domNode.id || uuid(NS_SECTION);
                }
                id = option.id;
                extend(option, {
                    head : domQuery.one('.panel-title [data-toggle=collapse]', domNode),
                    body : domQuery.one('.panel-collapse.collapse', domNode)
                });

                onClick = option.onClick;
                option.onClick = function (obj) {
                    runIfIsFunction(onClick, obj);
                    instance.toggleSection(obj.id);
                };

                section = new Section(option);
                instance._sections[id] = section;
                if (!domUtils.contains(section.domNode, instance.domNode)) {
                    section.placeAt(instance.domNode);
                }
                return instance;
            },
            removeSection: function (id) {
                var instance = this;
                instance._sections[id].destroy();
                delete instance._sections[id];
                return instance;
            },
            openSection: function (id) {
                var instance = this,
                    section  = instance._sections[id];
                if (instance.isAccordion) {
                    instance.eachSection(function (section) {
                        section.close();
                    });
                }
                section.open();
                return instance;
            },
            closeSection: function (id) {
                var instance = this;
                instance._sections[id].close();
                return instance;
            },
            toggleSection: function (id) {
                var instance = this,
                    section  = instance._sections[id];
                return section.isOpen ? instance.closeSection(id) : instance.openSection(id);
            },
            destroy: function () {
                var instance = this;
                instance.eachSection(function (section) {
                    section.destroy();
                });
                Component.prototype.destroy.call(instance);
                instance = null;
            }
        });

    Collapse.Section = Section;
    Collapse.render  = function (domNode, option) {
        domNode = domQuery.one(domNode);
        return new Collapse(domNode, option);
    };

    function runIfIsFunction (func, args) {
        if (isFunction(func)) {
            func.call(null, args);
        }
    }

    return Collapse;
});

