/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<li class="task-list-item"><input type="checkbox" disabled ';if (checked) { _s+=' checked ';} _s+='>'+_e(text)+'</li>';}return _s;
}});
/* jshint ignore:end */