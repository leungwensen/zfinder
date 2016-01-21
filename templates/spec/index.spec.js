{% var varName = helper.camelise(data.name); %}
var {%= varName %} = require('../lib/index.js');
describe('{%= data.name %}', function () {
    it('exists', function () {
        expect(typeof {%= varName %}).toEqual('object');
    });
});
