/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div id="open-path"></div><div class="btn-group"><button class="btn u-1-2 btn-success confirm-open">Open</button><button class="btn u-1-2 cancel-open">Cancel</button></div>';}return _s;
}});
/* jshint ignore:end */