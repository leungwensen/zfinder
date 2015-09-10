/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="mermaid" data-type="'+_e(type)+'">'+_e(code)+'</div>';}return _s;
}});
/* jshint ignore:end */