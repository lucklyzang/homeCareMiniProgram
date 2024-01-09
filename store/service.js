import { getDefaultServiceState } from '@/common/js/resetStore/resetStore.js'
import { setCache, getCache } from '@/common/js/utils'
export default {
  state: getDefaultServiceState(),
  getters:{
		timeMessage: state => state.timeMessage,
		ossMessage: state => state.ossMessage,
		serviceOrderFormSureChooseMessage:(state) => {
			state.serviceOrderFormSureChooseMessage = getCache('serviceOrderFormSureChooseMessage') ? getCache('serviceOrderFormSureChooseMessage') : {};
			return state.serviceOrderFormSureChooseMessage
		},
		editServiceOrderFormSureChooseMessage: (state) => {
			state.editServiceOrderFormSureChooseMessage = getCache('editServiceOrderFormSureChooseMessage') ? getCache('editServiceOrderFormSureChooseMessage') : {};
			return state.editServiceOrderFormSureChooseMessage
		},
		parentServiceCategoryMessage: (state) => {
			return state.parentServiceCategoryMessage
		},
		selectBannerMessage: state => state.selectBannerMessage
  },
  mutations:{
		changeTimeMessage (state, playLoad) {
			state.timeMessage = playLoad
		},
		
		changeOssMessage (state, playLoad) {
			state.ossMessage = playLoad
		},
		
		// 保存订单确认页面选择的信息
		storeServiceOrderFormSureChooseMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('serviceOrderFormSureChooseMessage', playLoad);
				state.serviceOrderFormSureChooseMessage = playLoad
			}
		},
		
		// 保存订单修改页面选择的信息
		storeEditServiceOrderFormSureChooseMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('editServiceOrderFormSureChooseMessage', playLoad);
				state.editServiceOrderFormSureChooseMessage = playLoad
			}
		},
		
		// 保存首页点击的服务大类信息
		changeParentServiceCategoryMessage (state, playLoad) {
			state.parentServiceCategoryMessage = playLoad
		},
		
		//保存选中的首页banner信息
		changeSelectBannerMessage (state, playLoad) {
			state.selectBannerMessage = playLoad
		},
		
		//重置服务的状态
		resetServiceInfoState(state) {
				Object.assign(state, getDefaultServiceState())
		}
  },
  actions: {
		resetServiceState({ commit }) {
				commit('resetServiceInfoState')
		}
	}
}