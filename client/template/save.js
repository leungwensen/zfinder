/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="form"><div class="control-group"><label class="u-1-5 align-right" for="save-filename">Filename</label><input class="u-4-5" id="save-filename" type="text" placeholder="filename"></div><div class="control-group"><label class="u-1-5 align-right" for="save-location">Location</label><div class="u-4-5" id="save-location"></div></div></div><div class="btn-group"><button class="btn u-1-2 btn-success confirm-save">Save</button><button class="btn u-1-2 cancel-save">Cancel</button></div>';}return _s;
}});
/* jshint ignore:end */