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
		}
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