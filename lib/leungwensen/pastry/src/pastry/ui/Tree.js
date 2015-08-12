/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/ui/Tree', [
    'pastry/pastry',
    'pastry/oop/declare',
    'pastry/bom/utils',
    'pastry/dom/attr',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/data',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/dom/utils',
    'pastry/ui/Component',
    'pastry/template/tree',
    'pastry/template/treeNode'
], function(
    pastry,
    declare,
    bomUtils,
    domAttr,
    domClass,
    domConstruct,
    domData,
    domEvent,
    domQuery,
    domStyle,
    domUtils,
    Component,
    templateWrapper,
    templateNode
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Tree
     * @TODO :
     *   loading
     *   moveTo implement optimizing
     */

    var NS = 'p_u_tree',
        NS_NODE = 'p_u_tree_node';

    var INDENT_LENGTH = 16; // indent for one level

    var NODE_SELECTED_CLASS = 'selected';

    var SELECTOR_NODE = '.tree-node';

    // icon
    var BRANCH_ICON_CLASS = 'fa fa-folder',
        BRANCH_EXPANDED_ICON_CLASS = 'fa fa-folder-open',
        LEAF_ICON_CLASS = 'fa fa-file';

    // expander
    var EXPANDER_ICON_CLASS = 'fa fa-plus-square-o',
        EXPANDER_EXPANDED_ICON_CLASS = 'fa fa-minus-square-o',
        EXPANDER_TEXT = '&blacktriangleright;',
        EXPANDER_EXPANDED_TEXT = '&blacktriangledown;';

    // helpers {
    var destroy = pastry.destroy,
        difference = pastry.difference,
        each = pastry.each,
        every = pastry.every,
        extend = pastry.extend,
        hasKey = pastry.hasKey,
        indexOf = pastry.indexOf,
        isArray = pastry.isArray,
        onDomEvent = domEvent.on,
        remove = pastry.remove,
        uuid = pastry.uuid;

    function getTreeNodeFromDelegateEventAndTree(e, tree) {
        return tree.nodeById[domData.get(e.delegateTarget, 'id')];
    }
    function queryFilter (target, queryObj) {
        return every(queryObj, function (value, key) {
            return target[key] === value;
        });
    }
    function hasModifier(e) {
        return (e.ctrlKey || e.metaKey || e.shiftKey);
    }
    function processDndStatus(nodes) {
        each(nodes, function(node) {
            if (node.isDroppable) {
                domAttr.remove(node.domNode, 'droppable');
            }
            processDndStatus(node.children);
        });
    }
    function resumeDndStatus(nodes) {
        each(nodes, function(node) {
            if (node.isDroppable) {
                domAttr.set(node.domNode, 'droppable', 'true');
            }
            resumeDndStatus(node.children);
        });
    }

    var TreeNode = declare('pastry/ui/tree/Node', [Component], {
        constructor: function (data) {
            if (data instanceof TreeNode) {
                return data;
            }
            var node = this;
            // initialize private attributes {
                extend(node, {
                    // attributes {
                        isRoot: false,
                        isBranch: false,
                        isLeaf: true,
                        isExpanded: true,
                        isExpandable: false,
                        isSelected: false,
                        isChecked: false,
                        isFocused: false,
                        isLoaded: false,
                        isDraggable: false,
                        isDroppable: false,
                    // }
                    // elements {
                        domNode: null,
                        indenterElement: null,
                        expanderElement: null,
                        labelElement: null,
                        iconElement: null,
                    // }
                    // connections {
                        children: [],
                        parent: null
                    // }
                }, data);

                each([
                    'canDnD',
                    'hasIcon',
                    'hasExpanderIcon',
                    'hasCheckbox'
                ], function (extraAttr) {
                    if (!hasKey(node, extraAttr)) {
                        node[extraAttr] = node.tree[extraAttr] || false;
                    }
                });
            // }
            return node;
        },
        // attributes {
            id: null ,
            label: null , // label
            title: null , // title
            indent: 0    , // indent of the node
            parentId: null ,
            iconClass: null ,
            expanderIconClass: null ,
            expanderText: null ,
        // }
        // private methods {
            _setLabel: function () {
                var node = this,
                    label;
                if (node.tree.getLabel) {
                    label = node.tree.getLabel(node);
                } else {
                    // alias
                    label = node.label || node.name || '';
                }
                node.label = label;
                if (node.labelElement) {
                    node.labelElement.innerHTML = label;
                }
                return node;
            },
            _setTitle: function() {
                var node = this;
                if (node.tree.getTitle) {
                    node.title = node.tree.getTitle(node);
                }
                return node;
            },
            _setIconClass: function () {
                var node = this,
                    iconClass;
                if (node.hasIcon) {
                    if (node.tree.getIconClass) {
                        iconClass = node.tree.getIconClass(node);
                    } else {
                        if (node.isBranch) {
                            iconClass = node.isExpanded ?
                                BRANCH_EXPANDED_ICON_CLASS : BRANCH_ICON_CLASS;
                        } else {
                            iconClass = LEAF_ICON_CLASS;
                        }
                    }
                    node.iconClass = iconClass;
                    if (node.iconElement) {
                        domClass.clear(node.iconElement);
                        domClass.add(node.iconElement, 'tree-node-icon ' + iconClass);
                    }
                }
                return node;
            },
            _setSelectedClass: function () {
                var node = this,
                    domNode = node.domNode;
                if (domNode) {
                    domClass[node.isSelected ? 'add' : 'remove'](domNode, NODE_SELECTED_CLASS);
                }
                return node;
            },
            // DnD 相关 {
                _setDnD: function() {
                    var node = this,
                        tree = node.tree;
                    if (node.canDnD) {
                        node.isDraggable = tree.getDraggable ? tree.getDraggable(node) : true;
                        node.isDroppable = tree.getDroppable ? tree.getDroppable(node) : node.isBranch;
                    }
                    return node;
                },
            // }
            _setExpanderIconClass: function () {
                var node = this,
                    expanderIconClass;
                if (node.isExpandable && node.hasExpanderIcon) {
                    if (node.tree.getExpanderIconClass) {
                        expanderIconClass = node.tree.getExpanderIconClass(node);
                    } else {
                        expanderIconClass = node.isExpanded ?
                            EXPANDER_EXPANDED_ICON_CLASS : EXPANDER_ICON_CLASS;
                    }
                    node.expanderIconClass = expanderIconClass;
                    if (node.expanderElement) {
                        domClass.clear(node.expanderElement);
                        domClass.add(node.expanderElement, 'tree-node-expander ' + expanderIconClass);
                    }
                }
                return node;
            },
            _setExpanderText: function () {
                var node = this,
                    expanderText;
                if (node.isExpandable && !node.hasExpanderIcon) {
                    if (node.tree.getExpanderText) {
                        expanderText = node.tree.getExpanderText(node);
                    } else {
                        expanderText = node.isExpanded ?
                            EXPANDER_EXPANDED_TEXT : EXPANDER_TEXT;
                    }
                    node.expanderText = expanderText;
                    if (node.expanderElement) {
                        node.expanderElement.innerHTML = expanderText;
                    }
                }
                return node;
            },
            _setIndent: function () {
                var node = this,
                    indent;
                indent = INDENT_LENGTH * node.getLevel(); // 计算缩进
                node.indent = indent;
                if (node.indenterElement) {
                    domStyle.set(node.indenterElement, 'margin-left', indent + 'px');
                }
                return node;
            },
            _setLoaded: function () {
                var node = this;
                node.isLoaded = true;
                node.eachChild(function (child) {
                    child.load();
                });
            },
            _setSelected: function (multiple) {
                var node = this,
                    tree = node.tree;
                if (!multiple) { // 如果只是单选
                    each(tree.selectedNodes, function(n) {
                        n.isSelected = false;
                        n._updateLayout();
                    });
                    tree.selectedNodes = [];
                }
                node.isSelected = true;
                tree.selectedNode = node; // 每次选择都取最新的
                tree.selectedNodes.push(node);
                return node._updateLayout();
            },
            _reload: function () {
                var node = this;
                node.eachChild(function (child) {
                    child.reload();
                });
            },
            _updateLayout: function () {
                return this
                    ._setLabel()
                    ._setTitle()
                    ._setIconClass()
                    ._setSelectedClass()
                    ._setExpanderIconClass()
                    ._setExpanderText()
                    ._setIndent();
            },
            _canMoveTo: function (target) {
                var node = this;
                if (
                    target.id === node.id || // 不能移动到自身
                    target.isLeaf || // 不能移动到叶子节点
                    indexOf(node.children, target) > -1 || // 不能移动到子节点
                    node.parent === target || // 不必要移动到一层父节点
                    indexOf(target.getAncestors(), node) > -1 // 也不能移动到子孙节点
                ) {
                    return false;
                }
                return true;
            },
            _isAncestorsExpanded: function () {
                return every(this.getAncestors(), function (ancestor) {
                    return ancestor.isExpanded;
                });
            },
        // }
        // methods {
            addChild: function (child) {
                var node = this;
                if (indexOf(node.children, child) === -1) {
                    node.children.push(child);
                }
                child.isRoot   = false;
                child.parentId = node.id;
                child.parent   = node;
                if (child.isLoaded) {
                    child.reload();
                    if (child._isAncestorsExpanded()) {
                        child.show();
                    } else {
                        child.hide();
                    }
                }
                return node;
            },
            removeChild: function (child) {
                var node = this,
                    tree = node.tree,
                    index;
                if ((index = indexOf(node.children, child)) !== -1) {
                    remove(node.children, index);
                    if (child.isLoaded && node.isExpanded) {
                        child.hide();
                    }
                    child.eachChild(function(c) {
                        child.removeChild(c);
                    });
                    // remove nodes from selectedNodes and nodes {
                        tree.nodes = difference(tree.nodes, [child]);
                        tree.selectedNodes = difference(tree.selectedNodes, [child]);
                    // }
                    child.destroy();
                }
                return node;
            },
            removeChildren: function() {
                var node = this;
                node.tree.removeNodes(node.children);
                return node;
            },
            moveTo: function (target) {
                /*
                 * @description: move to a target node
                 */
                var node = this,
                    tree = node.tree,
                    beforeMove = tree.beforeMove,
                    onMove = tree.onMove;
                if (node._canMoveTo(target)) {
                    beforeMove(node, target, function() {
                        if (node.parent) {
                            node.parent.removeChild(node);
                        }
                        target.addChild(node);
                        onMove(node, target);
                    });
                }
                return node;
            },
            eachChild: function (callback) {
                /*
                 * @description: collapse the node
                 */
                var node = this;
                each(node.children, function (child) {
                    callback(child);
                });
                return node;
            },
            getParent: function () {
                var node = this,
                    parentId = node.parentId;
                if (node.parent) {
                    return node.parent;
                }
                if (typeof parentId !== 'undefined') {
                    return node.tree.nodeById[parentId];
                }
                return null;
            },
            getAncestors: function () {
                var node = this,
                    ancestors = [];
                while(node = node.getParent()) {
                    ancestors.push(node);
                }
                return ancestors;
            },
            getLevel: function () {
                return this.getAncestors().length;
            },
            select: function (multiple) {
                /*
                 * @description: set to be selected
                 */
                return this._setSelected(multiple);
            },
            show: function () {
                /*
                 * @description: show the node
                 */
                var node = this;
                Component.prototype.show.apply(node);
                if (node.isExpanded) {
                    node.eachChild(function (child) {
                        child.show();
                    });
                }
                return node;
            },
            hide: function () {
                /*
                 * @description: hide the node
                 */
                var node = this;
                Component.prototype.hide.apply(node);
                if (node.isExpanded) {
                    node.eachChild(function (child) {
                        child.hide();
                    });
                }
                return node;
            },
            expand: function () {
                /*
                 * @description: expand the node
                 */
                var node = this;
                node.isExpanded = true;
                node.eachChild(function (child) {
                    child.show();
                });
                node.tree.onExpand(node);
                return node._updateLayout();
            },
            collapse: function () {
                /*
                 * @description: collapse the node
                 */
                var node = this;
                node.isExpanded = false;
                node.eachChild(function (child) {
                    child.hide();
                });
                node.tree.onCollapse(node);
                return node._updateLayout();
            },
            toggle: function () {
                /*
                 * @description: expand or collapse the node
                 */
                var node = this;
                return node.isExpanded ? node.collapse() : node.expand();
            },
            render: function () {
                /*
                 * @description: render the node,
                 *      get attributes
                 *      get Elements
                 */
                var node = this,
                    domNode;
                if (node._rendered) {
                    return;
                }
                // get attributes {
                    if (!node.parent) {
                        node.isRoot = true;
                    }
                    if (node.children.length) {
                        node.isBranch = true;
                        node.isLeaf = false;
                    }
                    if (node.isBranch) { // 防止预设的枝干节点判断出错
                        node.isLeaf = false;
                    }
                    node.isExpandable = node.isBranch;
                    node._setDnD();
                // }
                // get nodes {
                    domNode = node.domNode = node.domNode ||
                        domConstruct.toDom(templateNode(node, true)); // unescape
                    node.indenterElement = node.indenterElement ||
                        domQuery.one('.tree-node-indenter', domNode);
                    node.expanderElement = node.expanderElement ||
                        domQuery.one('.tree-node-expander', domNode);
                    node.labelElement = node.labelElement ||
                        domQuery.one('.tree-node-label', domNode);
                    node.iconElement = node.iconElement ||
                        domQuery.one('.tree-node-icon', domNode);
                // }
                node._updateLayout();
                node._rendered = true;
                if (!node._isAncestorsExpanded()) {
                    node.hide();
                }
                return node;
            },
            load: function () {
                /*
                 * @description: load the node to the tree;
                 */
                var node = this;
                var parent = node.parent;
                if (!node.isLoaded) {
                    if (node.isRoot) {
                        node.placeAt(node.tree.bodyElement, 'last');
                        node._setLoaded();
                    } else if (parent && parent.isLoaded) {
                        var lastChildIndex = parent.children.length - 1;
                        var lastChild = parent.children[lastChildIndex];
                        if (lastChild === node) {
                            lastChild = parent.children[lastChildIndex - 1];
                        }
                        if (lastChild && lastChild.isLoaded) {
                            while (lastChild.children.length) {
                                lastChild = lastChild.children[lastChild.children.length -1];
                            }
                            node.placeAt(lastChild.domNode, 'after');
                        } else {
                            node.placeAt(parent.domNode, 'after');
                        }
                        node._setLoaded();
                    }
                }
                return node;
            },
            reload: function () {
                var node = this;
                if (!node.isLoaded) {
                    node.load();
                } else {
                    //node._updateLayout();
                    if (node.isRoot) {
                        node.placeAt(node.tree.bodyElement, 'first');
                        node._reload();
                    } else if (node.parent.isLoaded) {
                        node.placeAt(node.parent.domNode, 'after');
                        node._reload();
                    }
                }
                return node;
            },
            update: function (option) {
                return extend(this, option).render();
            },
            destroy: function() {
                var node = this;
                domConstruct.destroy(node.domNode);
                destroy(node);
                node = null;
            }
        // }
    });


    var Tree = declare('pastry/ui/Tree', [Component], {
        // constructor {
            constructor: function (option) {
                option = option || {};
                var tree = this,
                    domNode;

                extend(tree, {
                    id: uuid(NS),
                    data: [],
                    nodes: [],   // node instances
                    nodeById: {},   // node instances by id
                    domNode: null, // element
                    headElement: null, // element
                    bodyElement: null, // element
                    selectedNodes: [], // selected node
                }, option);
                // render domNode {
                    if (option.domNode) {
                        tree.domNode = domQuery.one(option.domNode);
                    }
                    if (!tree.domNode) {
                        tree.domNode = domConstruct.toDom(templateWrapper(tree));
                    }
                    domNode = tree.domNode;
                // }
                // get other dom nodes {
                    if (tree.hasHead) {
                        tree.headElement = domQuery.one('thead', domNode);
                    }
                    tree.bodyElement = domQuery.one('tbody', domNode);
                // }
                // add nodes {
                    tree.addNodes(tree.data);
                    delete tree.data;
                // }
                // bind events {
                    // dom events {
                        onDomEvent(domNode, 'click', '.tree-node-expander', function (e) {
                            getTreeNodeFromDelegateEventAndTree(e, tree).toggle();
                        });
                        onDomEvent(domNode, 'click', SELECTOR_NODE, function (e) {
                            var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                            tree.onClick(treeNode);
                            // selected {
                                treeNode.select(hasModifier(e));
                                tree.onSelect(treeNode);
                            // }
                        });
                        onDomEvent(domNode, 'contextmenu', SELECTOR_NODE, function (e) {
                            var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                            e.preventDefault();
                            tree.onContextmenu(treeNode, e);
                        });
                        onDomEvent(domNode, 'dblclick', SELECTOR_NODE, function (e) {
                            var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                            tree.onDblclick(treeNode);
                        });
                    // }
                    // DnD drag and drop {
                        var dragoverClass = 'dragover',
                            droppableSelector = SELECTOR_NODE + '[droppable="true"]';

                        if (!bomUtils.isOpera && domUtils.canDnD) { // 只用html5特性来实现
                            onDomEvent(domNode, 'dragstart', SELECTOR_NODE, function(e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                if (indexOf(tree.selectedNodes, treeNode) === -1) {
                                    treeNode.select();
                                }
                                e.dataTransfer.effectAllowed = 'copy';
                                e.dataTransfer.setData('id', treeNode.id);
                                processDndStatus(tree.selectedNodes);
                            });
                            onDomEvent(domNode, 'dragend', SELECTOR_NODE, function() {
                                resumeDndStatus(tree.selectedNodes);
                                var stillInOver = domQuery.one('.' + dragoverClass, domNode);
                                if (stillInOver) {
                                    domClass.remove(stillInOver, dragoverClass);
                                }
                            });
                            onDomEvent(domNode, 'dragover', droppableSelector, function(e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                domClass.add(treeNode.domNode, dragoverClass);
                                e.preventDefault();
                                return false;
                            });
                            onDomEvent(domNode, 'dragleave', droppableSelector, function(e) {
                                var treeNode = getTreeNodeFromDelegateEventAndTree(e, tree);
                                domClass.remove(treeNode.domNode, dragoverClass);
                            });
                            onDomEvent(domNode, 'drop', droppableSelector, function(e) {
                                var target = getTreeNodeFromDelegateEventAndTree(e, tree);
                                if (e.stopPropagation) {
                                    e.stopPropagation(); // stops the browser from redirecting.
                                }
                                each(tree.selectedNodes, function(node) {
                                    node.moveTo(target);
                                });
                                return false;
                            });
                        } else {
                            console.warn('drag and drop feature not supported');
                        }
                    // }
                // }
                return tree;
            },
        // }
        // attributes {
            canDnD: false,
            extraColumns: [], // extra columns
            hasCheckbox: false,
            hasExpanderIcon: false,
            hasHead: false,
            hasIcon: false,
            treeColumnName: 'tree',
        // }
        // private methods {
            _processData: function (items) {
                var tree = this;

                // add id, extraColumns, tree, etc {
                    each(items, function (item) {
                        var id = item.id;
                        extend(item, {
                            extraColumns: tree.extraColumns,
                            tree: tree,
                        });
                        if (typeof item.id === 'undefined') {
                            id = item.id = uuid(NS_NODE);
                        }
                        if (!tree.nodeById[id]) {
                            tree.nodeById[item.id] = item; // for counting length
                        }
                    });
                // }
                return tree;
            },
            _processNodes: function (nodes) {
                /*
                 * @description: processing nodes
                 */
                var tree = this,
                    parentId,
                    parent;

                each(nodes, function (node) {
                    // add parent-child connections {
                        parent = node.getParent();
                        if (node.parentId !== null) {
                            if (parent) {
                                node.parent = parent;
                                parent.addChild(node);
                            } else {
                                throw 'node with id ' + parentId + ' does not exists';
                            }
                        }
                    // }
                });
                return tree;
            },
        // }
        // methods {
            addNodes: function (items) {
                /*
                 * @description: add nodes
                 */
                var tree  = this,
                    nodes = [];

                items = items || [];
                if (!isArray(items)) {
                    items = [items];
                }
                tree._processData(items);
                // turn items into nodes {
                    each(items, function (item) {
                        var id = item.id,
                            node = tree.nodeById[id];
                        if (node instanceof TreeNode) {
                            return;
                        }
                        item = new TreeNode(item);
                        tree.nodes.push(item);
                        nodes.push(item);
                        tree.nodeById[item.id] = item;
                    });
                // }
                // process nodes {
                    tree._processNodes(nodes);
                // }
                // load nodes {
                    tree.eachNode(function (node) {
                        node.render(); // 必须和 load 分开做
                    });
                    tree.eachNode(function (node) {
                        node.load();
                    });
                // }
                return tree;
            },
            addNode: function (item) {
                return this.addNodes([item]);
            },
            removeNodes: function (nodes) {
                /*
                 * @description: remove nodes
                 */
                var tree = this,
                    parent;
                if (!isArray(nodes)) {
                    nodes = [nodes];
                }
                tree.eachNode(nodes, function (node) {
                    delete tree.nodeById[node.id];
                    if (parent = node.parent) {
                        parent.removeChild(node);
                    }
                });
                return tree;
            },
            queryNodes: function (query) {
                /*
                 * @description: find nodes
                 */
                var tree  = this;
                if (isArray(query)) {
                    return query;
                } else if (pastry.isPlainObject(query)) {
                    return pastry.filter(tree.nodes, function (node) {
                        return queryFilter(node, query);
                    });
                }
            },
            eachNode: function (query, callback) {
                /*
                 * @description: processing each node
                 */
                var tree = this,
                    nodes = [];
                if (!pastry.isFunction(query)) {
                    nodes = tree.queryNodes(query);
                } else {
                    nodes = tree.nodes;
                    callback = query;
                }
                each(nodes, function (node) {
                    callback(node);
                });
                return tree;
            },
            expandNodes: function (/* node */) {
            },
        // }
        // 自定义相关 {
            getDraggable: null, // 默认关闭DnD属性
            getDroppable: null, // 默认关闭DnD属性
            getExpanderIconClass: null,
            getExpanderText: null,
            getIconClass: null,
            getLabel: null,
            getTitle: null,
        // }
        // events {
            // before {
                beforeMove: function (fromNode, toNode, callback) {
                    callback(fromNode, toNode);
                },
            // }
            // after {
                onClick: function (/* node, e */) { },
                onContextmenu: function (/* node, e */) { },
                onDblclick: function (/* node, e */) { },
                onRightClick: function (/* node, e */) { },
                onExpand: function (/* node */) { },
                onCollapse: function (/* node */) { },
                onSelect: function (/* node */) { },
                onMove: function (/* fromNode, toNode */) { }
            // }
        // }
    });

    // TODO 根据dom结构render树 {
        // Tree.render = function (/* domNode, option */) {
        // };
    // }

    Tree.Node = TreeNode;
    return Tree;
});

