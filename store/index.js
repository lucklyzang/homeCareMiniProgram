import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import device from './device.js';
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    login,
		device
  }
});