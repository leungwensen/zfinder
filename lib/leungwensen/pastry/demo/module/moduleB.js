
define('moduleB', [
    './moduleA'
], function(
    A
) {
    console.log('require module ' + A);
    console.log('moduleB');
    return 'B';
});

