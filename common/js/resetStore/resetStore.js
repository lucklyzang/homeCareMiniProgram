// 设备信息store的初始值
export function getDefaultDeviceState() {
    return {
			timeMessage: {},
			ossMessage: {},
			enterAddRoomPageSource: '',
			enterDeviceSetPageSource: '',
			enterFamilyManagementPageSource: '',
			familyId: '',
			beforeAddDeviceMessage: {},
			beforeAddBodyDetectionDeviceMessage: {},
			beforeAddExistPerceptionRadarCompleteSet: {},
			beforeAddSignMonitorRadarCompleteSet: {},
			roomDetails: {},
			warningMessagePhoneNumber: {},
			currentNeedBindDevicesMessage: {},
			deviceNoticeDetails: {},
			familyMessage: {},
			currentDeviceType: '',
			deviceDataMessage: {}
		}	
};

// 登录信息store的初始值
export function getDefaultLoginState() {
	return {
		userInfo: {},
		token: null, //请求token,
		isLogin: false,
		overDueWay: false,
		userBasicInfo: null
	}	
};