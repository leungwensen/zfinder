/* jshint ignore:start */
define("pastry/template/collapseSection", ["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse">'+_e(head)+'</a></h4></div><div class="panel-collapse collapse"><div class="panel-body">'+_e(body)+'</div></div></div>';}return _s;
}});
/* jshint ignore:end */