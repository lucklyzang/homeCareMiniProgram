(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["node-modules/uview-ui/components/u-swiper/u-swiper"],{540:function(e,t,n){"use strict";n.r(t);var i=n(541),r=n(543);for(var o in r)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(o);n(546);var u,d=n(33),a=Object(d["default"])(r["default"],i["render"],i["staticRenderFns"],!1,null,"7b038a67",null,!1,i["components"],u);a.options.__file="node_modules/uview-ui/components/u-swiper/u-swiper.vue",t["default"]=a.exports},541:function(e,t,n){"use strict";n.r(t);var i=n(542);n.d(t,"render",(function(){return i["render"]})),n.d(t,"staticRenderFns",(function(){return i["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return i["recyclableRender"]})),n.d(t,"components",(function(){return i["components"]}))},542:function(e,t,n){"use strict";var i;n.r(t),n.d(t,"render",(function(){return r})),n.d(t,"staticRenderFns",(function(){return u})),n.d(t,"recyclableRender",(function(){return o})),n.d(t,"components",(function(){return i}));try{i={uLoadingIcon:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-loading-icon/u-loading-icon")]).then(n.bind(null,532))},uSwiperIndicator:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-swiper-indicator/u-swiper-indicator")]).then(n.bind(null,785))}}}catch(d){if(-1===d.message.indexOf("Cannot find module")||-1===d.message.indexOf(".vue"))throw d;console.error(d.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var r=function(){var e=this,t=e.$createElement,n=(e._self._c,e.$u.addUnit(e.height)),i=e.$u.addUnit(e.radius),r=e.loading?null:e.$u.addUnit(e.height),o=e.loading?null:e.$u.addUnit(e.previousMargin),u=e.loading?null:e.$u.addUnit(e.nextMargin),d=e.loading?null:e.__map(e.list,(function(t,n){var i=e.__get_orig(t),r=e.__get_style([e.itemStyle(n)]),o=e.getItemType(t),u="image"===o?e.$u.addUnit(e.height):null,d="image"===o?e.$u.addUnit(e.radius):null,a="image"===o?e.getSource(t):null,c=e.getItemType(t),s="video"===c?e.$u.addUnit(e.height):null,l="video"===c?e.getSource(t):null,f="video"===c?e.getPoster(t):null,g="video"===c?e.showTitle&&e.$u.test.object(t)&&t.title:null,m=e.showTitle&&e.$u.test.object(t)&&t.title&&e.$u.test.image(e.getSource(t));return{$orig:i,s0:r,m0:o,g5:u,g6:d,m1:a,m2:c,g7:s,m3:l,m4:f,g8:g,g9:m}})),a=e.__get_style([e.$u.addStyle(e.indicatorStyle)]),c=e.loading||!e.indicator||e.showTitle?null:e.list.length;e.$mp.data=Object.assign({},{$root:{g0:n,g1:i,g2:r,g3:o,g4:u,l0:d,s1:a,g10:c}})},o=!1,u=[];r._withStripped=!0},543:function(e,t,n){"use strict";n.r(t);var i=n(544),r=n.n(i);for(var o in i)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(o);t["default"]=r.a},544:function(e,t,n){"use strict";(function(e){var i=n(4);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(n(13)),o=i(n(545)),u={name:"u-swiper",mixins:[e.$u.mpMixin,e.$u.mixin,o.default],data:function(){return{currentIndex:0}},watch:{current:function(e,t){e!==t&&(this.currentIndex=e)}},computed:{itemStyle:function(){var t=this;return function(n){var i={};return t.nextMargin&&t.previousMargin&&(i.borderRadius=e.$u.addUnit(t.radius),n!==t.currentIndex&&(i.transform="scale(0.92)")),i}}},methods:{getItemType:function(t){return"string"===typeof t?e.$u.test.video(this.getSource(t))?"video":"image":"object"===(0,r.default)(t)&&this.keyName?t.type?"image"===t.type?"image":"video"===t.type?"video":"image":e.$u.test.video(this.getSource(t))?"video":"image":void 0},getSource:function(t){return"string"===typeof t?t:"object"===(0,r.default)(t)&&this.keyName?t[this.keyName]:(e.$u.error("请按格式传递列表参数"),"")},change:function(e){var t=e.detail.current;this.pauseVideo(this.currentIndex),this.currentIndex=t,this.$emit("change",e.detail)},pauseVideo:function(t){var n=this.getSource(this.list[t]);if(e.$u.test.video(n)){var i=e.createVideoContext("video-".concat(t),this);i.pause()}},getPoster:function(e){return"object"===(0,r.default)(e)&&e.poster?e.poster:""},clickHandler:function(e){this.$emit("click",e)}}};t.default=u}).call(this,n(2)["default"])},546:function(e,t,n){"use strict";n.r(t);var i=n(547),r=n.n(i);for(var o in i)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(o);t["default"]=r.a},547:function(e,t,n){}}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/uview-ui/components/u-swiper/u-swiper.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'node-modules/uview-ui/components/u-swiper/u-swiper-create-component',
    {
        'node-modules/uview-ui/components/u-swiper/u-swiper-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('2')['createComponent'](__webpack_require__(540))
        })
    },
    [['node-modules/uview-ui/components/u-swiper/u-swiper-create-component']]
]);
