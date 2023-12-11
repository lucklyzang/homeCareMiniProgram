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
						<text>{{ nurseTitleTransition(nurseMessage.title) }}</text>
					</view>
					<view>
						<text>{{ nurseMessage.organization }}</text>
					</view>
				</view>
				<view class="rate-box" v-if="isVerifyNurseFavoriteComplete">
					<u-icon v-if="!isNurseFavorite" name="star" color="#fff" size="22" @click="collectNurseEvent"></u-icon>
					<u-icon v-else name="star-fill" color="#E8CB51" size="22" @click="collectNurseEvent"></u-icon>
				</view>
			</view>
			<view class="center-area-box">
				<view class="center-area-top">
					<view>
						<view>
							<image :src="serviceQuantityIconPng"></image>
						</view>
						<view>
							<text>{{ nurseMessage.quantity }}</text>
							<text>服务量(人)</text>
						</view>
					</view>
					<view>
						<view>
							<image :src="serviceHourIconPng"></image>
						</view>
						<view>
							<text>{{ (nurseMessage.timeLength/60).toFixed(2) }}</text>
							<text>服务时长(h)</text>
						</view>
					</view>
					<view>
						<view>
							<image :src="collectQuantityIconPng"></image>
						</view>
						<view>
							<text>{{ transitionCollectQuantity(nurseMessage.quantity) }}</text>
							<text>收藏量</text>
						</view>
					</view>
				</view>
				<view class="center-area-bottom">
					{{ nurseMessage.introduction }}
				</view>
			</view>
		</view>
		<view class="bottom-area-box">
			<view class="service-project">
				<view class="title-area">
					<text>服务项目</text>
				</view>
				<view class="service-list-area">
					<view class="service-list">
						<u-image width="60" height="60" :src="defaultPersonPhotoIconPng"></u-image>
						<text>婴儿黄疸检测</text>
					</view>
					<view class="service-list">
						<u-image width="60" height="60" :src="defaultPersonPhotoIconPng"></u-image>
						<text>婴儿黄疸检测</text>
					</view>
					<view class="service-list">
						<u-image width="60" height="60" :src="defaultPersonPhotoIconPng"></u-image>
						<text>婴儿黄疸检测</text>
					</view>
					<view class="service-list">
						<u-image width="60" height="60" :src="defaultPersonPhotoIconPng"></u-image>
						<text>婴儿黄疸检测</text>
					</view>
				</view>
			</view>
			<view class="user-evaluate">
				<view class="title-area">
					<view class="title-left">
						<text>用户评价</text>
					</view>
					<view class="title-right" @click="viewMoreUserEvaluateEvent">
						<text>查看更多</text>
						<u-icon name="arrow-right" color="#3B9DF9"></u-icon>
					</view>
				</view>
				<view class="evaluate-list-area">
					<view class="user-evaluate-list">
						<view class="user-evaluate-list-left">
							<view>
								<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
							</view>
							<view>
								<text>护师非常的负责</text>
							</view>
							<view>
								<text>王先生</text>
								<text>互联网预约</text>
							</view>
						</view>
						<view class="user-evaluate-list-right">
							<text>黄疸检测</text>
							<text>2023-02-12</text>
						</view>
					</view>
					<view class="user-evaluate-list">
						<view class="user-evaluate-list-left">
							<view>
								<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
							</view>
							<view>
								<text>护师非常的负责</text>
							</view>
							<view>
								<text>王先生</text>
								<text>互联网预约</text>
							</view>
						</view>
						<view class="user-evaluate-list-right">
							<text>黄疸检测</text>
							<text>2023-02-12</text>
						</view>
					</view>
					<view class="user-evaluate-list">
						<view class="user-evaluate-list-left">
							<view>
								<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
							</view>
							<view>
								<text>护师非常的负责</text>
							</view>
							<view>
								<text>王先生</text>
								<text>互联网预约</text>
							</view>
						</view>
						<view class="user-evaluate-list-right">
							<text>黄疸检测</text>
							<text>2023-02-12</text>
						</view>
					</view>
					<view class="user-evaluate-list">
						<view class="user-evaluate-list-left">
							<view>
								<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
							</view>
							<view>
								<text>护师非常的负责</text>
							</view>
							<view>
								<text>王先生</text>
								<text>互联网预约</text>
							</view>
						</view>
						<view class="user-evaluate-list-right">
							<text>黄疸检测</text>
							<text>2023-02-12</text>
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
	import { createNurseFavorite, verifyNurseFavorite, deleteNurseFavorite } from '@/api/user.js'
	import {} from '@/api/user.js'
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
				count: 5,
				value: 2,
				nurseMessage: {},
				showLoadingHint: false,
				infoText: '',
				isShowSureChooseBtn: false,
				deviceNumber: 0,
				isVerifyNurseFavoriteComplete: false,
				isNurseFavorite: false,
				personPhotoSource: ''
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo',
				'nurseRankDictData'
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
			this.verifyNurseFavoriteEvent({careId: this.nurseMessage.id });
			console.log('护师信息',temporaryAddress);
		},
			
		methods: {
			...mapMutations([
				'changeUserBasicInfo',
				'changeEnterFamilyManagementPageSource'
			]),
			
			// 查看更多用户评价事件
			viewMoreUserEvaluateEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/moreUseEvaluate/moreUseEvaluate'
				})
			},
			
			// 收藏量转换
			transitionCollectQuantity (value) {
				if (value <= 0) {
					return 0
				} else {
					return `${value/1000}千`
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
			
			// 校验医护是否收藏
			verifyNurseFavoriteEvent(data) {
				this.isVerifyNurseFavoriteComplete = false;
				verifyNurseFavorite(data).then((res) => {
					this.isVerifyNurseFavoriteComplete = true;
					if ( res && res.data.code == 0) {
						this.isNurseFavorite = res.data.data
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
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
						this.isNurseFavorite = true
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							position: 'bottom'
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
			
			// 删除医护收藏
			deleteNurseFavoriteEvent() {
				this.showLoadingHint = true;
				this.infoText = '取消收藏中···';
				deleteNurseFavorite({careId: this.nurseMessage.id }).then((res) => {
					if ( res && res.data.code == 0) {
						this.isNurseFavorite = false
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							position: 'bottom'
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
			
			// 收藏/取消收藏医护事件
			collectNurseEvent () {
				if (this.isNurseFavorite) {
					this.deleteNurseFavoriteEvent()
				} else {
					this.createNurseFavoriteEvent()
				}
			},
			
			// 选定护士事件
			designateNurseEvent () {
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
			height: 330px;
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
					width: 76px;
					height: 76px;
					background: #fff;
					margin-right: 15px;
					border-radius: 50%;
					z-index:1;
					image {
						width: 76px;
						height: 76px;
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
							&:nth-child(1) {
								font-size: 18px;
								margin-right: 6px;
							};
							&:nth-child(2) {
								font-size: 14px;
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
							color: #F6F8FF;
							font-size: 12px;
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
				height: 137px;
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
								align-items: center;
								margin-right: 6px;
								>image {
									width: 22px;
									height: 22px;
									vertical-align: middle
								}
							};
							&:nth-child(2) {
								display: flex;
								flex-direction: column;
								>text {
									font-size: 10px;
									color: rgba(137, 140, 140, 0.61);
									&:nth-child(1) {
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
					font-size: 12px;
					color: rgba(137, 140, 140, 1);
					line-height: 20px
				}
			}
		};
		.bottom-area-box {
			width: 96%;
			margin: 0 auto;
			flex: 1;
			overflow: auto;
			.service-project {
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				border-radius: 8px;
				box-shadow: 0px 2px 6px 0 rgba(202, 200, 200, 0.4);
				.title-area {
					height: 50px;
					line-height: 50px;
					@include bottom-border-1px(#DEDEDE);
					padding: 0 10px;
					box-sizing: border-box;
					>text {
						font-size: 16px;
						color: #101010
					}
				};
				.service-list-area {
					display: flex;
					flex-wrap: wrap;
					.service-list {
            width: 33.3%;
						display: flex;
						padding: 10px 0;
						flex-direction: column;
						align-items: center;
						>text {
							margin-top: 6px;
							font-size: 12px;
							color: #101010
						}
					}
				}
			};
			.user-evaluate {
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				margin-top: 10px;
				border-radius: 8px;
				box-shadow: 0px 2px 6px 0 rgba(202, 200, 200, 0.4);
				.title-area {
					height: 50px;
					@include bottom-border-1px(#DEDEDE);
					padding: 0 10px;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title-left {
						>text {
							font-size: 16px;
							color: #101010
						}
					};
					.title-right {
						display: flex;
						>text {
							font-size: 12px;
							color: #3B9DF9
						}
					}
				};
				.evaluate-list-area {
					max-height: 400px;
					overflow: auto;
					padding: 0 10px;
					box-sizing: border-box;
					.user-evaluate-list {
						display: flex;
						justify-content: space-between;
						padding: 10px 0;
						box-sizing: border-box;
						@include bottom-border-1px(#E5EBFF);
						.user-evaluate-list-left {
							flex: 1;
							>view {
								&:nth-child(2) {
									margin: 4px 0;
									>text {
										font-size: 14px;
										color: #101010;
										word-break: break-all
									}
								};
								&:nth-child(3) {
									>text {
										font-size: 12px;
										color: #BBBBBB;
										word-break: break-all;
										&:nth-child(1) {
											margin-right: 4px
										}
									}
								}
							}
						};
						.user-evaluate-list-right {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							align-items: flex-end;
							>text {
								&:nth-child(1) {
									font-size: 12px;
									color: #FF698C;
								};
								&:nth-child(2) {
									font-size: 12px;
									color: #BBBBBB;
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
