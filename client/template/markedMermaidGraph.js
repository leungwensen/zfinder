/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='';if (valid) { _s+='<div class="mermaid" data-line="'+_e(lineNumber)+'">'+_e(code)+'</div>';} else { _s+='<pre data-line="'+_e(lineNumber)+'">'+_e(error)+'</pre>';} _s+='';}return _s;
}});
/* jshint ignore:end */