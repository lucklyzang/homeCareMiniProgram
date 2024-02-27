<template>
	<view class="content-box">
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
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单确认" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-message-wrapper">
			<view class="service-project">
				<view class="service-project-left">
					<image :src="serviceMessage['picUrl']"></image>
				</view>
				<view class="service-project-right">
					<view class="service-project-right-top">
						<text>{{ serviceMessage.name }}</text>
					</view>
					<view class="service-project-right-bottom">
						<text v-for="(item,index) in serviceMessage.keyword" :key="index">{{ item }}</text>
					</view>
				</view>
			</view>
			<view class="nurse-choose-title">
				<text>医护选择</text>
			</view>
			<view class="nurse-practitioner-list-platform-recommend" v-if="isPlatformRecommendNurse">
				<view class="nurse-practitioner-list-top" @click="cutNurseEvent('指定')">
					<u-image src="@/static/img/change-nurse.png" width="80" height="34">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="nurse-practitioner-list-left">
					<view class="nurse-practitioner-list-left-top">
						<u-image :src="!nurseMessage.avatar ? defaultNurseAvatar : nurseMessage.avatar" width="61" height="61">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
					</view>
					<view class="rate">
						<view class="rate-text">
							<u-rate size="12" :count="nurseMessage.rateValue" readonly v-model="nurseMessage.rateValue" :active-color="nurseMessage.rateValue == 5 ? '#F9B128' : '#DCDCDC'"></u-rate>
							<text v-if="nurseMessage.commentScore">{{ nurseMessage.commentScore == 0 ? '0.0' : Math.floor(nurseMessage.commentScore/nurseMessage.commentCount).toFixed(1) }}</text>
						</view>
					</view>
				</view>
				<view class="nurse-practitioner-list-right">
					<view class="nurse-practitioner-name">
						<text>{{ nurseMessage.name }}</text>
						<text>{{ nurseMessage.title ? nurseTitleTransition(nurseMessage.title) : '无' }}</text>
					</view>
					<view class="hospital-message-center">
						<view class="hospital-name">
							<image src="@/static/img/red-circle-icon.png"></image>
							<text>{{ nurseMessage.organization }}</text>
						</view>
						<view class="nurse-service-time">
							<image src="@/static/img/red-circle-icon.png"></image>
							<text>{{ nurseMessage.practice }}</text>
						</view>
						<view class="nurse-practitioner-performance">
							<view class="nurse-practitioner-performance-left">
								<image src="@/static/img/red-circle-icon.png"></image>
								<text>帮助</text>
								<text>{{ nurseMessage.quantity }}</text>
								<text>人</text>
							</view>
							<view class="nurse-practitioner-performance-right">
								<text>服务</text>
								<text v-if="nurseMessage.timeLength">{{ nurseMessage.timeLength == 0 ? 0 : (nurseMessage.timeLength/60).toFixed(2) }}</text>
								<text>小时</text>
							</view>
						</view>
					</view>
					<view class="good-territory">
						<text v-for="(innerItem,innerIndex) in nurseMessage.genius" :key="innerIndex">{{ innerItem }}</text>
					</view>
				</view>
			</view>
			<view class="nurse-practitioner-list-platform-assign" v-if="!isPlatformRecommendNurse">
				<view class="nurse-practitioner-list-platform-assign-left">
					<u-image src="@/static/img/health-nurse.png" width="73" height="73">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="nurse-practitioner-list-platform-assign-right">
					<view class="platform-assign-right-top">
						<text>平台指派护士</text>
					</view>
				</view>
			</view>
			<view class="cut-nurse" @click="cutNurseEvent('推荐')" v-if="isPlatformRecommendNurse">
				<image :src="cutIconPng"></image>
				<text>切换为平台推荐护士</text>
			</view>
			<view class="cut-nurse" @click="cutNurseEvent('指定')" v-if="!isPlatformRecommendNurse">
				<image :src="cutIconPng"></image>
				<text>切换为指定护士</text>
			</view>
			<view class="serve-people-message">
				<view class="serve-site">
					<view class="serve-site-left">
						<image :src="serviceSitePng"></image>
						<text>服务地址</text>
					</view>
					<view class="serve-site-center" :class="{'serveSiteRightStyle' : serviceSite != '上门服务详细地址'}" @click="serviceSiteEvent">
						{{ serviceSite }}
					</view>
					<view class="function-item-right" @click="serviceSiteEvent">
						<u-icon name="arrow-right" color="#CCCCCC" size="20"></u-icon>
					</view>
				</view>
				<view class="serve-site serve-person">
					<view class="serve-site-left">
						<image :src="serviceTimePng"></image>
						<text>服务时间</text>
					</view>
					<view class="serve-site-center" :class="{'serveSiteRightStyle' : serviceDate != '期望服务时间'}" @click="expectationServiceTimeClickEvent">
						{{ serviceDate }}
					</view>
					<view class="function-item-right" @click="expectationServiceTimeClickEvent">
						<u-icon name="arrow-right" color="#CCCCCC" size="20"></u-icon>
					</view>
				</view>
				<view class="serve-site evaluation-form">
					<view class="serve-site-left">
						<image :src="servedPersonPng"></image>
						<text>被服务人</text>
					</view>
					<view class="serve-site-center" :class="{'serveSiteRightStyle' : protectedPerson != '请选择被服务人'}" @click="chooseProtectedPersonEvent">
						{{ protectedPerson }}
					</view>
					<view class="function-item-right" @click="chooseProtectedPersonEvent">
						<u-icon name="arrow-right" color="#CCCCCC" size="20"></u-icon>
					</view>
				</view>
				<view class="serve-site serve-time">
					<view class="serve-site-left">
						<image :src="evaluationFormPng"></image>
						<text>初步评估单</text>
					</view>
					<view class="serve-site-center" :class="{'serveSiteRightStyle' : writeEvaluationForm != '点击填写评估单'}" @click="writeEvaluationFormEvent">
						{{ writeEvaluationForm }}
					</view>
					<view class="function-item-right" @click="writeEvaluationFormEvent">
						<u-icon name="arrow-right" color="#CCCCCC" size="20"></u-icon>
					</view>
				</view>
			</view>
			<view class="upload-photo-title">
				上传图片
			</view>
			<view class="upload-photo-wrapper">
				<view class="upload-photo">
					<view class="number-statistics">
						<text>(</text>
						<text>{{`${imgArr.length}/`}}</text>
						<text>9)</text>
					</view>
					<view class="upload-photo-list-wrapper">
						<view>
							<view v-for="(item, index) in imgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" size="20" color="#000000" @click="photoDelete(item,index)">></u-icon>
							</view>
							<view @click="getImg">
								<u-icon name="plus" size="22" color="#CCCCCC"></u-icon>
							</view>
						</view>
					</view>
					<view class="upload-photo-content">
						您可上传就诊人的报告单、处方单、患处照片等图像资料。注射项目必须上传医疗诊断、药品包装及注射单(最多9张)
					</view>
				</view>
			</view>
			<view class="pay-area-top-wrapper">
				<view class="pay-area-top">
					<u-checkbox-group v-model="isReadAgreeChecked"
					 @change="checkboxAgreementChange"
					>
						<u-checkbox 
							shape="square" 
							v-for="(item, index) in checkboxList"
							:key="index"
							size="18"
							icon-size="16"
							label-size="13"
							:label="item.name"
							:name="item.name"
							active-color="#F92C20">
						</u-checkbox>
					</u-checkbox-group>
					<text @click="userLicenseAgreementClickEvent">《用户授权协议》</text>
				</view>
			</view>
		</view>
		<view class="pay-area">
			<view class="pay-area-bottom">
				<view class="order-form-price">
					<text>订单金额</text>
					<text>￥</text>
					<text>{{ `${serviceMessage.price}` }}</text>
				</view>
				<view class="to-pay-btn" @click="toAppointmentEvent">
					立即预约
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
	import store from '@/store'
	import {
		setCache,
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import _ from 'lodash'
	import { createOrder,getOrderDetail } from '@/api/orderForm.js'
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
				isCanSure: false,
				serviceSite: '上门服务详细地址',
				serviceDate: '期望服务时间',
				protectedPerson: '请选择被服务人',
				writeEvaluationForm: '点击填写评估单',
				imgArr: [],
				imgFileArr: [],
				imgOnlinePathArr: [],
				isReadAgreeChecked: [],
				userLicenseAgreementShow: false,
				expectationServiceTimeShow: false,
				checkboxList: [
					{
						name: '我已阅读并同意协议',
						disabled: false
					}
				],
				isPlatformRecommendNurse: false,
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
				aptitudes: [],
				serviceMessage: {},
				nurseMessage: {}, 
				beforePageRoute: '',
				timeQuantumList: ['上午8:00 - 9:00','上午9:00 - 10:00','上午10:00 - 11:00',
				'上午11:00 - 12:00','上午12:00 - 13:00','下午13:00 - 14:00','下午14:00 - 15:00',
				'下午15:00 - 16:00','下午16:00 - 17:00','下午17:00 - 18:00'
				]
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'nurseRankDictData',
				'serviceOrderFormSureChooseMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryAddress = JSON.parse(decodeURIComponent(options.transmitData));
			let pages = getCurrentPages();//当前页
			this.beforePageRoute = pages[pages.length - 2].route;//上个页面路径
			if (this.beforePageRoute == 'pages/orderForm/orderForm' || this.beforePageRoute == 'orderFormPackage/pages/orderFormDetails/orderFormDetails' || this.beforePageRoute == 'orderFormPackage/pages/serviceEvaluateFeedback/serviceEvaluateFeedback') {
				this.queryOrderDetail({id: temporaryAddress.id});
				return
			};
			this.serviceMessage = _.cloneDeep(temporaryAddress);
			this.serviceMessage.keyword = this.serviceMessage.keyword.split(";")
		},
		
		onShow () {
			if (this.serviceOrderFormSureChooseMessage.hasOwnProperty('chooseNurseMessage')) {
				if (JSON.stringify(this.serviceOrderFormSureChooseMessage.chooseNurseMessage) != "{}") {
					this.nurseMessage = this.serviceOrderFormSureChooseMessage.chooseNurseMessage
				} else {
					this.isPlatformRecommendNurse = false;
				}
			} else {
				this.isPlatformRecommendNurse = false;
			};
			if (this.serviceOrderFormSureChooseMessage.hasOwnProperty('chooseAddressMessage')) {
				if (JSON.stringify(this.serviceOrderFormSureChooseMessage.chooseAddressMessage) != "{}") {
					this.serviceSite = `${this.serviceOrderFormSureChooseMessage.chooseAddressMessage.address}${this.serviceOrderFormSureChooseMessage.chooseAddressMessage.detailAddress}`
				}
			};
			if (this.serviceOrderFormSureChooseMessage.hasOwnProperty('chooseProtegePersonMessage')) {
				if (JSON.stringify(this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage) != "{}") {
					this.protectedPerson = `${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.name} ${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.sex == 1 ? '男' : '女'} ${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.age}岁 ${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.mobile}`
				}
			}
		},
		
		methods: {
			...mapMutations([
				'storeServiceOrderFormSureChooseMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 协议弹框值变化事件
			checkboxAgreementChange (n) {
				if (n.length > 0) {
					this.userLicenseAgreementClickEvent()
				}
			},
			
			// 切换护士类型事件
			cutNurseEvent (text) {
				if (text == '指定') {
					// 传递服务资质
					let mynavData = encodeURIComponent(JSON.stringify(this.serviceMessage));
					uni.navigateTo({
						url: '/servicePackage/pages/chooseNurse/chooseNurse?transmitData='+mynavData
					});
					this.isPlatformRecommendNurse = true
				} else {
					this.isPlatformRecommendNurse = false
				}
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
						this.serviceMessage.keyword = res.data.data.keywords;
						this.serviceMessage.picUrl = res.data.data.items[0]['picUrl'];
						this.serviceMessage.name = res.data.data.items[0]['spuName'];
						this.serviceMessage.price = fenToYuan(res.data.data.items[0]['price']);
						if (res.data.data.assignType == 'SYSTEM') {
							this.isPlatformRecommendNurse = false
						} else if (res.data.data.assignType == 'USER') {
							this.isPlatformRecommendNurse = true;
							this.getNurseDetailsEvent({id: res.data.data.careId});
						};
						let tmporaryServiceOrderFormSureChooseMessage = this.serviceOrderFormSureChooseMessage;
						
						// 将该服务订单的被护人信息存入store
						let temporaryServerPersonMessage = res.data.data.serverPerson;
						tmporaryServiceOrderFormSureChooseMessage['chooseProtegePersonMessage'] = temporaryServerPersonMessage;
						this.storeServiceOrderFormSureChooseMessage(tmporaryServiceOrderFormSureChooseMessage);
						this.protectedPerson = `${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.name} ${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.sex == 1 ? '男' : '女'} ${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.age}岁 ${this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.mobile}`;
						
						// 再次预约时将存入store服务地址清空 
						let temporaryAddressMessage = {};
						// temporaryAddressMessage['address'] = res.data.data.receiverAreaName.replace(/\s*/g,"");
						// temporaryAddressMessage['detailAddress'] =  res.data.data.receiverDetailAddress;
						// temporaryAddressMessage['areaId'] =  res.data.data.receiverAreaId;
						// temporaryAddressMessage['id'] =  '';
						tmporaryServiceOrderFormSureChooseMessage['chooseAddressMessage'] = temporaryAddressMessage;
						this.storeServiceOrderFormSureChooseMessage(tmporaryServiceOrderFormSureChooseMessage);
						// this.serviceSite = `${this.serviceOrderFormSureChooseMessage.chooseAddressMessage.address}${this.serviceOrderFormSureChooseMessage.chooseAddressMessage.detailAddress}`;
						this.serviceSite = '上门服务详细地址'
						
						// 回显服务时间
						this.serviceDate = `${this.getNowFormatDateText(res.data.data.serviceDate)} (${this.judgeWeek(res.data.data.serviceDate)}) ${res.data.data.serviceTime}`;
						this.currentSelectDate.actualDate = res.data.data.serviceDate;
						this.currentSelectTimeQuantum = `上午${res.data.data.serviceTime}`;
						this.aptitudes = res.data.data.aptitudes
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
			
			// 获取医护详情
			getNurseDetailsEvent(data) {
				this.showLoadingHint = true;
				this.infoText = '加载中···';
				getNurseDetails(data).then((res) => {
					if ( res && res.data.code == 0) {
						let temporaryNurseMessage = res.data.data;
						temporaryNurseMessage['rateValue'] = res.data.data.commentScore == 0 ? 0 : Math.floor(res.data.data.commentScore/res.data.data.commentCount);
						let tmporaryServiceOrderFormSureChooseMessage = this.serviceOrderFormSureChooseMessage;
						tmporaryServiceOrderFormSureChooseMessage['chooseNurseMessage'] = temporaryNurseMessage;
						this.storeServiceOrderFormSureChooseMessage(tmporaryServiceOrderFormSureChooseMessage);
						this.nurseMessage = this.serviceOrderFormSureChooseMessage['chooseNurseMessage']
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
				if (this.currentTimeQuantumIndex === null) {
					this.$refs.uToast.show({
						message: "请选择时间段!",
						position: 'top'
					});
					return
				};
				this.serviceDate = `${this.currentSelectDate.showDate} ${this.currentSelectTimeQuantum}`;
				this.expectationServiceTimeShow = false
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
					console.log('时间段回显',temporarayArr);
					this.currentTimeQuantumIndex = this.timeQuantumList.findIndex((item) => { return item == `${temporarayArr[2]} ${temporarayArr[3]} ${temporarayArr[4]}` });;
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
			
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgArr.splice(this.imgIndex, 1);
				this.imgFileArr.splice(this.imgIndex, 1)
			},
			
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false;
			},
			
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 选择图片方法
			getImg() {
				if (this.imgFileArr.length > 9) {
					this.$refs.uToast.show({
						message: '至多只能上传9张图片!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let that = this;
				uni.chooseImage({
					count: 3,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							let url = res.tempFiles[imgI].path;
							//获取最后一个的位置
							let index = url.lastIndexOf(".");
							//获取后缀
							let jpgUrl = url.substr(index + 1);
							if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
								that.$refs.uToast.show({
									message: '只能上传jpg/png格式的图片!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							let isLt2M = res.tempFiles[imgI].size/1024/1024 < 5;
							if (!isLt2M) {
								that.$refs.uToast.show({
									message: '图片不能大于5MB!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							that.imgFileArr.push(res.tempFiles[imgI]['path']);
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
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
			
			// 上传图片到服务器
			uploadFileEvent (imgI) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				return new Promise((resolve, reject) => {
					uni.uploadFile({
					 url: 'https://dev.nurse.blinktech.cn/nurse/app-api/infra/file/upload',
					 filePath: imgI,
					 name: 'file',
					 header: {
						'content-type': 'multipart/form-data',
						'Authorization': `Bearer ${store.getters.token}`
					 },
					 success: (res) => {
						if (res.statusCode == 200) {
							let temporaryData = JSON.parse(res.data);
							this.imgOnlinePathArr.push(temporaryData.data);
							resolve()
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '上传图片失败',
								type: 'error',
								position: 'center'
							});
							reject()
						}
					 },
					 fail: (err) => {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: err.errMsg,
							type: 'error',
							duration: 5000,
							position: 'center'
						});
						reject()
					 }
					})
				})
			},
			
			// 立即预约事件
			async toAppointmentEvent () {
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
				let temporaryItems = [];
				if (this.beforePageRoute == 'pages/orderForm/orderForm' || this.beforePageRoute == 'orderFormPackage/pages/orderFormDetails/orderFormDetails' || this.beforePageRoute == 'orderFormPackage/pages/serviceEvaluateFeedback/serviceEvaluateFeedback') {
					// for (let item of this.serviceMessage.items) {
					// 	temporaryItems.push({
					// 		skuId: item.skuId,
					// 		count: item.count,
					// 		cartId: ''
					// 	})
					// }
					temporaryItems.push({
						skuId: this.serviceMessage.items[0].skuId,
						count: this.serviceMessage.items[0].count,
						cartId: ''
					})
				} else {
					// for (let item of this.serviceMessage.skus) {
					// 	temporaryItems.push({
					// 		skuId: item.id,
					// 		count: 1,
					// 		cartId: ''
					// 	})
					// }
					temporaryItems.push({
						skuId: this.serviceMessage.skus[0].id,
						count: 1,
						cartId: ''
					})
				};
				// 上传图片文件流到服务端
				if (this.imgFileArr.length > 0) {
					if (this.imgFileArr.length > 9) {
						this.$refs.uToast.show({
							message: '至多只能上传9张图片!',
							type: 'error',
							position: 'bottom'
						});
						return
					};
					for (let imgI of this.imgFileArr) {
						await this.uploadFileEvent(imgI)
					}
				};
				this.createOrderEvent({
					items: temporaryItems,
					pointStatus: false,
					deliveryType: 3,
					addressId: this.serviceOrderFormSureChooseMessage.chooseAddressMessage.id,
					careId: this.isPlatformRecommendNurse ? this.serviceOrderFormSureChooseMessage.chooseNurseMessage.id : "",
					remark: "",
					serviceDate: this.currentSelectDate.actualDate,
					serviceTime: this.currentSelectTimeQuantum.replace(/[\u4e00-\u9fa5]+/gi,''),
					servicePersonId: this.serviceOrderFormSureChooseMessage.chooseProtegePersonMessage.id,
					images: this.imgOnlinePathArr,
					assignType: this.isPlatformRecommendNurse ? "USER" : "SYSTEM"
				})
			},
			
			// 创建服务订单
			createOrderEvent(data) {
				this.infoText = '预约中···';
				this.showLoadingHint = true;
				createOrder(data).then((res) => {
					this.imgOnlinePathArr = [];
					if ( res && res.data.code == 0) {
						let tmporaryServiceOrderFormSureChooseMessage = this.serviceOrderFormSureChooseMessage;
						tmporaryServiceOrderFormSureChooseMessage['serviceMessage'] = this.serviceMessage;
						this.storeServiceOrderFormSureChooseMessage(tmporaryServiceOrderFormSureChooseMessage);
						// 传递订单信息
						let mynavData = JSON.stringify(res.data.data);
						uni.navigateTo({
							url: '/orderFormPackage/pages/orderPay/orderPay?transmitData='+mynavData
						});
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
					this.imgOnlinePathArr = [];
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
			padding: 10px 0 0 0;
			box-sizing: border-box;
			width: 100%;
			.service-project {
				width: 95%;
				margin: 0 auto;
				display: flex;
				padding: 12px 10px;
				box-sizing: border-box;
				background: #fff;
				.service-project-left {
					margin-right: 10px;
					>image {
						width: 66px;
						height: 66px
					}
				};
				.service-project-right {
					flex: 1;
					width: 0;
					.service-project-right-top {
						margin-bottom: 5px;
						width: 100%;
						>text {
							display: inline-block;
							width: 100%;
							font-size: 16px;
							color: #000000;
							font-weight: 400;
							@include no-wrap;
						}
					};
					.service-project-right-bottom {
						width: 100%;
						word-break: break-all;
						>text {
							margin-bottom: 4px;
							display: inline-block;
							font-size: 11px;
							color: #fff;
							font-weight: 600;
							margin-right: 4px;
							background: #FEB8B7;
							border-radius: 3px;
							padding: 2px 6px;
							box-sizing: border-box;
							&:last-child {
								margin-right: 0 !important
							}
						}
					}
				}
			};
			.nurse-practitioner-list-platform-assign {
				width: 95%;
				margin: 0 auto;
				padding: 20px 10px;
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
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
				};
				.nurse-practitioner-list-platform-assign-right {
					.platform-assign-right-top {
						font-size: 18px;
						color: #000000;
						font-weight: 400;
					}
				}
			};
			.nurse-choose-title {
				width: 95%;
				margin: 0 auto;
				height: 50px;
				font-size: 17px;
				color: #000000;
				font-weight: 500;
				display: flex;
				align-items: center
			};
			.nurse-practitioner-list-platform-recommend {
				width: 95%;
				margin: 0 auto;
				padding: 30px 10px 20px 10px;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				.nurse-practitioner-list-top {
					position: absolute;
					top: 0;
					right: -10px;
					width: 80px;
					height: 34px;
				};
				.nurse-practitioner-list-left {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin-right: 10px;
					width: 90px;
					.nurse-practitioner-list-left-top {
						width: 70px;
						height: 70px;
						::v-deep .u-image {
							width: 70px !important;
							height: 70px !important;
							border-radius: 50% !important;
							uni-image {
								width: 70px !important;
								height: 70px !important;
								border-radius: 50% !important;
							}
						};
						::v-deep image {
							width: 70px !important;
							height: 70px !important;
							border-radius: 50% !important;
						}
					};
					.rate {
						margin-top: 6px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.rate-text {
							>text {
								width: 100%;
								text-align: center;
								display: inline-block;
								font-size: 11px;
								font-weight: 400;
								color: #999999;
								font-weight: 400;
							};
							.textStyle {
								color: #d6d6d6 !important;
							}
						}
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
								color: #000000;;
								margin-right: 10px;
								max-width: 100px;
								@include no-wrap;
								font-weight: 400;
							};
							&:nth-child(2) {
								font-size: 14px;
								font-weight: 400;
								color: #F2A15F;
							}
						}
					};
					.hospital-message-center {
						margin: 8px 0;
						display: flex;
						flex-direction: column;
						background: #FAFAFA;
						padding: 6px;
						box-sizing: border-box;
						.hospital-name {
							display: flex;
							align-items: center;
							image {
								width: 6px;
								height: 6px;
								margin-right: 4px;
							};
							>text {
								flex: 1;
								word-break: break-all;
								font-size: 13px;
								color: #666666;
								font-weight: 400;
							}
						};
						.nurse-service-time {
							display: flex;
							align-items: center;
							margin: 4px 0;
							image {
								width: 6px;
								height: 6px;
								margin-right: 4px;
							};
							>text {
								flex: 1;
								word-break: break-all;
								font-size: 13px;
								color: #666666;
								font-weight: 400;
							}
						};
						.nurse-practitioner-performance {
							display: flex;
							.nurse-practitioner-performance-left {
								margin-right: 20px;
								display: flex;
								align-items: center;
								position: relative;
								image {
									width: 6px;
									height: 6px;
									margin-right: 4px; 
								};
								>text {
									font-size: 13px;
									font-weight: 400;
									&:nth-child(2) {
										color: #666666;
									};
									&:nth-child(3) {
										color: #E81F50;
										margin: 0 4px;
									};
									&:nth-child(4) {
										color: #666666;
									}
								}
							};
							.nurse-practitioner-performance-left ::after {
								content: '';
								width: 1px;
								height: 14px;
								background: #666666;
								position: absolute;
								top: 1px;
								right: -10px;
							};
							.nurse-practitioner-performance-right {
								display: flex;
								align-items: center;
								>text {
									font-size: 13px;
									font-weight: 400;
									&:nth-child(1) {
										color: #666666;
									};
									&:nth-child(2) {
										margin: 0 4px;
										color: #E81F50;
									};
									&:nth-child(3) {
										color: #666666
									}
								}
							}
						}
					};
					.good-territory {
						display: flex;
						margin-top: 6px;
						>text {
							font-size: 11px;
							color: #fff;
							display: inline-block;
							padding: 0 6px;
							box-sizing: border-box;
							height: 20px;
							text-align: center;
							line-height: 20px;
							background: #FEB8B7;
							border-radius: 3px;
							&:nth-child(1) {
								margin-right: 6px
							}
						}
					}
				}
			};
			.cut-nurse {
				width: 95%;
				margin: 0 auto;
				margin-top: 10px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #FFFFFF;
				box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.05);
				border-radius: 5px;
				image {
					width: 20px;
					height: 20px;
					margin-right: 10px;
				};
				>text {
					font-size: 14px;
					color: #333333;
					font-weight: 400;
				}
			};
			.serve-people-message {
				width: 95%;
				margin: 0 auto;
				margin-top: 10px;
				background: #fff;
				.serve-site {
					display: flex;
					padding: 12px 10px;
					align-items: center;
					box-sizing: border-box;
					justify-content: space-between;
					@include bottom-border-1px(#DCDCDC);
					.serve-site-left {
						display: flex;
						align-items: center;
						margin-right: 10px;
						>image {
							width: 18px;
							height: 18px;
							margin-right: 8px;
						};
						>text {
							font-size: 14px;
							color: #333333;
							font-weight: 400
						}
					};
					.serve-site-center {
						text-align: left;
						padding: 0 4px 0 4px;
						box-sizing: border-box;
						flex: 1;
						word-break: break-all;
						font-size: 14px;
						color: #999999;
						font-weight: 400;
					};
					.serveSiteRightStyle {
						color: #333333 !important
					}
				}
			};
			.upload-photo-title {
				height: 50px;
				width: 95%;
				margin: 0 auto;
				font-size: 17px;
				color: #000000;
				font-weight: 500;
				display: flex;
				align-items: center;
			};
			.upload-photo-wrapper {
				width: 95%;
				margin: 0 auto;
				.upload-photo {
					position: relative;
					padding: 18px 10px 10px 10px;
					box-sizing: border-box;
					background: #fff;
					.number-statistics {
						position: absolute;
						top: 6px;
						right: 4px;
						font-size: 12px;
						color: #999999;
						font-weight: 400;
					};
					.upload-photo-content {
						font-size: 12px;
						line-height: 16px;
						color: #999999;
						font-weight: 400;
						margin-top: 10px;
					};
					.upload-photo-list-wrapper {
							background: #fff;
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
											background: #EEEEEE;
											box-sizing: border-box;
											border: 1px solid rgba(220,220,220,1);
											border-radius: 3px;
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
			.pay-area-top-wrapper {
				.pay-area-top {
					width: 95%;
					margin: 0 auto;
					align-items: center;
					display: flex;
					height: 40px;
					border-radius: 5px;
					::v-deep .u-checkbox-group {
						.u-checkbox {
						}
					};
					>text {
						font-size: 13px;
						color: #508BED;
						font-weight: 400;
					}
				}
			}
		};
		.pay-area {
			background: #ffff;
			width: 95%;
			margin: 0 auto;
			height: 65px;
			justify-content: space-between;
			display: flex;
			align-items: center;
			.pay-area-bottom {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.order-form-price {
					>text {
						&:first-child {
							font-size: 13px;
							color: #333333;
							font-weight: 400;
							margin-right: 8px
						};
						&:nth-child(2) {
							font-size: 12px;
							color: #F92C20;
							font-weight: 500;
						};
						&:last-child {
							font-size: 17px;
							color: #F92C20;
							font-weight: 500;
						}
					}
				};
				.to-pay-btn {
					width: 90px;
					height: 40px;
					line-height: 40px;
					background: #E81F50;
					box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.05);
					border-radius: 5px;
					font-size: 14px;
					color: #FFFFFF;
					text-align: center;
					font-weight: 400;
				}
			}
		}
	}
</style>
