{% var varName = helper.camelise(name); %}
var {%= varName %} = require('../dist/index.js');
describe('{%= name %}', function () {
    it('exists', function () {
        expect(typeof {%= varName %}).toEqual('object');
    });
});
