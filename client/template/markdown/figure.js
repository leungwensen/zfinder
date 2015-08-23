/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<figure><img src="'+_e(href)+'" alt="'+_e(text)+'" title="'+_e(title)+'"/><figcaption>'+_e(text)+'</figcaption></figure>';}return _s;
}});
/* jshint ignore:end */