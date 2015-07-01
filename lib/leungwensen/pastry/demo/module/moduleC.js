
define([
    // 'ui/Tree',
    './moduleA',
    './moduleB'
], function(
    // Tree,
    A,
    B
) {
    console.log('require module ' + A + ' and ' + B);
    console.log('moduleC');
    // console.log(Tree);
    return 'C';
});

