(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["messagePackage/pages/message/index/index"],{249:function(e,t,n){"use strict";(function(e,t){var o=n(4);n(26);o(n(25));var i=o(n(250));e.__webpack_require_UNI_MP_PLUGIN__=n,t(i.default)}).call(this,n(1)["default"],n(2)["createPage"])},250:function(e,t,n){"use strict";n.r(t);var o=n(251),i=n(253);for(var r in i)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(r);n(255);var a,s=n(33),u=Object(s["default"])(i["default"],o["render"],o["staticRenderFns"],!1,null,null,null,!1,o["components"],a);u.options.__file="messagePackage/pages/message/index/index.vue",t["default"]=u.exports},251:function(e,t,n){"use strict";n.r(t);var o=n(252);n.d(t,"render",(function(){return o["render"]})),n.d(t,"staticRenderFns",(function(){return o["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return o["recyclableRender"]})),n.d(t,"components",(function(){return o["components"]}))},252:function(e,t,n){"use strict";var o;n.r(t),n.d(t,"render",(function(){return i})),n.d(t,"staticRenderFns",(function(){return a})),n.d(t,"recyclableRender",(function(){return r})),n.d(t,"components",(function(){return o}));try{o={uToast:function(){return n.e("node-modules/uview-ui/components/u-toast/u-toast").then(n.bind(null,531))},uOverlay:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-overlay/u-overlay")]).then(n.bind(null,662))},uLoadingIcon:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-loading-icon/u-loading-icon")]).then(n.bind(null,572))},uEmpty:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-empty/u-empty")]).then(n.bind(null,670))},uLoadmore:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-loadmore/u-loadmore")]).then(n.bind(null,678))}}}catch(s){if(-1===s.message.indexOf("Cannot find module")||-1===s.message.indexOf(".vue"))throw s;console.error(s.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var i=function(){var e=this,t=e.$createElement,n=(e._self._c,e.__map(e.fullNoticeList,(function(t,n){var o=e.__get_orig(t),i=e.getNowFormatDate(new Date(t.createTime),4);return{$orig:o,m0:i}}))),o=e.fullNoticeList.length;e.$mp.data=Object.assign({},{$root:{l0:n,g0:o}})},r=!1,a=[];i._withStripped=!0},253:function(e,t,n){"use strict";n.r(t);var o=n(254),i=n.n(o);for(var r in o)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(r);t["default"]=i.a},254:function(e,t,n){"use strict";(function(e){var o=n(4);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=o(n(11)),r=n(30),a=(n(36),n(170));function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){(0,i.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var c=function(){n.e("components/zhouWei-navBar/index").then(function(){return resolve(n(686))}.bind(null,n)).catch(n.oe)},l={components:{navBar:c},data:function(){return{defaultPersonPhotoIconPng:n(219),infoText:"加载中···",showLoadingHint:!1,status:"nomore",isShowNoData:!1,currentPage:1,pageSize:15,totalCount:0,noReadNum:0,readedNum:0,noticeList:[],fullNoticeList:[]}},computed:u(u({},(0,r.mapGetters)(["userBasicInfo"])),{},{userName:function(){},proId:function(){}}),onLoad:function(){this.queryNewsPageList({pageNo:this.currentPage,pageSize:this.pageSize,terminal:"USER"},!0)},methods:u(u({},(0,r.mapMutations)([])),{},{enterLatestNewsDetailsEvent:function(t){this.updateNewsReadEvent({id:t.id});var n=encodeURIComponent(JSON.stringify(t));e.navigateTo({url:"/messagePackage/pages/latestNewsDetails/latestNewsDetails?transmitData="+n})},queryNewsPageList:function(e,t){var n=this;t?this.showLoadingHint=!0:(this.showLoadingHint=!1,this.infoText="",this.status="loading"),this.noticeList=[],(0,a.newsPage)(e).then((function(e){if(e&&0==e.data.code){if("{}"==JSON.stringify(e.data.data))return n.isShowNoData=!0,void(n.showLoadingHint=!1);n.totalCount=e.data.data.total,n.noticeList=e.data.data.list,n.noticeList.forEach((function(e){e.hasOwnProperty("description")&&(e.description=e.description.replace(/\<img/gi,'<img class="mystyle"'),e.description=e.description.replace(/\<p/gi,'<p class="pstyle"'),e.description=e.description.replace(/\<div/gi,'<div class="dstyle"'))})),n.fullNoticeList=n.fullNoticeList.concat(n.noticeList),0==n.fullNoticeList.length&&(n.isShowNoData=!0)}else n.$refs.uToast.show({message:e.data.msg,type:"error",position:"bottom"});if(t)n.showLoadingHint=!1;else{var o=Math.ceil(n.totalCount/n.pageSize);n.currentPage>=o?n.status="nomore":n.status="loadmore"}})).catch((function(e){t?n.showLoadingHint=!1:n.status="loadmore",n.$refs.uToast.show({message:e.message,type:"error",position:"bottom"})}))},updateNewsReadEvent:function(e){var t=this;this.showLoadingHint=!0,this.infoText="",(0,a.updateNewsRead)(e).then((function(e){e&&0==e.data.code||t.$refs.uToast.show({message:e.data.msg,type:"error",position:"bottom"}),t.showLoadingHint=!1})).catch((function(e){t.showLoadingHint=!1,t.$refs.uToast.show({message:e.message,type:"error",position:"bottom"})}))},scrolltolower:function(){var e=Math.ceil(this.totalCount/this.pageSize);this.currentPage>=e?this.status="nomore":(this.status="loadmore",this.currentPage=this.currentPage+1,this.queryNewsPageList({pageNo:this.currentPage,pageSize:this.pageSize,terminal:"USER"},!1))},backTo:function(){e.navigateBack()},getNowFormatDate:function(e,t){var n,o=e.getDate(),i="-",r=":",a=" ",s=e.getMonth()+1,u=e.getHours(),c=e.getMinutes(),l=e.getSeconds();return s>=1&&s<=9&&(s="0"+s),u>=0&&u<=9&&(u="0"+u),c>=0&&c<=9&&(c="0"+c),l>=0&&l<=9&&(l="0"+l),o>=0&&o<=9&&(o="0"+o),1==t&&(n=u+r+c+r+l),2==t&&(n=e.getFullYear()+i+s+i+o),3==t&&(n=e.getFullYear()+i+s),4==t&&(n=e.getFullYear()+i+s+i+o+a+u+r+c+r+l),5==t&&(n=s+i+o),n}})};t.default=l}).call(this,n(2)["default"])},255:function(e,t,n){"use strict";n.r(t);var o=n(256),i=n.n(o);for(var r in o)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(r);t["default"]=i.a},256:function(e,t,n){}},[[249,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/messagePackage/pages/message/index/index.js.map