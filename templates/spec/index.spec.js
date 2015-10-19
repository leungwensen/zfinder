{% var varName = helper.camelise(name); %}
var {%= varName %} = require('../lib/index.js');
describe('{%= name %}', function () {
    it('exists', function () {
        expect(typeof {%= varName %}).toEqual('object');
    });
});
