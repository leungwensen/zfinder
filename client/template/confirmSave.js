/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<p>Save current file first?</p><div class="btn-group"><button class="btn u-1-3 btn-error donot-save">Don\'t Save</button><button class="btn u-1-3 btn-success confirm-save">Save</button><button class="btn u-1-3 cancel-save">Cancel</button></div>';}return _s;
}});
/* jshint ignore:end */