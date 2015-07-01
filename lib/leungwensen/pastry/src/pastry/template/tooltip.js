/* jshint ignore:start */
define("pastry/template/tooltip", ["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="tooltip" id="'+_e(id)+'"><div class="tooltip-arrow"></div><div class="tooltip-body"></div></div>';}return _s;
}});
/* jshint ignore:end */