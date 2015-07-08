/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="modal"><header class="modal-header"><span class="modal-title">'+_e(title)+'</span><span class="modal-close float-right fa fa-close"></span></header><div class="modal-body"></div></div>';}return _s;
}});
/* jshint ignore:end */