/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='';helper.each(files, function(file) { _s+='<div class="search-result"><header><span class="'+_e(file.iconClass)+'"></span><a href="'+_e(file.relativePathname)+'" target="_blank">'+_e(file.relativePathname)+'</a></header>';if (file.matchedLines) { _s+='<section class="body">';helper.each(file.matchedLines, function(line) { _s+='<div class="line"><span class="line-number">'+_e(line[0])+'</span><span class="line-content">'+_e(line[1])+'</span></div>';}); _s+='</section>';} _s+='</div>';}); _s+='';}return _s;
}});
/* jshint ignore:end */