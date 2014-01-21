define("common/main",["bui/common","bui/tree","bui/tab"],function(b){var g=window,h=b("bui/common"),e=b("bui/tree"),c=b("bui/tab");function f(l){window.topManager=l}function d(l,m){if(l.indexOf("?")!==-1){return l+"&"+m}else{return l+"?"+m}}function a(l){l=l||"";var m="#"+l;location.hash=m}function j(){var o=location.hash,l="",m=o.lastIndexOf("/"),n=null;if(!o){return null}l=o.replace("#","");if(m>=0){l=o.substring(m+1)}n=k(l);if(n){l=l.replace("?"+n,"")}return{pageId:l,search:n}}function k(l){var m=l.indexOf("?");if(m>=0){return l.substring(m+1)}return null}var i=function(l){i.superclass.constructor.call(this,l);f(this)};i.ATTRS={header:{valueFn:function(){return $("#header")}},content:{valueFn:function(){return $("#content")}},footer:{valueFn:function(){return $("#footer")}},homePage:{},urlSuffix:{value:"html"},menus:{},tree:{},tab:{}};h.extend(i,h.Base);h.augment(i,{openPage:function(p){p.title=p.title||"\u65b0\u7684\u6807\u7b7e\u9875";var n=this,q=p.reload,o=n.get("tab"),m=n.get("tree"),r=m.findNode(p.id),l=o.getActivedItem();if(r){n._setPageSelected(p.id,q,p.search)}else{o.addTab(p,q)}if(p.isClose){l.close()}},closePage:function(l){this.operatePage(l,"close")},reloadPage:function(l){this.operatePage(l,"reload")},setPageTitle:function(l,m){this.operatePage(m,"setTitle",[l])},operatePage:function(q,p,m){m=m||[];var l=this,n=l.get("tab"),o=q?n.getItemById(q):n.getActivedItem();if(o&&o[p]){o[p].apply(o,m)}},init:function(){this._initDom();this._initEvent()},_initDom:function(){this.autoFitHeight();this._initTree();this._initTab();this._initHomePage();this._initNavPos()},_initTree:function(){var m=this,n=m.get("menus"),l=new e.TreeList({render:"#J_Tree",accordion:true,expandAnimate:true,expandEvent:"itemclick",collapseEvent:"itemclick",nodes:n});l.render();m.set("tree",l)},_initTab:function(){var l=this,m=new c.NavTab({render:"#J_Tab"});m.render();l.set("tab",m)},_initHomePage:function(){var l=this,m=l.get("homePage");if(m){l._setPageSelected(m)}},_initNavPos:function(){var l=this,m=j();if(m){l._setPageSelected(m.pageId,true,m.search)}},_initEvent:function(){this._initResizeEvent();this._initNavEvent()},_initNavEvent:function(){var m=this,l=m.get("tree"),n=m.get("tab");l.on("itemclick",function(p){var o=p.item;if(o.leaf){m._openPage(o,true)}});l.on("itemselected",function(p){var o=p.item;if(o){a(o.id)}});n.on("activeChange",function(q){var p=q.item,o;if(p){o=l.findNode(p.get("id"));l.expandNode(o);l.setSelected(o)}else{l.clearSelection()}})},_initResizeEvent:function(){var l=this;$(g).on("resize",function(){l.autoFitHeight()})},autoFitHeight:function(){var l=this,p=l.get("header"),n=l.get("footer"),o=l.get("content"),m=h.viewportHeight();o.height(m-n.height()-p.height())},_getNodeHref:function(m){var l=this,n=m.path.join("/");if(n.indexOf("/")==0){n=n.substring(1)}return n+"."+l.get("urlSuffix")},_setPageSelected:function(p,q,t){var r=this,u=r.get("tree"),n=r.get("tab"),o=u.findNode(p),m="",l=-1;if(o){u.expandNode(o);u.setSelected(o);r._openPage(o,q,t)}else{if(p){var s=p.replace("-","/");if((l=p.indexOf("."))===-1){s+=r.get("urlSuffix")}m=t?(s+"?"+t):s;n.addTab({id:p,title:"",href:m},!!q)}}},_openPage:function(r,o,p){var m=this,q=m.get("tab"),l=m.get("tree"),n=r.href||m._getNodeHref(r);if(r.leaf){n=p?(d(n,p)):n;q.addTab({id:r.id,title:r.text,closeable:r.closeable,href:n},!!o)}else{l.expandNode(r)}}});return i});
