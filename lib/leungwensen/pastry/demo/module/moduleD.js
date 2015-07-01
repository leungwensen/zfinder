
define('moduleD', [
    './moduleA',
    './moduleB'
], function(
    A,
    B
) {
    console.log('defined D');
    console.log('required ' + A + ' and ' + B);
    return 'D';
});

define('moduleE', [
    './moduleD',
], function(
    D
) {
    console.log('defined E');
    console.log('required ' + D);
    return 'E';
});

define('moduleF', [
    './moduleE',
], function(
    E
) {
    console.log('defined F');
    console.log('required ' + E);
    return 'F';
});

