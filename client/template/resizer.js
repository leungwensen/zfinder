/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="resizer-wrapper resizer-d resizer-d-'+_e(direction)+'" data-direction="'+_e(direction)+'"><div class="resizer-handler"></div></div>';}return _s;
}});
/* jshint ignore:end */