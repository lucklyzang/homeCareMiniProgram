(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{0:function(e,t,n){"use strict";(function(e,t){var r=n(4),o=r(n(11));n(26);var c=r(n(25)),u=r(n(27)),a=r(n(34)),i=n(36),f=r(n(39));function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}e.__webpack_require_UNI_MP_PLUGIN__=n,c.default.prototype.$noMultipleClicks=i.noMultipleClicks,c.default.use(f.default),c.default.config.productionTip=!1,u.default.mpType="app";var s=new c.default(p(p({},u.default),{},{store:a.default,created:function(){}}));t(s).$mount()}).call(this,n(1)["default"],n(2)["createApp"])},27:function(e,t,n){"use strict";n.r(t);var r=n(28);for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(o);n(31);var c,u,a,i,f=n(33),l=Object(f["default"])(r["default"],c,u,!1,null,null,null,!1,a,i);l.options.__file="App.vue",t["default"]=l.exports},28:function(e,t,n){"use strict";n.r(t);var r=n(29),o=n.n(r);for(var c in r)["default"].indexOf(c)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(c);t["default"]=o.a},29:function(e,t,n){"use strict";(function(e){var r=n(4);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=r(n(11)),c=n(30);function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var i={computed:a({},(0,c.mapGetters)([])),onLaunch:function(){},onShow:function(){if(e.canIUse("getUpdateManager")){var t=e.getUpdateManager();t.onCheckForUpdate((function(n){n.hasUpdate&&(t.onUpdateReady((function(){e.showModal({title:"更新提示",content:"新版本已经准备好，是否重启应用?",success:function(e){e.confirm&&t.applyUpdate()}})})),t.onUpdateFailed((function(t){e.showModal({title:"已经有新版本了",content:"新版本已经上线啦，请您删除当前小程序，重新搜索打开"})})))}))}else e.showModal({title:"提示",content:"当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试"})},onHide:function(){}};t.default=i}).call(this,n(2)["default"])},31:function(e,t,n){"use strict";n.r(t);var r=n(32),o=n.n(r);for(var c in r)["default"].indexOf(c)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(c);t["default"]=o.a},32:function(e,t,n){}},[[0,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/main.js.map