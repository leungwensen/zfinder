/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="flowchart"><script type="text/template" class="flowchart-code">'+_e(code)+'</script><div class="flowchart-graph"></div></div>';}return _s;
}});
/* jshint ignore:end */