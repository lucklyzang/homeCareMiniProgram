<template>
	<view class="content-box">
		<!-- 退出支付提示 -->
		<view class="quit-pay-info">
			<u-modal :show="quitPayShow" @confirm="confirmQuitPayEvent" :buttonReverse="true" @cancel="quitPayShow=false" confirmText="确定" cancelText="取消" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="当前订单还未支付">
				<view class="slot-content">
					确定退出支付吗？
				</view>
			</u-modal>
		</view>
		<!-- 用户授权协议弹框 -->
		<view class="user-license-agreement-box">
			<u-modal :show="userLicenseAgreementShow" :showConfirmButton="false" width="690rpx">
				<view class="slot-content">
					<view class="user-license-agreement-content">
						<view class="user-license-agreement-title">
							<text>《用户授权协议》</text>
						</view>
						<view class="user-license-agreement-item-box">
							<view class="user-license-agreement-item">
								这里是用户授权协议
								必须阅读10S后才可以点击确认
							</view>
							<view class="user-license-agreement-item">
								这里是用户授权协议
								必须阅读10S后才可以点击确认
							</view>
						</view>
					</view>
					<view class="btn-box" @click="userLicenseAgreementSureEvent" :class="{'btnBoxStyle': isCanSure}">
						<text v-if="!isCanSure">{{ `${countTime}s` }}</text>
						<text>确定</text>
					</view>
				</view>
			</u-modal>
		</view>
		<!-- 期望服务时间选择弹框 -->
		<view class="expectation-service-time-box">
			<u-modal :show="expectationServiceTimeShow" :showConfirmButton="false" width="750rpx">
				<view class="slot-content">
					<view class="btn-area">
						<view @click="expectationServiceTimeBoxCancel">
							<text>取消</text>
						</view>
						<view @click="expectationServiceTimeBoxSure">
							<text>确定</text>
						</view>
					</view>
					<view class="expectation-service-time-content">
						<view class="expectation-service-time-content-left">
							<view class="date-list" :class="{'dateListStyle': currentDateIndex === index}" @click="dateItemClickEvent(item,index)" v-for="(item,index) in currentDateList">
								<text>{{ item['showDate'] }}</text>
							</view>
						</view>
						<view class="expectation-service-time-content-right">
							<view class="time-quantum-list" :class="{'timeQuantumListStyle': currentTimeQuantumIndex === index}" @click="timeQuantumItemClickEvent(item,index)" :key="index" v-for="(item,index) in timeQuantumList">
								<text>{{ item }}</text>
							</view>
						</view>
					</view>
				</view>
			</u-modal>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="sureCancelShow" title="确定删除此图片?" :showCancelButton="true" @confirm="sureCancel" @cancel="cancelSure"></u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单修改" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-message-wrapper">
			<view class="service-project">
				<view class="service-project-left">
					<image :src="serviceMessage.items[0]['picUrl']"></image>
				</view>
				<view class="service-project-right">
					<view class="service-project-right-top">
						<text>{{ serViceName }}</text>
					</view>
					<view class="service-project-right-bottom">
						<text>上门服务一次</text>
						<text>40分钟</text>
						<text>专业服务</text>
					</view>
				</view>
			</view>
			<view class="nurse-practitioner-list" v-if="isPlatformRecommendNurse">
				<view class="nurse-practitioner-list-top">
					<text>{{ nurseMessage.practice }}</text>
				</view>
				<view class="nurse-practitioner-list-left">
					<u-image :src="!nurseMessage.avatar ? defaultNurseAvatar : nurseMessage.avatar" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="nurse-practitioner-list-right">
					<view class="nurse-practitioner-name">
						<text>{{ nurseMessage.name }}</text>
						<text>{{ nurseTitleTransition(nurseMessage.title) }}</text>
					</view>
					<view class="hospital-name">
						<text>{{ nurseMessage.organization }}</text>
					</view>
					<view class="rate">
						<u-rate :count="nurseMessage.rateValue" readonly v-model="nurseMessage.rateValue" active-color="#E86F50"></u-rate>
						<text>{{ nurseMessage.commentScore == 0 ? '0.0' : Math.floor(nurseMessage.commentScore/nurseMessage.commentCount).toFixed(1) }}</text>
					</view>
					<view class="nurse-practitioner-performance">
						<view class="nurse-practitioner-performance-message">
							<view class="nurse-practitioner-performance-left">
								<text>帮助</text>
								<text>{{ nurseMessage.quantity }}</text>
								<text>人</text>
							</view>
							<view class="nurse-practitioner-performance-right">
								<text>服务</text>
								<text>{{ nurseMessage.timeLength == 0 ? 0 : (nurseMessage.timeLength/60).toFixed(2) }}</text>
								<text>小时</text>
							</view>
						</view>	
						<!-- <view class="nurse-practitioner-performance-price">
							<text>￥300.00</text>
						</view> -->
					</view>
					<view class="good-territory">
						<text v-for="(innerItem,innerIndex) in nurseMessage.genius" :key="innerIndex">{{ innerItem }}</text>
					</view>
					<view class="cut-nurse" @click="cutNurseEvent('推荐')">
						<image :src="cutIconPng"></image>
						<text>切换为平台推荐护士</text>
					</view>
				</view>
			</view>
			<view class="nurse-practitioner-list-platform-assign" v-else>
				<view class="nurse-practitioner-list-platform-assign-left">
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="nurse-practitioner-list-platform-assign-right">
					<view class="platform-assign-right-top">
						<text>平台指派护士</text>
					</view>
					<view class="platform-assign-right-bottom" @click="cutNurseEvent('指定')">
						<image :src="cutIconPng"></image>
						<text>切换为指定护士</text>
					</view>
				</view>
			</view>	
			<view class="serve-people-message">
				<view class="serve-site">
					<view class="serve-site-left">
						<image :src="serviceSitePng"></image>
						<text>服务地址</text>
					</view>
					<view class="serve-site-right" :class="{'serveSiteRightStyle' : serviceSite != '上门服务详细地址'}" @click="serviceSiteEvent">
						{{ serviceSite }}
					</view>
				</view>
				<view class="serve-site serve-person">
					<view class="serve-site-left">
						<image :src="serviceTimePng"></image>
						<text>服务时间</text>
					</view>
					<view class="serve-site-right" :class="{'serveSiteRightStyle' : serviceDate != '期望服务时间'}" @click="expectationServiceTimeClickEvent">
						{{ serviceDate }}
					</view>
				</view>
				<view class="serve-site evaluation-form">
					<view class="serve-site-left">
						<image :src="servedPersonPng"></image>
						<text>被服务人</text>
					</view>
					<view class="serve-site-right" :class="{'serveSiteRightStyle' : protectedPerson != '请选择被服务人'}" @click="chooseProtectedPersonEvent">
						{{ protectedPerson }}
					</view>
				</view>
				<view class="serve-site serve-time">
					<view class="serve-site-left">
						<image :src="evaluationFormPng"></image>
						<text>初步评估单</text>
					</view>
					<view class="serve-site-right" :class="{'serveSiteRightStyle' : writeEvaluationForm != '点击填写评估单'}" @click="writeEvaluationFormEvent">
						{{ writeEvaluationForm }}
					</view>
				</view>
			</view>
			<view class="upload-photo">
				<view class="upload-photo-title">
					上传图片
				</view>
				<view class="upload-photo-content">
					您可上传就诊人的报告单、处方单、患处照片等图像资料。注射项目必须上传医疗诊断、药品包装及注射单(最多9)
				</view>
				<view class="upload-photo-list-wrapper">
					<view>
						<view v-for="(item, index) in imgArr" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<u-icon name="close" size="20" color="#000000" @click="photoDelete(item,index)">></u-icon>
						</view>
						<view @click="getImg">
							<u-icon name="plus" size="10"></u-icon>
							<text>上传图片</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay-area">
			<view class="pay-area-top">
				<u-checkbox-group v-model="isReadAgreeChecked">
					<u-checkbox 
						shape="circle" 
						v-for="(item, index) in checkboxList"
						:key="index"
						label-size="12"
						:label="item.name"
						:name="item.name"
						active-color="#F16C8C">
					</u-checkbox>
				</u-checkbox-group>
				<text @click="userLicenseAgreementClickEvent">《用户授权协议》</text>
			</view>
			<view class="pay-area-bottom">
				<view class="order-form-price">
					<text>订单金额</text>
					<text>{{ `￥${serVicePrice}` }}</text>
				</view>
				<view class="to-pay-btn" @click="sureEditEvent">
					确认修改
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { getOrderDetail, editOrder } from '@/api/orderForm.js'
	import { getNurseDetails } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				infoText: '预约中···',
				showLoadingHint: false,
				sureCancelShow: false,
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				isPlatformRecommendNurse: false,
				isCanSure: false,
				quitPayShow: false,
				nurseMessage: {},
				imgArr: [],
				serviceSite: '上门服务详细地址',
				serviceDate: '期望服务时间',
				protectedPerson: '请选择被服务人',
				writeEvaluationForm: '点击填写评估单',
				temporaryImgPathArr: [],
				isReadAgreeChecked: ['阅读并同意协议'],
				userLicenseAgreementShow: false,
				expectationServiceTimeShow: false,
				checkboxList: [
					{
						name: '阅读并同意协议',
						disabled: false
					}
				],
				timeUserLicenseAgreement: null,
				imgIndex: '',
				countTime: '',
				jaundiceDetectionPng: require("@/static/img/jaundice-detection.png"),
				cutIconPng: require("@/static/img/cut-icon.png"),
				serviceSitePng: require("@/static/img/service-site.png"),
				serviceTimePng: require("@/static/img/service-time.png"),
				servedPersonPng: require("@/static/img/served-person.png"),
				evaluationFormPng: require("@/static/img/evaluation-form.png"),
				currentTimeQuantumIndex: null,
				currentSelectTimeQuantum: '',
				currentDateIndex: null,
				currentSelectDate: {},
				currentDateList: [],
				currentMonth: '',
				currentMonthDay: '',
				currentDate: '',
				serviceMessage: {},
				serViceName: '',
				serVicePrice: '',
				aptitudes: '',
				timeQuantumList: ['上午8：00—9：00','上午9：00—10：00','上午10：00—11：00',
				'上午11：00—12：00','上午12：00—13：00','下午13：00—14：00','下午14：00—15：00',
				'下午15：00—16：00','下午16：00—17：00','下午17：00—18：00'
				]
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'nurseRankDictData',
				'editServiceOrderFormSureChooseMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			console.log('订单选择信息',this.editServiceOrderFormSureChooseMessage);
			if (JSON.stringify(this.editServiceOrderFormSureChooseMessage.chooseNurseMessage) != "{}") {
				this.nurseMessage = this.editServiceOrderFormSureChooseMessage.chooseNurseMessage
			};
			if ( JSON.stringify(this.editServiceOrderFormSureChooseMessage.chooseAddressMessage) != "{}") {
				this.serviceSite = `${this.editServiceOrderFormSureChooseMessage.chooseAddressMessage.address}${this.editServiceOrderFormSureChooseMessage.chooseAddressMessage.detailAddress}`
			};
			if ( JSON.stringify(this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage) != "{}") {
				this.protectedPerson = `${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.name} ${this.editServiceOrderFormSureChooseMessage.chooseAddressMessage.sex == 1 ? '男' : '女'} ${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.age}岁 ${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.mobile}`
			}
		},
		onLoad(options) {
			this.queryOrderDetail({id:this.editServiceOrderFormSureChooseMessage.orderMessage.id})
		},
		methods: {
			...mapMutations([
				'storeEditServiceOrderFormSureChooseMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				this.quitPayShow = true
			},
			
			// 确定退出支付事件
			confirmQuitPayEvent () {
				uni.navigateBack()
			},
			
			// 护师职称转换
			nurseTitleTransition (title) {
				if (!title && title !== 0) {
					return
				};
				let titleText = '';
				titleText = this.nurseRankDictData.filter((item) => { return item.value == title})[0]['label'];
				return titleText
			},
			
			// 服务地址点击事件
			serviceSiteEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/addressManagement/addressManagement'
				})
			},
			
			// 选择被护人事件
			chooseProtectedPersonEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/myProtectedPersons/myProtectedPersons'
				})
			},
			
			// 填写评估单事件
			writeEvaluationFormEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/mine/index/index'
				})
			},
			
			// 查询订单详情
			queryOrderDetail(data) {
				this.showLoadingHint = true;
				this.infoText = '加载中···';
				getOrderDetail(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.serviceMessage = res.data.data;
						if (res.data.data.assignType == 'SYSTEM') {
							this.isPlatformRecommendNurse = false
						} else if (res.data.data.assignType == 'USER') {
							this.isPlatformRecommendNurse = true;
							this.getNurseDetailsEvent({id: res.data.data.careId});
						};
						let tmporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
						
						// 将该服务订单的被护人信息存入store
						let temporaryServerPersonMessage = res.data.data.serverPerson;
						tmporaryEditServiceOrderFormSureChooseMessage['chooseProtegePersonMessage'] = temporaryServerPersonMessage;
						this.storeEditServiceOrderFormSureChooseMessage(tmporaryEditServiceOrderFormSureChooseMessage);
						this.protectedPerson = `${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.name} ${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.sex == 1 ? '男' : '女'} ${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.age}岁 ${this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.mobile}`;
						
						// 将该服务订单的服务地址存入store 
						let temporaryAddressMessage = {};
						temporaryAddressMessage['address'] = res.data.data.receiverAreaName.replace(/\s*/g,"");
						temporaryAddressMessage['detailAddress'] =  res.data.data.receiverDetailAddress;
						temporaryAddressMessage['areaId'] =  res.data.data.receiverAreaId;
						temporaryAddressMessage['id'] =  '';
						tmporaryEditServiceOrderFormSureChooseMessage['chooseAddressMessage'] = temporaryAddressMessage;
						this.storeEditServiceOrderFormSureChooseMessage(tmporaryEditServiceOrderFormSureChooseMessage);
						this.serviceSite = `${this.editServiceOrderFormSureChooseMessage.chooseAddressMessage.address}${this.editServiceOrderFormSureChooseMessage.chooseAddressMessage.detailAddress}`;
						
						// 回显服务时间
						this.serviceDate = `${this.getNowFormatDateText(res.data.data.serviceDate)} (${this.judgeWeek(res.data.data.serviceDate)}) ${res.data.data.serviceTime}`;
						this.currentSelectDate.actualDate = res.data.data.serviceDate;
						this.currentSelectTimeQuantum = `上午${res.data.data.serviceTime}`;
						
						this.serViceName = res.data.data.items[0]['spuName'];
						this.serVicePrice = fenToYuan(res.data.data.items[0]['payPrice']);
						this.aptitudes = res.data.data.aptitudes;
						console.log('存储选择信息',this.editServiceOrderFormSureChooseMessage);
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 2(只展示月)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator1 = "月";
				let seperator2 = "日";
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 2) {
					currentdate = month + seperator1
				} else {
					currentdate = month + seperator1 + strDate + seperator2
				};
				return currentdate
			},
			
			// 判断周几
			judgeWeek (currentDate) {
				let date = new Date(currentDate);
				let day = date.getDay();
				switch (day) {
					case 0:
						return "周日"
						break;
					case 1:
						return "周一"
						break;
					case 2:
						return "周二"
						break;
					case 3:
						return "周三"
						break;
					case 4:
						return "周四"
						break;
					case 5:
						return "周五"
						break;
					case 6:
						return "周六"
						break
					}
			},
			
			// 获取医护详情
			getNurseDetailsEvent(data) {
				this.showLoadingHint = true;
				this.infoText = '加载中···';
				getNurseDetails(data).then((res) => {
					if ( res && res.data.code == 0) {
						let temporaryNurseMessage = res.data.data;
						// 将当前服务订单的医护信息存入store
						temporaryNurseMessage['rateValue'] = res.data.data.commentScore == 0 ? 0 : Math.floor(res.data.data.commentScore/res.data.data.commentCount);
						let tmporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
						tmporaryEditServiceOrderFormSureChooseMessage['chooseNurseMessage'] = temporaryNurseMessage;
						this.storeEditServiceOrderFormSureChooseMessage(tmporaryEditServiceOrderFormSureChooseMessage);
						this.nurseMessage = this.editServiceOrderFormSureChooseMessage['chooseNurseMessage']
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 日期列表项点击事件
			dateItemClickEvent (item,index) {
				console.log('日期',item);
				this.currentDateIndex = index;
				this.currentSelectDate = item;
				if (index == 0) {
					this.currentTimeQuantumIndex = null
				}
			},
			
			// 时间段列表项点击事件
			timeQuantumItemClickEvent (item,index) {
				// 如果当前所在时间段超过当前时间，则不允许点击(选择日期是当天)
				if (this.currentDateIndex === 0) {
					let fullDateTime = `${this.currentSelectDate['actualDate']} ${index+9}:00:00`;
					if (new Date(fullDateTime).getTime() > new Date().getTime()) {
						this.currentTimeQuantumIndex = index;
						this.currentSelectTimeQuantum = item;
					} else {
						this.$refs.uToast.show({
							message: "当前选择时间段已过期,请重新选择!",
							position: 'top'
						})
					}
				} else {
					this.currentTimeQuantumIndex = index;
					this.currentSelectTimeQuantum = item
				}
			},
			
			// 期望服务时间弹框取消事件
			expectationServiceTimeBoxCancel () {
				this.expectationServiceTimeShow = false
			},
			
			// 期望服务时间弹框确定事件
			expectationServiceTimeBoxSure () {
				if (this.currentDateIndex === null) {
					this.$refs.uToast.show({
						message: "请选择日期!",
						position: 'top'
					});
					return
				};
				if (this.currentTimeQuantumIndex === null || this.currentTimeQuantumIndex == -1) {
					this.$refs.uToast.show({
						message: "请选择时间段!",
						position: 'top'
					});
					return
				};
				this.serviceDate = `${this.currentSelectDate.showDate} ${this.currentSelectTimeQuantum}`;
				this.expectationServiceTimeShow = false
			},
			
			// 期望服务时间点击事件
			expectationServiceTimeClickEvent () {
				this.expectationServiceTimeShow = true;
				this.getCurrentMonth();
				this.getMonthDay(new Date().getFullYear(),new Date().getMonth() + 1);
				this.createCurrentMonthDate();
				// 回显当前显示日期和时间段所在列表的位置
				if (this.serviceDate != '期望服务时间') {
					let temporarayArr = this.serviceDate.split(" ");
					// 日期
					this.currentDateIndex = this.currentDateList.findIndex((item) => { return item.showDate == `${temporarayArr[0]} ${temporarayArr[1]}` });
					this.currentSelectDate = this.currentDateList[this.currentDateIndex];
					// 时间段
					this.currentTimeQuantumIndex = this.timeQuantumList.findIndex((item) => { return item == temporarayArr[2] });;
					this.currentSelectTimeQuantum = this.timeQuantumList[this.currentTimeQuantumIndex]
				}
			},
			
			// 获取当前月份和当前日期
			getCurrentMonth () {
				if (new Date().getMonth() + 1 < 10) {
					this.currentMonth = `0${new Date().getMonth() + 1}`
				} else {
					this.currentMonth = new Date().getMonth() + 1
				};
				if (new Date().getDate() < 10) {
					this.currentDate = `0${new Date().getDate()}`
				} else {
					this.currentDate = new Date().getDate()
				}
			},
			
			// 获取当前月的天数
			getMonthDay (year, month) {
			  let days = new Date(year, month, 0).getDate()
			  this.currentMonthDay = days
			},
			
			// 创建当前月的日期
			createCurrentMonthDate () {
				this.currentDateList = [];
				for (let i = new Date().getDate(); i <= this.currentMonthDay; i++) {
					let currentDate = i < 10 ? `0${i}` : i;
					let temporaryActualDate = `${new Date().getFullYear()}-${this.currentMonth}-${currentDate}`;
					let temporaryShowDate = this.getNowFormatDateText(temporaryActualDate);
					let temporaryWeek = this.judgeWeek(temporaryActualDate);
					this.currentDateList.push(
						{
							actualDate: temporaryActualDate,
							showDate: `${temporaryShowDate} (${temporaryWeek})`
						}
					)
				}
			},
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 2(只展示月)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator1 = "月";
				let seperator2 = "日";
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 2) {
					currentdate = month + seperator1
				} else {
					currentdate = month + seperator1 + strDate + seperator2
				};
				return currentdate
			},
			
			// 判断周几
			judgeWeek (currentDate) {
				let date = new Date(currentDate);
				let day = date.getDay();
				switch (day) {
					case 0:
						return "周日"
						break;
					case 1:
						return "周一"
						break;
					case 2:
						return "周二"
						break;
					case 3:
						return "周三"
						break;
					case 4:
						return "周四"
						break;
					case 5:
						return "周五"
						break;
					case 6:
						return "周六"
						break
					}
			},
			
			// 用户授权协议确定事件
			userLicenseAgreementSureEvent () {
				if (this.isCanSure) {
					this.userLicenseAgreementShow = false;
					setTimeout(() => { this.isCanSure = false },500)
				}
			},
			
			// 用户授权协议点击事件
			userLicenseAgreementClickEvent () {
				const TIME_COUNT = 10;
				if (!this.timeUserLicenseAgreement) {
					this.countTime = TIME_COUNT;
					this.timeUserLicenseAgreement = setInterval(() => {
						if (this.countTime > 0 && this.countTime <= TIME_COUNT) {
							this.countTime--;
						} else {
							this.isCanSure = true;
							clearInterval(this.timeUserLicenseAgreement);
							this.timeUserLicenseAgreement = null
						}
					}, 1000)
				};
				this.userLicenseAgreementShow = true
			},
			
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgArr.splice(this.imgIndex, 1);
				this.temporaryImgPathArr.splice(this.imgIndex, 1)
			},
			
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false;
			},
			
			// 切换护士类型事件
			cutNurseEvent (text) {
				if (text == '指定') {
					// 传递服务资质
					let temporaryMessage = {
						name: this.serviceName,
						aptitudes: this.aptitudes
					};
					let mynavData = JSON.stringify(temporaryMessage);
					uni.navigateTo({
						url: '/servicePackage/pages/chooseNurse/chooseNurse?transmitData='+mynavData
					});
					this.isPlatformRecommendNurse = true
				} else {
					this.isPlatformRecommendNurse = false
				}
			},
			
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 选择图片方法
			getImg() {
				var that = this
				uni.chooseImage({
					count: 4,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						that.temporaryImgPathArr = that.temporaryImgPathArr.concat(res.tempFilePaths);
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.srcImage = res.tempFilePaths[imgI];
							uni.getFileSystemManager().readFile({
								filePath: that.srcImage,
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.imgArr.push(base64);
								}
							})
						}
					}
				})
			},
			
			// 确认修改事件
			sureEditEvent () {
				if (this.serviceSite == '上门服务详细地址') {
					this.$refs.uToast.show({
						message: '请选择上门服务详细地址!',
						type: 'error',
						position: 'bottom'
					});
					return
				} else if (this.serviceDate == '期望服务时间') {
					this.$refs.uToast.show({
						message: '请选择期望服务时间!',
						type: 'error',
						position: 'bottom'
					});
					return
				} else if (this.protectedPerson == '请选择被服务人') {
					this.$refs.uToast.show({
						message: '请选择被服务人!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				if (this.isReadAgreeChecked.length == 0) {
					this.$refs.uToast.show({
						message: '请阅读并同意协议!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				this.editOrderEvent({
						id: this.serviceMessage.id,
					  addressId: this.editServiceOrderFormSureChooseMessage.chooseAddressMessage.id,
					  careId: this.isPlatformRecommendNurse ? this.editServiceOrderFormSureChooseMessage.chooseNurseMessage.id : "",
					  remark: "",
					  serviceDate: this.currentSelectDate.actualDate,
					  serviceTime: this.currentSelectTimeQuantum.replace(/[\u4e00-\u9fa5]+/gi,''),
					  servicePersonId: this.editServiceOrderFormSureChooseMessage.chooseProtegePersonMessage.id,
					  images: [],
					  assignType: this.isPlatformRecommendNurse ? "USER" : "SYSTEM"
				})
			},
			
			// 修改服务订单
			editOrderEvent(data) {
				this.showLoadingHint = true;
				editOrder(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '修改订单成功',
							type: 'success',
							position: 'center'
						});
						uni.navigateBack()
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	.content-box {
		@include content-wrapper;
		position: relative;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 20000;
		};
		::v-deep .u-popup__content {
			.u-modal {
				.u-modal__title {
					font-size: 16px !important;
					color: #101010 !important
				};
				.u-line {
					border: none !important
				};
				.u-modal__content {
					padding: 20px 10px 30px 10px !important;
					font-size: 14px !important;
					color: #898C8C !important
				};
				.u-modal__button-group {
					height: 50px;
					justify-content: center;
					.u-line {
						border: none !important
					};
					.u-modal__button-group__wrapper--cancel {
						flex: none !important;
						width: 100px !important;
						height: 34px !important;
						line-height: 34px !important;
						border-radius: 7px !important;
						border: 1px solid #FF698C !important;
						.u-modal__button-group__wrapper__text {
							font-size: 14px;
							color: #FF698C !important;
						}
					};
					.u-modal__button-group__wrapper--confirm {
						flex: none !important;
						width: 100px !important;
						height: 34px !important;
						line-height: 34px !important;
						border-radius: 7px !important;
						margin-right: 30px;
						background: #FF698C !important;
						border: none !important;
						.u-modal__button-group__wrapper__text {
							font-size: 14px;
							color: #fff !important;
						}
					}
				}
			}
		};
		.user-license-agreement-box {
			::v-deep .u-popup {
				.u-popup__content {
					.u-modal {
						max-height: 90vh;
						border-radius: 2px !important;
						.u-modal__content {
							padding: 10px !important;
							height: 100%;
							box-sizing: border-box;
							.slot-content {
								width: 100%;
								height: 100%;
								display: flex;
								flex-direction: column;
								.user-license-agreement-content {
									flex: 1;
									overflow: auto;
									.user-license-agreement-title {
										font-size: 16px;
										color: #101010;
										margin-bottom: 10px;
										padding-left: 10px;
										box-sizing: border-box;
									};
									.user-license-agreement-item-box {
										.user-license-agreement-item {
											font-size: 12px;
											color: #8B8B8B;
											margin-bottom: 10px
										}
									}
								};
								.btn-box {
									margin: 0 auto;
									width: 90px;
									height: 32px;
									display: flex;
									justify-content: center;
									align-items: center;
									border-radius: 20px;
									font-size: 12px;
									background: #777777;
									font-size: 12px;
									color: #fff;
									>text {
										&:first-child {
											margin-right: 4px
										}
									}
								};
								.btnBoxStyle {
									background: #F16C8C !important;
									color: #fff !important;
								}
							}
						}
					}
				}	
			}
		};
		.expectation-service-time-box {
			::v-deep .u-popup {
				.u-popup__content {
					border-radius: 0 !important;
					border-top-left-radius: 20px !important;
					border-top-right-radius: 20px !important;
					position: fixed;
					bottom: 0;
					.u-modal {
						height: 50vh;
						.u-modal__content {
							padding: 10px !important;
							height: 100%;
							box-sizing: border-box;
							.slot-content {
								width: 100%;
								height: 100%;
								display: flex;
								flex-direction: column;
								.btn-area {
									display: flex;
									height: 50px;
									width: 100%;
									>view {
										flex: 1;
										width: 0;
										display: flex;
										align-items: center;
										justify-content: center;
										&:first-child {
											color: #101010;
											font-size: 14px
										};
										&:last-child {
											color: #F16C8C;
											font-size: 14px
										}
									}
								};
								.expectation-service-time-content {
									flex: 1;
									height: 0;
									display: flex;
									>view {
										flex: 1;
										overflow: auto;
									};
									.expectation-service-time-content-left {
										padding: 10px;
										box-sizing: border-box;
										border-radius: 10px;
										.date-list {
											display: flex;
											align-items: center;
											justify-content: center;
											height: 30px;
											font-size: 14px;
											margin-bottom: 4px;
											color: #101010
										};
										.dateListStyle {
											background: #F1F1F1;
											border-radius: 5px
										}
									};
									.expectation-service-time-content-right {
										padding: 10px;
										box-sizing: border-box;
										border-radius: 10px;
										background: #F1F1F1;
										.time-quantum-list {
											display: flex;
											align-items: center;
											justify-content: center;
											height: 30px;
											font-size: 14px;
											margin-bottom: 4px;
											color: #101010
										};
										.timeQuantumListStyle {
											background: #fff;
											border-radius: 5px
										}
									}
								}
							}
						}
					}
				}
			}
		};	
		.top-area-box {
			position: relative;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				.header_title_center {
					color: #101010 !important;
					text {
						color: #101010 !important;
					}
				}
			}
		}
		.order-form-message-wrapper {
			flex: 1;
			background: #F8F8F8;
			overflow: auto;
			padding: 4px 0;
			box-sizing: border-box;
			width: 100%;
			.service-project {
				width: 100%;
				display: flex;
				padding: 12px 6px;
				box-sizing: border-box;
				background: #fff;
				.service-project-left {
					margin-right: 10px;
					>image {
						width: 58px;
						height: 58px
					}
				};
				.service-project-right {
					flex: 1;
					@include no-wrap;
					.service-project-right-top {
						margin-bottom: 10px;
						width: 100%;
						>text {
							display: inline-block;
							font-size: 18px;
							color: #101010;
							font-weight: bold;
							width: 100%;
							@include no-wrap;
						}
					};
					.service-project-right-bottom {
						>text {
							display: inline-block;
							font-size: 16px;
							color: #fff;
							margin-right: 4px;
							background: rgba(241, 108, 140, 0.64);
							padding: 4px 6px;
							box-sizing: border-box;
							&:last-child {
								margin-right: 0 !important
							}
						}
					}
				}
			};
			.nurse-practitioner-list {
				margin-top: 4px;
				padding: 30px 6px 20px 6px;
				box-sizing: border-box;
				background: #fff;
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				.nurse-practitioner-list-top {
					position: absolute;
					top: 0;
					right: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 111px;
					height: 26px;
					background: linear-gradient(to right, #ffa7c0, #FC4278);
					box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.4);
					border-top-right-radius: 8px;
					>text {
						font-size: 12px;
						color: #fff
					}
				};
				.nurse-practitioner-list-left {
					width: 73px;
					height: 73px;
					margin-right: 10px;
					border-radius: 50%;
					::v-deep .u-image {
						width: 73px !important;
						height: 73px !important
					}
				};
				.nurse-practitioner-list-right {
					flex: 1;
					.nurse-practitioner-name {
						display: flex;
						align-items: center;
						>text {
							&:nth-child(1) {
								font-size: 16px;
								color: #101010;
								margin-right: 10px;
								font-weight: bold
							};
							&:nth-child(2) {
								font-size: 12px;
								color: #101010;
								margin-top: 4px;
							}
						}
					};
					.hospital-name {
						margin-top: 4px;
						>text {
							word-break: break-all;
							font-size: 12px;
							color: #898C8C;
						}
					};
					.rate {
						display: flex;
						margin-top: 4px;
						>text {
							font-size: 12px;
							&:nth-of-type(1) {
								color: #E86F50;
								font-weight: bold;
								margin-left: 4px
							}
						}
					};
					.nurse-practitioner-performance {
						margin-top: 4px;
						display: flex;
						.nurse-practitioner-performance-message {
							display: flex;
							justify-content: space-between;
							.nurse-practitioner-performance-left {
								margin-right: 20px;
								>text {
									font-size: 12px;
									&:nth-child(1) {
										color: rgba(16, 16, 16, 0.35);
									};
									&:nth-child(2) {
										font-weight: bold;
										color: #101010;
									};
									&:nth-child(3) {
										color: rgba(16, 16, 16, 0.35);
									}
								}
							};
							.nurse-practitioner-performance-right {
								>text {
									font-size: 12px;
									&:nth-child(1) {
										color: rgba(16, 16, 16, 0.35);
									};
									&:nth-child(2) {
										font-weight: bold;
										color: #101010;
									};
									&:nth-child(3) {
										color: rgba(16, 16, 16, 0.35);
									}
								}
							}
						};
						.nurse-practitioner-performance-price {
							flex: 1;
							text-align: right;
							padding-right: 20px;
							box-sizing: border-box;
							>text {
								font-size: 18px;
								color: #E95E5E;
								font-weight: bold
							}
						}
					};
					.good-territory {
						margin-top: 4px;
						display: flex;
						align-items: center;
						>text {
							font-size: 12px;
							color: #fff;
							display: inline-block;
							width: 57px;
							height: 19px;
							text-align: center;
							line-height: 19px;
							background: #FEB8B7;
							border-radius: 3px;
							&:nth-child(1) {
								margin-right: 6px
							}
						}
					};
					.cut-nurse {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 185px;
						height: 31px;
						margin-top: 16px;
						border-radius: 10px;
						background: linear-gradient(to right, #ffa7c0, #FC4278);
						>image {
							width: 27px;
							height: 22px;
							margin-right: 8px
						};
						>text {
							font-size: 12px;
							color: #fff
						}
					}
				}
			};
			.nurse-practitioner-list-platform-assign {
				margin-top: 4px;
				padding: 30px 10px 20px 10px;
				box-sizing: border-box;
				background: #fff;
				border-radius: 8px;
				display: flex;
				align-items: center;
				position: relative;
				.nurse-practitioner-list-platform-assign-left {
					width: 73px;
					height: 73px;
					margin-right: 10px;
					border-radius: 50%;
					::v-deep .u-image {
						width: 73px !important;
						height: 73px !important
					}
				};
				.nurse-practitioner-list-platform-assign-right {
					.platform-assign-right-top {
						color: #000000;
						font-size: 18px;
					};
					.platform-assign-right-bottom {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 185px;
						height: 31px;
						margin-top: 16px;
						border-radius: 10px;
						background: linear-gradient(to right, #ffa7c0, #FC4278);
						>image {
							width: 27px;
							height: 22px;
							margin-right: 8px
						};
						>text {
							font-size: 12px;
							color: #fff
						}
					}
				}
			};
			.serve-people-message {
				margin-top: 4px;
				padding: 0 2px;
				box-sizing: border-box;
				background: #fff;
				.serve-site {
					display: flex;
					padding: 10px 4px 8px 10px;
					box-sizing: border-box;
					justify-content: space-between;
					@include bottom-border-1px(#E3E3E3);
					.serve-site-left {
						>image {
							width: 24px;
							height: 24px;
							margin-right: 8px;
							vertical-align: middle
						};
						>text {
							font-size: 15px;
							color: #777777
						}
					};
					.serve-site-right {
						text-align: right;
						padding-left: 4px;
						box-sizing: border-box;
						flex: 1;
						word-break: break-all;
						font-size: 14px;
						color: #777777;
					};
					.serveSiteRightStyle {
						color: #F16C8C !important
					}
				}
			};
			.upload-photo {
				margin-top: 4px;
				padding: 4px 6px 10px 6px;
				box-sizing: border-box;
				background: #fff;
				.upload-photo-title {
					font-size: 16px;
					color: #101010
				};
				.upload-photo-content {
					font-size: 12px;
					line-height: 16px;
					color: rgba(0, 0, 0, 0.4);
					margin: 2px 0
				};
				.upload-photo-list-wrapper {
					border: 1px solid #DCDCDC;
					padding: 6px 10px 10px 10px;
						background: #fff;
						box-sizing: border-box;
						>view {
							&:nth-child(1) {
								width: 100%;
								font-size: 34px;
								display: flex;
								flex-wrap: wrap;
								>view {
									width: 18%;
									height: 56px;
									display: flex;
									align-items: center;
									justify-content: center;
									vertical-align: top;
									margin-right: 2.5%;
									margin-top: 2%;
									position: relative;
									.u-icon {
										position: absolute;
										top: 0;
										right: 0
									};
									&:nth-child(5n+5) {
										margin-right: 0;
									};
									&:last-child {
										display: flex;
										align-items: center;
										justify-content: center;
										flex-direction: column;
										.u-icon {
											position: relative !important; 
										};
										background: rgba(119, 119, 119, 0.2);
										>text {
											margin-top: 6px;
											font-size: 10px;
											color: rgba(0, 0, 0, 0.4)
										}
									};
									image {
										width: 100%;
										height: 100%
									}
								}
							}
						}
				}
			}
		};
		.pay-area {
			background: #ffff;
			width: 100%;
			margin: 0 auto;
			padding: 4px 6px;
			box-sizing: border-box;
			height: 100px;
			.pay-area-top {
				margin-top: 8px;
				width: 100%;
				align-items: center;
				display: flex;
				::v-deep .u-checkbox-group {
					.u-checkbox {
						.u-checkbox__icon-wrap {
							width: 15px !important;
							height: 15px !important
						}
					}
				};
				>text {
					color: #F16C8C;
					font-size: 13px
				}
			};
			.pay-area-bottom {
				margin-top: 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.order-form-price {
					>text {
						&:first-child {
							font-size: 16px;
							color: #101010;
							margin-right: 8px
						};
						&:last-child {
							font-size: 18px;
							color: #E95E5E
						}
					}
				};
				.to-pay-btn {
					width: 118px;
					height: 38px;
					border-radius: 19px;
					background: #EB3E67;
					text-align: center;
					line-height: 38px;
					font-size: 12px;
					color: #fff
				}
			}
		}
	}
</style>
