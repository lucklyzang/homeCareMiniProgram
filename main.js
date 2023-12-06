import Vue from 'vue'
import App from './App'
import store from './store'
import { getCache } from '@/common/js/utils'
import { noMultipleClicks } from '@/common/js/utils'
Vue.prototype.$noMultipleClicks = noMultipleClicks
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
	...App,
	store,
	created () {
		// 判断是否登录过
		let login = getCache('isLogin');
		if (login) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		} else {
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}
	}
});
app.$mount();