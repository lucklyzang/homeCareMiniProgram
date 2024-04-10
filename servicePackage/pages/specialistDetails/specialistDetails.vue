<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="专家详情">
					<template #left>
						<u-icon name="arrow-left" color="#fff" size="22" @click="backTo"></u-icon>
					</template>
				</nav-bar> 
			</view>
			<image :src="loginBackgroundPng"></image>
			<view class="user-info">
				<view class="user-photo">
					<image :src="!nurseMessage.avatar ? defaultNurseAvatar : nurseMessage.avatar"></image>
				</view>
				<view class="user-nickname">
					<view>
						<text>{{ nurseMessage.name }}</text>
						<text v-if="nurseMessage.hasOwnProperty('title')">{{ nurseTitleTransition(nurseMessage.title) }}</text>
					</view>
					<view>
						<text>{{ nurseMessage.organization }}</text>
					</view>
				</view>
				<view class="rate-box" v-if="isVerifyNurseFavoriteComplete">
					<u-icon v-if="!isNurseFavorite" name="star" color="#fff" size="22" @click="collectNurseEvent"></u-icon>
					<u-icon v-else name="star-fill" color="#F9B128" size="22" @click="collectNurseEvent"></u-icon>
				</view>
			</view>
			<view class="center-area-box">
				<view class="center-area-top">
					<view>
						<view>
							<image :src="serviceQuantityIconPng"></image>
						</view>
						<view>
							<text v-if="nurseMessage.hasOwnProperty('quantity')">{{ nurseMessage.quantity }}</text>
							<text>服务量(人)</text>
						</view>
					</view>
					<view>
						<view>
							<image :src="serviceHourIconPng"></image>
						</view>
						<view>
							<text v-if="nurseMessage.hasOwnProperty('timeLength')">{{ (nurseMessage.timeLength/60).toFixed(2) }}</text>
							<text>服务时长(h)</text>
						</view>
					</view>
					<view>
						<view>
							<image :src="collectQuantityIconPng"></image>
						</view>
						<view>
							<text v-if="nurseMessage.hasOwnProperty('collect')">{{ transitionCollectQuantity(nurseMessage.collect) }}</text>
							<text>收藏量</text>
						</view>
					</view>
				</view>
				<view class="center-area-bottom">
					{{ !nurseMessage.introduction ? '暂无介绍' : nurseMessage.introduction }}
				</view>
			</view>
		</view>
		<view class="bottom-area-box">
			<view class="title-area">
				<text>服务项目</text>
			</view>
			<view class="service-project">
				<view class="service-list-area">
					<u-empty text="暂无服务" v-if="isShowNoServiceData"></u-empty>
					<scroll-view class="scroll-view" enable-flex scroll-y="true"  @scrolltolower="scrolltolower">
						<view class="service-list" v-for="(item,index) in fullServiceCategoryDetailsList" :key="index" @click="enterServiceDetailsEvent(item.id)">
							<u-image width="100" mode="widthFix" :src="item.picUrl">
								<template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
							</u-image>
							<text>{{ item.name }}</text>
						</view>
					</scroll-view>
					<u-loadmore :status="status" v-if="fullServiceCategoryDetailsList.length > 0" />
				</view>
			</view>
			<view class="user-evaluate">
				<view class="title-area">
					<view class="title-left">
						<text>用户评价</text>
					</view>
					<view class="title-right" @click="viewMoreUserEvaluateEvent">
						<text>查看更多</text>
					</view>
				</view>
				<view class="evaluate-list-area">
					<u-empty text="暂无评价" v-if="isShowNoCommentData"></u-empty>
					<view class="user-evaluate-list" v-for="(item,index) in commentList" :key="index">
						<view class="user-evaluate-list-top">
							<view>
								<text>{{ item.content }}</text>
							</view>
							<view>
								<view class="user-evaluate-name">
									<text>{{ !item.userNickname ? '匿名用户' :  item.userNickname }}</text>
									<text>互联网预约</text>
								</view>
								<view class="user-evaluate-date">
									<text>{{ getNowFormatDate(new Date(item.createTime),4) }}</text>
								</view>
							</view>
						</view>
						<view class="user-evaluate-list-bottom">
							<view>
								<u-rate :count="item.scores" activeColor="#F9B128" v-model="item.scores" readonly></u-rate>
							</view>
							<view>
								<text>{{ item.spuName }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="sure-choose-btn-box" v-if="isShowSureChooseBtn" @click="designateNurseEvent">
			<text>确定选择</text>
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { getNurseDetails, createNurseFavorite, verifyNurseFavorite, deleteNurseFavorite, getProductCommentList, getServiceProductCategoryDetails } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				loginBackgroundPng: require("@/static/img/login-background.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				serviceQuantityIconPng: require("@/static/img/service-quantity-icon.png"),
				serviceHourIconPng: require("@/static/img/service-hour-icon.png"),
				collectQuantityIconPng: require("@/static/img/collect-quantity-icon.png"),
				serviceCategoryDetailsList: [],
				fullServiceCategoryDetailsList: [],
				commentList: [],
				nurseMessage: {},
				currentPageNum: 1,
				pageSize: 6,
				totalCount: 0,
				status: 'nomore',
				showLoadingHint: false,
				infoText: '',
				isShowSureChooseBtn: false,
				isShowNoServiceData: false,
				isShowNoCommentData: false,
				deviceNumber: 0,
				isVerifyNurseFavoriteComplete: false,
				isNurseFavorite: false,
				personPhotoSource: '',
				isFromEditOrderPage: ''
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo',
				'nurseRankDictData',
				'serviceOrderFormSureChooseMessage',
				'editServiceOrderFormSureChooseMessage'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			},
			depName() {
			},
			accountName() {
			}
		},
		
		onShow() {
			let pages = getCurrentPages() // 获取栈实例
			let currentRoute = pages[pages.length-2].route;
			if (currentRoute == 'servicePackage/pages/chooseNurse/chooseNurse') {
				this.isShowSureChooseBtn = true
			}
		},
		
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryAddress = JSON.parse(options.transmitData);
			this.nurseMessage = temporaryAddress;
			this.isFromEditOrderPage = temporaryAddress['isFromEditOrderPage'];
			this.getNurseDetailsEvent({id:this.nurseMessage.id});
			this.verifyNurseFavoriteEvent({careId: this.nurseMessage.id });
			this.queryProductComment({
				count: 4,
				careId: this.nurseMessage.id
			})
		},
			
		methods: {
			...mapMutations([
				'storeServiceOrderFormSureChooseMessage',
				'storeEditServiceOrderFormSureChooseMessage'
			]),
			
			// 查看更多用户评价事件
			viewMoreUserEvaluateEvent () {
				let mynavData = JSON.stringify(this.nurseMessage);
				uni.navigateTo({
					url: '/servicePackage/pages/moreUseEvaluate/moreUseEvaluate?transmitData='+mynavData
				})
			},
			
			// 收藏量转换
			transitionCollectQuantity (value) {
				if (value <= 0) {
					return 0
				} else {
					if (value < 1000) {
						return value
					} else {
						if (value < 10000) {
							return `${value/1000}K`
						} else {
							return `${value/10000}W`
						}
					}
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
			
			// 获取医护详情
			getNurseDetailsEvent(data) {
				this.showLoadingHint = true;
				this.infoText = '加载中···';
				getNurseDetails(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.nurseMessage = res.data.data;
						this.nurseMessage['rateValue'] = res.data.data.commentScore == 0 ? 0 : Math.floor(res.data.data.commentScore/res.data.data.commentCount) > 5 ? 5 : Math.floor(res.data.data.commentScore/res.data.data.commentCount);
						this.queryServiceProductCategoryDetails({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							aptitudes: !this.nurseMessage.aptitudes ? [] : this.nurseMessage.aptitudes
						},true);
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
			
			// 校验医护是否收藏
			verifyNurseFavoriteEvent(data) {
				this.isVerifyNurseFavoriteComplete = false;
				verifyNurseFavorite(data).then((res) => {
					this.isVerifyNurseFavoriteComplete = true;
					if ( res && res.data.code == 0) {
						this.isNurseFavorite = res.data.data
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 创建医护收藏
			createNurseFavoriteEvent() {
				this.showLoadingHint = true;
				this.infoText = '收藏中···';
				createNurseFavorite(this.nurseMessage.id).then((res) => {
					if ( res && res.data.code == 0) {
						this.isNurseFavorite = true;
						this.nurseMessage.collect++;
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
			
			// 删除医护收藏
			deleteNurseFavoriteEvent() {
				this.showLoadingHint = true;
				this.infoText = '取消收藏中···';
				deleteNurseFavorite({careId: this.nurseMessage.id }).then((res) => {
					if ( res && res.data.code == 0) {
						this.isNurseFavorite = false;
						if (this.nurseMessage.collect <= 0) {
							this.nurseMessage.collect = 0
						} else {
							this.nurseMessage.collect = this.nurseMessage.collect - 1
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
			},
			
			// 收藏/取消收藏医护事件
			collectNurseEvent () {
				if (this.isNurseFavorite) {
					this.deleteNurseFavoriteEvent()
				} else {
					this.createNurseFavoriteEvent()
				}
			},
			
			// 查询护师评价
			queryProductComment(data) {
				this.commentList = [];
				this.isShowNoCommentData = false;
				this.showLoadingHint = true;
				getProductCommentList(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.commentList = res.data.data;
						if (res.data.data.length == 0) {
							this.isShowNoCommentData = true;
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
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryServiceProductCategoryDetails({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						aptitudes: !this.nurseMessage.aptitudes ? [] : this.nurseMessage.aptitudes
					},false)
				}
			},
			
			// 查询服务分类明细
			queryServiceProductCategoryDetails(data,flag) {
				this.isShowNoServiceData = false;
				this.serviceCategoryDetailsList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getServiceProductCategoryDetails(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.serviceCategoryDetailsList = res.data.data.list;
						this.fullServiceCategoryDetailsList = this.fullServiceCategoryDetailsList.concat(this.serviceCategoryDetailsList);
						if (this.fullServiceCategoryDetailsList.length == 0) {
							this.isShowNoServiceData = true
						} else {
							this.isShowNoServiceData = false
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false;
					} else {
						let totalPage = Math.ceil(this.totalCount/this.pageSize);
						if (this.currentPage >= totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore';
						}	
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false;
					} else {
						this.status = 'loadmore'
					};
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent (item) {
				// 传递服务地址信息
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index?transmitData='+item
				})
			},
			
			// 选定护士事件
			designateNurseEvent () {
				if (this.isFromEditOrderPage) {
					let tmporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
					tmporaryEditServiceOrderFormSureChooseMessage['chooseNurseMessage'] = this.nurseMessage;
					this.storeEditServiceOrderFormSureChooseMessage(tmporaryEditServiceOrderFormSureChooseMessage);
				} else {
					let tmporaryServiceOrderFormSureChooseMessage = this.serviceOrderFormSureChooseMessage;
					tmporaryServiceOrderFormSureChooseMessage['chooseNurseMessage'] = this.nurseMessage;
					this.storeServiceOrderFormSureChooseMessage(tmporaryServiceOrderFormSureChooseMessage)
				};
				uni.navigateBack({
					delta: 2
				})
			},
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
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
		background: #f5f5f5;
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
		.top-area-box {
			position: relative;
			width: 100%;
			height: 343px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				.header_left_box {
					.u-icon {
						margin-left: 4px
					}
				};
				.header_title_center {
					color: #fff !important;
					text {
						color: #fff !important;
					}
				}
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 230px
			};
			.user-info {
				width: 100%;
				height: 230px;
				display: flex;
				align-items: center;
				color: #fff;
				font-size: 20px;
				padding-left: 10px;
				box-sizing: border-box;
				>view {
					margin-top: 20px;
				};
				.user-photo {
					width: 70px;
					height: 70px;
					background: #fff;
					margin-right: 15px;
					border-radius: 50%;
					z-index:1;
					image {
						width: 70px;
						height: 70px;
						border-radius: 50%;
					}
				}
			};
			.user-nickname {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				padding-right: 10px;
				box-sizing: border-box;
				z-index: 1;
				@include no-wrap;
				>view {
					&:nth-child(1) {
						>text {
							color: #F6F8FF;
							display: inline-block;
							&:nth-child(1) {
								font-size: 16px;
								font-weight: 400;
								margin-right: 10px;
							};
							&:nth-child(2) {
								display: inline-block;
								height: 20px;
								line-height: 20px;
								padding: 0 6px;
								box-sizing: border-box;
								background: #FFFFFF;
								box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.05);
								border-radius: 3px;
								font-size: 12px;
								color: #F2A15F;
								font-weight: 500;
							}
						}
					};
					&:nth-child(2) {
						@include no-wrap;
						margin-top: 6px;
						>text {
							display: inline-block;
							width: 100%;
							@include no-wrap;
							font-size: 12px;
							color: #FFFFFF;
							opacity: 0.8;
							font-weight: 400;
						}
					}
				}
			};
			.rate-box {
				width: 50px;
			};
			.center-area-box {
				width: 96%;
				z-index: 100;
				position: absolute;
				left: 2%;
				top: 180px;
				height: 150px;
				background: #fff;
				margin: 0 auto;
				padding: 20px;
				box-sizing: border-box;
				border-radius: 10px;
				box-shadow: 0px 2px 6px 0 rgba(92, 133, 136, 0.29);
				display: flex;
				flex-direction: column;
				.center-area-top {
					display: flex;
					>view {
						flex: 1;
						display: flex;
						&:nth-child(2) {
							justify-content: center
						};
						&:nth-child(3) {
							justify-content: center
						};
						>view {
							&:nth-child(1) {
								display: flex;
								padding-top: 3px;
								box-sizing: border-box;
								margin-right: 6px;
								>image {
									width: 15px;
									height: 15px;
									vertical-align: middle
								}
							};
							&:nth-child(2) {
								display: flex;
								flex-direction: column;
								>text {
									font-size: 13px;
									color: #999999;
									font-weight: 400;
									&:nth-child(1) {
										font-size: 16px;
										color: #000000;
										font-weight: 400;
										margin-bottom: 3px
									}
								}
							}
						}
					}
				};
				.center-area-bottom {
					flex: 1;
					overflow: auto;
					margin-top: 10px;
					line-height: 20px;
					padding: 8px 10px;
					box-sizing: border-box;
					font-size: 14px;
					background: #FAFAFA;
					color: #666666;
					font-weight: 400;
				}
			}
		};
		.bottom-area-box {
			width: 96%;
			margin: 0 auto;
			flex: 1;
			overflow: auto;
			.title-area {
				height: 50px;
				line-height: 50px;
				margin-top: -10px;
				>text {
					font-size: 17px;
					color: #000000;
					font-weight: 500;
				}
			};
			.service-project {
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				border-radius: 8px;
				box-shadow: 0px 2px 6px 0 rgba(202, 200, 200, 0.4);
				.service-list-area {
					max-height: 240px;
					overflow: auto;
					.scroll-view {
						height: 100%
					};
					::v-deep .scroll-view {
						display: flex;
						flex-wrap: wrap;
						position: relative;
						.u-empty {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%,-50%)
						};
						.service-list {
							width: 32%;
							display: flex;
							padding: 10px 0;
							box-sizing: border-box;
							flex-direction: column;
							align-items: center;
							margin-right: 2%;
							margin-bottom: 10px;
							>text {
								margin-top: 8px;
								font-size: 13px;
								color: #333333;
								font-weight: 400;
							};
							.u-image {
								height: auto !important
							}
						};
						.service-list {
							&:nth-child(3n) {
								margin-right: 0 !important
							}
						}	
					};	
					::v-deep .uni-scroll-view-content {
						display: flex;
						flex-wrap: wrap;
						position: relative;
						.u-empty {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%,-50%)
						};
						.service-list {
							width: 32%;
							display: flex;
							padding: 10px 0;
							box-sizing: border-box;
							flex-direction: column;
							align-items: center;
							margin-right: 2%;
							margin-bottom: 10px;
							>text {
								margin-top: 8px;
								font-size: 13px;
								color: #333;
								font-weight: 400;
							};
							.u-image {
								height: auto !important
							}
						};
						.service-list {
							&:nth-child(3n) {
								margin-right: 0 !important
							}
						}	
					}	
				}
			};
			.user-evaluate {
				margin-top: 10px;
				border-radius: 8px;
				box-shadow: 0px 2px 6px 0 rgba(202, 200, 200, 0.4);
				.title-area {
					height: 50px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title-left {
						>text {
							font-size: 17px;
							color: #000000;
							font-weight: 500;
							margin-right: 10px;
						}
					};
					.title-right {
						display: flex;
						>text {
							font-size: 13px;
							color: #999999;
							font-weight: 400;
							margin-right: 4px
						}
					}
				};
				.evaluate-list-area {
					max-height: 400px;
					min-height: 120px;
					padding-bottom: 10px;
					box-sizing: border-box;
					background: #fff;
					overflow: auto;
					position: relative;
					::v-deep .u-empty {
					 	position: absolute;
					 	top: 50%;
					 	left: 50%;
					 	transform: translate(-50%,-50%)
					};
					.user-evaluate-list {
						padding: 14px 14px 0 14px;
						box-sizing: border-box;
						@include bottom-border-1px(#b8b8b8);
						.user-evaluate-list-top {
							padding: 8px;
							box-sizing: border-box;
							background: #fbfbfb;
							>view {
								&:nth-child(1) {
									font-size: 15px;
									color: #333333;
									font-weight: 400;
									word-break: break-all;
								};
								&:nth-child(2) {
									margin: 4px 0;
									display: flex;
									justify-content: space-between;
									align-items: center;
									.user-evaluate-name {
										display: flex;
										align-items: center;
										flex: 1;
										padding-right: 10px;
										box-sizing: border-box;
										>text {
											display: inline-block;
											font-size: 11px;
											color: #999999;
											font-weight: 400;
											&:nth-child(1) {
												max-width: 140px;
												@include no-wrap;
												padding-right: 8px;
												box-sizing: border-box;
											};
											&:nth-child(2) {
												width: 60px;
											}
										}
									};
									.user-evaluate-date {
										>text {
											display: inline-block;
											font-size: 11px;
											color: #999999;
											font-weight: 400;
										}	
									}
								}
							}
						};
						.user-evaluate-list-bottom {
							height: 40px;
							display: flex;
							justify-content: space-between;
							align-items: center;
							>view {
								&:nth-child(1) {
									flex: 1
								};
								&:nth-child(2) {
									>text {
										font-size: 11px;
										font-weight: 600;
										color: #fff;
										display: inline-block;
										padding: 3px 6px;
										box-sizing: border-box;
										background: #FEB8B7;
										border-radius: 3px;
									}
								}
							}
						}
					}
				}
			}
		};
		.sure-choose-btn-box {
			 width: 70%;
			 margin: 0 auto;
			 padding: 10px 0;
			 box-sizing: border-box;
			 display: flex;
			 align-items: center;
			 justify-content: center;
			 >text {
				 width: 100%;
				 border-radius: 20px;
				 background: #FC4278;
				 display: inline-block;
				 text-align: center;
				 line-height: 40px;
				 height: 40px;
				 font-size: 12px;
				 color: #fff
			 }
		}
	}
</style>
