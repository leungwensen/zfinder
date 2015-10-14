{% var varName = helper.camelise(name); %}
var {%= varName %} = require('../dist/index.js');
{% if (type === 'browser') { %}
var assert = chai.assert;

// NOTICE:
// you should start a static server in the root of this project
// then run this test

describe('{%= name %}', function () {
    it('exists', function () {
        assert.typeOf({%= varName %}, 'object');
    });
});
{% } else if (type === 'node') { %}
describe('{%= name %}', function () {
    it('exists', function () {
        expect(typeof {%= varName %}).toEqual('object');
    });
});
{% } %}
