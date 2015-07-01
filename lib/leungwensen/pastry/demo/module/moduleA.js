
define('moduleA', [
    // './moduleB'
], function(
    // B
) {
    // console.log('require ' + B);
    console.log('moduleA');
    return 'A';
});

