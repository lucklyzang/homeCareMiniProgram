<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 触发订阅消息弹框 -->
		<view class="subscription-dialog-box trigger-subscription-dialog-box">
			<u-modal :show="showTriggerPopup" mode="center" @confirm="triggerConfirmHandle" @cancel="showTriggerPopup = false" confirmText="确定" cancelText="取消" cancelColor="#838C97" confirmColor="#FF698C" content="为了获取更好的使用体验,您是否需要订阅相关消息提醒?" :showCancelButton="true" title="订阅提示">
			</u-modal>
		</view>
		<!-- 订阅消息提醒开启询问弹框 -->
		<view class="subscription-dialog-box">
			<u-modal :show="showPopup" mode="center" @confirm="confirmHandle" @cancel="cancelHandle" :confirmText="confirmText" :cancelText="cancelText" cancelColor="#838C97" confirmColor="#FF698C" :content="content" :showCancelButton="true" title="设置提示">
			</u-modal>
		</view>
		<!-- 我的客服弹框 -->
		<view class="support-staff-box">
			<u-popup :show="showSupportStaffBox" :closeable="true" mode="center"  @close="closeSupportStaffBox">
				<view class="support-staff-content">
					<view class="support-staff-top">
							<image src="@/static/img/support-staff.png"></image>
							<text>服务电话</text>
							<text>409-5646-89893434</text>
					</view>
					<view class="support-staff-bottom">
						<view class="support-staff-left">
							<image src="@/static/img/message.png"></image>
							<button open-type="contact" bindcontact="handleContact" session-from="sessionFrom">发送消息</button>
						</view>
						<view class="support-staff-right">
							<image src="@/static/img/phone.png"></image>
							<text>拨打电话</text>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="top-area">
			<view class="top-area-left" @click="searchEvent">
				<u-search placeholder="输入医院、护士、服务项目" bg-color="#fff" :show-action="false" v-model="searchValue"></u-search>
			</view>
			<view class="top-area-right">
				<image src="@/static/img/scan-icon.png" @click="scanCodeEvent"></image>
				<image src="@/static/img/home-service-icon.png" @click="showSupportStaffBox = true"></image>
			</view>
		</view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="banner-area-box">
			<u-swiper @click="swiperClickEvent" keyName="image"  indicator :list="bannerList"></u-swiper>
		</view>
		<view class="center-area">
			<view class="nurse-type">
				<view class="nurse-type-list" v-for="(item,index) in productTypeList" :key="index" @click="enterServiceTypeEvent(item,index)">
					<image :src="item.picUrl"></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
			<view class="latest-news">
				<view class="latest-news-left">
					<image src="@/static/img/latest-news.png" @click="enterMessageListEvent"></image>
				</view>
				<view class="latest-news-right">
					<view class="new-content-list" v-for="(item,index) in noticeList" :key="index" @click="enterLatestNewsDetailsEvent(item)">
						{{ item.title }}
					</view>
				</view>
			</view>
			<view class="recommend-service">
				<view class="service-title">
					<view class="service-title-left">推荐服务</view>
					<view class="service-title-right"></view>
				</view>
				<view class="service-list-box">
					<view class="service-list" v-for="(item,index) in recommendProductList" @click="enterServiceDetailsEvent(item.id)">
						<view class="service-list-top">
							<u-image :src="item.picUrl">
								 <template v-slot:loading>
								    <u-loading-icon color="red"></u-loading-icon>
								  </template>
							</u-image>
						</view>
						<view class="service-list-bottom">
							<view class="service-project">
								<text>{{ item.name }}</text>
								<text>内部专属护理,欢迎体验!</text>
							</view>
							<view class="service-price">
								<text>￥</text>
								<text>{{ `${item.price}` }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="recommend-nurse-practitioner">
				<view class="nurse-practitioner-title">
					<view class="nurse-practitioner-title-left">
						<text>推荐护师</text>
					</view>
					<view class="nurse-practitioner-title-right" @click="viewMoreSpecialistEvent">
						<text>查看更多</text>
						<!-- <u-icon name="arrow-right" color="#3B9DF9" size="18"></u-icon> -->
					</view>
				</view>
				<view class="nurse-practitioner-list" v-for="(item,index) in nurseList" @click="viewSpecialistDetailsEvent(item)">
					<view class="nurse-practitioner-list-left">
						<view class="nurse-practitioner-list-left-top">
							<u-image :src="!item.avatar ? defaultNurseAvatar : item.avatar" width="70" height="70">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="rate">
							<u-rate size="12" :count="!item.rateValue ? 5 : item.rateValue" readonly v-model="item.rateValue" :active-color="item.rateValue == 5 ? '#F9B128' : '#DCDCDC'"></u-rate>
							<view class="rate-text">
								<text>{{ item.commentCount }}</text>
								<text>条评价</text>
							</view>
						</view>
					</view>
					<view class="nurse-practitioner-list-right">
						<view class="nurse-practitioner-name">
							<text>{{ item.name }}</text>
							<text>{{ item.title ? nurseTitleTransition(item.title) : '无' }}</text>
						</view>
						<view class="hospital-message-center">
							<view class="hospital-name">
								<image src="@/static/img/red-circle-icon.png"></image>
								<text>{{ item.organization }}</text>
							</view>
							<view class="nurse-practitioner-performance">
								<view class="nurse-practitioner-performance-left">
									<image src="@/static/img/red-circle-icon.png"></image>
									<text>帮助</text>
									<text>{{ item.quantity }}</text>
									<text>人</text>
								</view>
								<view class="nurse-practitioner-performance-right">
									<text>服务</text>
									<text>{{ item.timeLength == 0 ? 0 : (item.timeLength/60).toFixed(2) }}</text>
									<text>小时</text>
								</view>
							</view>
						</view>
						<view class="good-territory">
							<text v-for="(innerItem,innerIndex) in item.genius" :key="innerIndex">{{ innerItem }}</text>
						</view>
					</view>
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
	import { createSubscribe, getSubscribeTemplateList } from '@/api/login.js'
	import { getUserBannerList, getNurse, newsPage, getHomeHotProduct, getHomeProductCategory } from '@/api/user.js'
	import { fenToYuan } from '@/common/js/utils'
	import _ from 'lodash'
	export default {
		components: {
		},
		data() {
			return {
				showTriggerPopup: false, // 触发订阅消息弹框显示
				showPopup: false, // 订阅消息提醒开启询问弹框显示
				content: '为了接收消息提醒,是否需要打开接收消息设置?', // 弹框提示内容，
				confirmText: '开启消息提醒',
				cancelText: '不需要',
				tmplId: [],
				bannerList: [],
				showSupportStaffBox: false,
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				productTypeList: [],
				recommendProductList: [],
				nurseList: [],
				searchValue: '',
				showLoadingHint: false,
				noticeList: [],
				currentPage: 1,
				pageSize: 2
			}
		},	
		onShow() {
			this.queryUserBannerList({position: 1});
			this.queryNewsPageList({
				pageNo: this.currentPage,
				pageSize: this.pageSize,
				terminal: 'USER'
			});
			this.queryNurseList({
				pageNo: 1,
				pageSize: 3
			});
			this.queryHomeHotProduct({
				recommendType: 'hot',
				count: 4
			});
			this.queryHomeProductCategory()
		},
		
		onLoad () {
			this.getUserCode();
			this.getSubscribeTemplateListEvent()
		},
		
		onHide () {
		},
		destroyed () {
		},
		computed: {
			...mapGetters([
				'userInfo',
				'nurseRankDictData'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			}
		},
		methods: {
			...mapMutations([
				'changeParentServiceCategoryMessage',
				'changeSelectBannerMessage'
			]),
			
			// 获取用户登录凭证
			getUserCode () {
				// 获取用户code
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.userCode = loginRes.code
	　　　　}
				})
			},
			
			// 获取订阅消息模板列表
			getSubscribeTemplateListEvent() {
				this.showLoadingHint = true;
				this.tmplId = [];
				getSubscribeTemplateList(1).then((res) => {
					if ( res && res.data.code == 0) {
						for (let item of res.data.data) {
							this.tmplId.push(item.templateId)
						};
						if (this.tmplId.length > 0) {
							this.showTriggerPopup = true
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 创建订阅
			createSubscribeEvent(data) {
				this.showLoadingHint = true;
				createSubscribe(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '订阅成功!',
							type: 'success',
							position: 'center'
						})
					} else {
						this.$refs.uToast.show({
							message: '订阅失败!',
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 订阅消息代码
			// 判断消息订阅总开关是否打开
			triggerConfirmHandle () {
				this.showTriggerPopup = false;
				uni.getSetting({
					withSubscriptions: true,
					success:(res)=> {
						if (!res.subscriptionsSetting.mainSwitch) { // 订阅消息的总开关,如果是关着的,引导用户去打开
							this.showPopup = true;
						} else { // 如果开着，则继续向下打开弹窗，获取用户授权
							this.messageSubscription()
						}
					},
					fail:()=> {
						this.messageSubscription() // 如果失败，也打开弹窗，获取用户授权
					}
				})
			},
			
			// 弹窗点订阅，开启消息订阅提醒
			confirmHandle() {
				if (this.confirmText == '确定') {
					this.messageSubscription()
					return
				};
				uni.openSetting({
					withSubscriptions: true,
					complete:(res)=> {
						uni.getSetting({
							withSubscriptions: true,
							success:(res)=> {
								if (res.subscriptionsSetting.mainSwitch) { // 订阅消息的总开关,如果是开着的
									this.content = '再次点击确定,弹出即可完成订阅';
									this.cancelText = '取消';
									this.confirmText = '确定';
								} else {
									this.showPopup = false;
								}
							},
							fail:(err)=> {
								this.$refs.uToast.show({
									message: err.errMsg,
									type: 'error',
									position: 'bottom'
								})
							}
						})
					}
				})
			},
			
			// 弹窗点不订阅
			cancelHandle() {
				this.showPopup = false;
			},
			
			// 订阅申请弹出,只允许点击弹出
			messageSubscription() {
				this.showPopup = false;
				this.content = '为了获取更好的使用体验,您是否需要订阅相关消息提醒?' // 弹框提示内容
				this.confirmText = '开启消息提醒';
				this.cancelText = '不需要';
				uni.requestSubscribeMessage({
					tmplIds: this.tmplId,
					success: (res) => {
						let temporaryTemIdArr = [];
						for (let key in res) {
							if (res[key] == "accept") {
								uni.showToast({
									title: '已允许消息推送'
								});
								temporaryTemIdArr.push(key)
							}
						};
						// 创建订阅
						this.createSubscribeEvent({
							templateIdList: temporaryTemIdArr,
							code: this.userCode,
							type: 1
						})
					},
					fail: (err) => {
						console.log('sas',err);
						this.$refs.uToast.show({
							message: err.errMsg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
			},
			
			//客服弹框关闭事件
			closeSupportStaffBox () {
				this.showSupportStaffBox = false
			},
			
			// 扫码事件
			scanCodeEvent () {
				let that = this;
				uni.scanCode({
					success: function (res) {
					},
					fail: function (err) {
						that.$refs.uToast.show({
							message: `${err.errMsg}`,
							type: 'error',
							position: 'center'
						})
					}
				})
			},
			
			handleContact(e) {
				console.log(e.detail.path,e.detail.quer)
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
			
			// 获取最新资讯列表
			queryNewsPageList (data) {
				this.showLoadingHint = true;
				this.noticeList = [];
				newsPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (JSON.stringify(res.data.data) == '{}') {
							return
						};
						this.noticeList = res.data.data.list;
						this.noticeList.forEach((item) => {
							item.description = item.description.replace(/\<img/gi, '<img class="mystyle"');
							item.description = item.description.replace(/\<p/gi, '<p class="pstyle"');
							item.description = item.description.replace(/\<div/gi, '<div class="dstyle"')
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
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 进入最新资讯详情事件
			enterLatestNewsDetailsEvent (item) {
				// 传递资讯详情内容
				let mynavData = encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: '/messagePackage/pages/latestNewsDetails/latestNewsDetails?transmitData='+mynavData
				})
			},
			
			// 查询首页医护
			queryNurseList(data) {
				this.showLoadingHint = true;
				getNurse(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.nurseList = res.data.data.list;
						if (res.data.data.list.length == 0) {
						} else {
							this.nurseList.forEach((item) => {
								item['rateValue'] = item.commentScore == 0 ? 0 : Math.floor(item.commentScore/item.commentCount) > 5 ? 5 : Math.floor(item.commentScore/item.commentCount); 
							})
						}
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
			
			// 查询首页商品分类
			queryHomeProductCategory() {
				this.showLoadingHint = true;
				getHomeProductCategory().then((res) => {
					if ( res && res.data.code == 0) {
						this.productTypeList = res.data.data;
						if (res.data.data.length == 0) {
						}
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
			
			// 查询首页推荐商品
			queryHomeHotProduct(data) {
				this.showLoadingHint = true;
				getHomeHotProduct(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.recommendProductList = res.data.data;
						this.recommendProductList.forEach((item) => {
							return item.price = fenToYuan(item.price)
						});
						if (res.data.data.length == 0) {
						}
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
			
			// 轮播图点击事件
			swiperClickEvent (index) {
				// 传递轮播图信息
				let mynavData = {};
				mynavData['index'] = index;
				mynavData['content'] = this.bannerList;
				this.changeSelectBannerMessage(mynavData);
				uni.navigateTo({
					url: '/messagePackage/pages/advertisingDetails/advertisingDetails'
				})
			},
			
			// 进入最新资讯列表事件
			enterMessageListEvent () {
				uni.navigateTo({
					url: '/messagePackage/pages/message/index/index'
				})
			},
			
			// 进入搜索页事件
			searchEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/searchDetails/searchDetails'
				})
			},
			
			// 进入服务类别大类事件
			enterServiceTypeEvent (item,index) {
				this.changeParentServiceCategoryMessage(item);
				uni.switchTab({
					url: '/pages/service/service?transmitData'
				})
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent (item) {
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index?transmitData='+item
				})
			},
			
			// 查看护师详情事件
			viewSpecialistDetailsEvent (item) {
				// 传递护师信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/servicePackage/pages/specialistDetails/specialistDetails?transmitData='+mynavData
				})
			},
			
			// 查看更多护师事件
			viewMoreSpecialistEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/moreSpecialist/moreSpecialist'
				})
			},
			
			// 获取首页banner列表
			queryUserBannerList (data) {
				this.showLoadingHint = true;
				this.bannerList = [];
				getUserBannerList(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.bannerList.push({
									image: item.picUrl,
									title: '',
									content: item.content
								})
							}
						}
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
		padding-bottom: 0;
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		background: #f5f5f5;
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		};
		.uni-ec-canvas {
			width: 100%;
			height: 100px; 
			display: block;
		};
		.subscription-dialog-box {
			::v-deep .u-popup__content{
				.u-modal {
					.u-modal__title {
						font-size: 16px !important;
						color: #101010 !important
					};
					.u-line {
						border: none !important
					};
					.u-modal__content {
						text-align: center;
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
							width: 110px !important;
							height: 34px !important;
							line-height: 34px !important;
							border-radius: 7px !important;
							border: 1px solid #FF698C !important;
							margin-right: 30px;
							.u-modal__button-group__wrapper__text {
								font-size: 14px;
								color: #FF698C !important;
							}
						};
						.u-modal__button-group__wrapper--confirm {
							flex: none !important;
							width: 110px !important;
							height: 34px !important;
							line-height: 34px !important;
							border-radius: 7px !important;
							background: #FF698C !important;
							border: none !important;
							.u-modal__button-group__wrapper__text {
								font-size: 14px;
								color: #fff !important;
							}
						}
					}
				}
			}	
		};
		::v-deep .u-popup {
			.u-popup__content {
				width: 90%;
				padding: 30px 10px 20px 10px;
				box-sizing: border-box;
				border-radius: 14px;
				.u-popup__content__close {
					.u-icon__icon {
						color: #101010 !important
					}
				};
				.support-staff-content {
					.support-staff-top {
						display: flex;
						flex-direction: column;
						align-items: center;
						>image {
							width: 106px;
							height: 129px
						};
						>text {
							font-size: 18px;
							color: #101010;
							&:nth-of-type(1) {
								margin: 10px 0;
							}
						}
					};
					.support-staff-bottom {
						display: flex;
						margin-top: 20px;
						.support-staff-left {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 24px;
								height: 24px;
								margin-bottom: 6px
							};
							uni-button {
								height: 20px;
								line-height: 20px;
								background: #fff;
								image {
								  width: 24px;
									height: 24px
								}
							};
							uni-button:after {
								border: none
							};
							button {
								height: 20px;
								line-height: 20px;
								background: #fff;
								font-size: 14px;
								color: #4E9FD5;
							};
							button:after {
								border: none
							}
						};
						.support-staff-right {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 24px;
								height: 24px;
								margin-bottom: 6px
							};
							>text {
								font-size: 14px;
								color: #4E9FD5
							}
						}
					}
				}
			}
		};
		.top-area {
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			box-sizing: border-box;
			width: 100%;
			margin: 80px 0 10px 0;
			.top-area-left {
				flex: 1;
				::v-deep .u-search {
					.u-content {
						height: 35px !important
					}
				}
			};
			.top-area-right {
				width: 22%;
				text-align: right;
				>image {
					width: 24px;
					height: 24px;
					vertical-align: middle;
					&:nth-child(1) {
						margin-right: 14px
					}
				}
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.banner-area-box {
			padding: 0 10px 10px 10px;
			min-height: 135px;
			box-sizing: border-box
		};
		.center-area {
			flex: 1;
			overflow: auto;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.nurse-type {
				height: 90px;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.nurse-type-list {
					flex: 1;
					width: 100%;
					height: 73px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					>image {
						width: 45px;
						height: 45px
					};
					>text {
						@include no-wrap;
						width: 90px;
						text-align: center;
						display: inline-block;
						font-weight: 400;
						font-size: 14px;
						color: #000000
					}
				}
			};
			.latest-news {
				display: flex;
				margin-top: 10px;
				align-items: center;
				justify-content: space-between;
				height: 63px;
				width: 100%;
				padding: 0 0 0 10px;
				background: #fff;
				box-sizing: border-box;
				.latest-news-left {
					margin-right: 20px;
					>image {
						width: 36px;
						height: 52px;
						vertical-align: middle;
					}
				};
				.latest-news-right {
					flex: 1;
					padding-right: 10px;
					height: 52px;
					box-sizing: border-box;
					@include no-wrap;
					.new-content-list {
						@include no-wrap;
						width: 100%;
						font-size: 12px;
						color: #2C2C2C;
						&:first-child {
							margin-top: 2px;
						}
						&:last-child {
							margin-top: 10px
						}
					}
				}
			};
			.recommend-service {
				width: 100%;
				margin: 0 auto;
				margin-top: 15px;
				padding: 0 10px 0 10px;
				box-sizing: border-box;
				.service-title {
					display: flex;
					align-items: center;
					.service-title-left {
						font-size: 17px;
						color: #000000;
						font-weight: 500;
						margin-right: 10px
					};
					.service-title-right {
						font-size: 12px;
						color: #888888;
						margin-top: 4px;
					}
				};
				.service-list-box {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					margin-top: 15px;
					.service-list {
						margin-bottom: 10px;
						padding: 4px 4px 10px 4px;
						width: 48%;
						background: #fff;
						margin-right: 4%;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						align-items: center;
						&:nth-child(2n) {
							margin-right: 0 !important
						};
						.service-list-top {
							width: 100%;
							::v-deep .u-image {
								width: 100% !important;
								height: 157px !important;
								uni-image {
									width: 100% !important;
									height: 157px !important;
								}
							};
							::v-deep image {
								width: 100% !important;
								height: 157px !important;
							}
						};
						.service-list-bottom {
							margin-top: 10px;
							width: 100%;
							padding-left: 8px;
							box-sizing: border-box;
							.service-project {
								>text {
									display: inline-block;
									width: 100%;
									@include no-wrap;
									&:first-child {
										font-size: 13px;
										color: #333333;
										font-weight: 400;
									};
									&:last-child {
										font-size: 11px;
										color: #999999;
										font-weight: 400;
									}
								}
							};
							.service-price {
								>text {
									&:nth-child(1) {
										font-size: 12px;
										color: #F92C20;
										font-weight: 500;
									};
									&:nth-child(2) {
										font-size: 17px;
										color: #F92C20;
										font-weight: 500;
									}
								}
							}
						}
					}
				}
			};
			.recommend-nurse-practitioner {
				width: 100%;
				margin: 0 auto;
				margin-top: 5px;
				margin-bottom: 10px;
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				.nurse-practitioner-title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 15px;
					.nurse-practitioner-title-left {
						>text {
							font-size: 17px;
							color: #000000;
							font-weight: 500;
							margin-right: 10px
						}
					};
					.nurse-practitioner-title-right {
						display: flex;
						>text {
							font-size: 13px;
							color: #999999;
							font-weight: 400;
							margin-right: 4px
						}
					}
				};
				.nurse-practitioner-list {
					padding: 10px;
					box-sizing: border-box;
					margin-bottom: 14px;
					background: #fff;
					display: flex;
					justify-content: space-between;
					.nurse-practitioner-list-left {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-right: 10px;
						width: 100px;
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
							.rate-text {
								>text {
									font-size: 11px;
									font-weight: 400;
									&:nth-of-type(1) {
										margin-left: 4px;
										color: #999999;
										word-break: break-all;
									};
									&:nth-of-type(2) {
										color: #999999;
									}
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
									color: #F2A15F;
									font-weight: 400;
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
									color: #333333;
									font-weight: 400;
								}
							};
							.nurse-practitioner-performance {
								display: flex;
								margin-top: 4px;
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
											color: #333333;
										};
										&:nth-child(3) {
											color: #E81F50;
											margin: 0 4px;
										};
										&:nth-child(4) {
											color: #333333;
										}
									}
								};
								.nurse-practitioner-performance-left ::after {
									content: '';
									width: 1px;
									height: 14px;
									background: #333333;
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
											color: #333333;
										};
										&:nth-child(2) {
											margin: 0 4px;
											color: #E81F50;
										};
										&:nth-child(3) {
											color: #333333
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
								font-weight: 600;
								&:nth-child(1) {
									margin-right: 6px
								}
							}
						}
					}
				}
			}
		}
	}
</style>



