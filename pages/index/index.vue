<template>
	<view class="content-box">
		<u-toast ref="uToast" />
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
				<u-search placeholder="输入医院护士服务项目" bg-color="#fff" :show-action="false" v-model="searchValue"></u-search>
			</view>
			<view class="top-area-right">
				<image src="@/static/img/scan-icon.png"></image>
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
					<view class="new-content-list">
						空腹能不能吃汤圆？无糖汤圆不“胖人”吗？
					</view>
					<view class="new-content-list">
						空腹能不能吃汤圆？无糖汤圆不“胖人”吗？
					</view>
				</view>
			</view>
			<view class="recommend-service">
				<view class="service-title">
					<view class="service-title-left">推荐服务</view>
					<view class="service-title-right">我们的每一位护工都是经过严格培训!</view>
				</view>
				<view class="service-list" v-for="(item,index) in recommendProductList" @click="enterServiceDetailsEvent(item.id)">
					<view class="service-list-left">
						<u-image :src="item.picUrl" width="63" height="63">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="service-list-right">
						<view class="service-project">
							<text>{{ item.name }}</text>
							<text>内部专属护理,欢迎体验!</text>
						</view>
						<view class="service-price">
							<text>{{ `￥${item.price}起` }}</text>
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
						<u-icon name="arrow-right" color="#3B9DF9" size="18"></u-icon>
					</view>
				</view>
				<view class="nurse-practitioner-list" v-for="(item,index) in nurseList" @click="viewSpecialistDetailsEvent(item)">
					<view class="nurse-practitioner-list-left">
						<u-image :src="!item.avatar ? defaultNurseAvatar : item.avatar" width="63" height="63">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="nurse-practitioner-list-right">
						<view class="nurse-practitioner-name">
							<text>{{ item.name }}</text>
							<text>{{ item.title ? nurseTitleTransition(item.title) : '无' }}</text>
						</view>
						<view class="hospital-name">
							<text>{{ item.organization }}</text>
						</view>
						<view class="rate">
							<u-rate :count="!item.rateValue ? 5 : item.rateValue" readonly v-model="item.rateValue" :active-color="item.rateValue == 5 ? '#E86F50' : '#d6d6d6'"></u-rate>
							<text>{{ item.commentCount }}</text>
							<text>条评价</text>
						</view>
						<view class="nurse-practitioner-performance">
							<view class="nurse-practitioner-performance-left">
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
	import { getUserBannerList, getNurse, getHomeHotProduct, getHomeProductCategory } from '@/api/user.js'
	import { fenToYuan } from '@/common/js/utils'
	import _ from 'lodash'
	export default {
		components: {
		},
		data() {
			return {
				bannerList: [],
				showSupportStaffBox: false,
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				productTypeList: [],
				recommendProductList: [],
				nurseList: [],
				searchValue: '',
				showLoadingHint: false
			}
		},	
		onShow() {
			this.queryUserBannerList({position: 1});
			this.queryNurseList({
				pageNo: 1,
				pageSize: 3
			});
			this.queryHomeHotProduct({
				recommendType: 'hot',
				count: 3
			});
			this.queryHomeProductCategory()
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
			
			//客服弹框关闭事件
			closeSupportStaffBox () {
				this.showSupportStaffBox = false
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
					height: 73px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					>image {
						width: 46px;
						height: 46px
					};
					>text {
						font-size: 12px;
						color: #898C8C
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
				padding: 0 0 0 20px;
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
				width: 98%;
				margin: 0 auto;
				margin-top: 10px;
				border-radius: 7px;
				padding: 10px;
				box-sizing: border-box;
				background: #fff;
				box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.12);
				.service-title {
					display: flex;
					align-items: center;
					.service-title-left {
						font-size: 16px;
						color: #101010;
						font-weight: bold;
						margin-right: 10px
					};
					.service-title-right {
						font-size: 12px;
						color: #888888;
						margin-top: 4px;
					}
				};
				.service-list {
					margin-top: 10px;
					padding: 4px 8px;
					height: 75px;
					box-sizing: border-box;
					background: #F8F8F8;
					border-radius: 8px;
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.service-list-left {
						::v-deep .u-image {
							// width: 63px !important;
							// height: 63px !important
						}
					};
					.service-list-right {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-left: 10px;
						box-sizing: border-box;
						.service-project {
							display: flex;
							flex-direction: column;
							flex: 1;
							width: 0;
							>text {
								display: inline-block;
								width: 100%;
								@include no-wrap;
								&:first-child {
									font-size: 16px;
									color: #101010;
									font-weight: bold;
									margin-bottom: 12px
								};
								&:last-child {
									font-size: 12px;
									color: #888888
								}
							}
						};
						.service-price {
							>text {
								font-size: 16px;
								color: #E95E5E
							}
						}
					}
				}
			};
			.recommend-nurse-practitioner {
				width: 98%;
				margin: 0 auto;
				margin-top: 10px;
				margin-bottom: 10px;
				border-radius: 7px;
				padding: 10px;
				box-sizing: border-box;
				background: #fff;
				box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.12);
				.nurse-practitioner-title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.nurse-practitioner-title-left {
						>text {
							font-size: 16px;
							color: #101010;
							font-weight: bold;
							margin-right: 10px
						}
					};
					.nurse-practitioner-title-right {
						display: flex;
						>text {
							font-size: 12px;
							color: #3B9DF9;
							margin-right: 4px
						}
					}
				};
				.nurse-practitioner-list {
					margin-top: 20px;
					padding: 4px 8px;
					box-sizing: border-box;
					border-radius: 8px;
					margin-bottom: 20px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.nurse-practitioner-list-left {
						width: 73px;
						height: 73px;
						margin-right: 20px;
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
									color: #fff;
									display: inline-block;
									width: 67px;
									height: 22px;
									text-align: center;
									line-height: 22px;
									background: #F2A15F;
									border-radius: 3px;
								}
							}
						};
						.hospital-name {
							margin-top: 6px;
							>text {
								word-break: break-all;
								font-size: 12px;
								color: #898C8C;
							}
						};
						.rate {
							margin-top: 6px;
							display: flex;
							align-items: center;
							>text {
								font-size: 12px;
								&:nth-of-type(1) {
									margin-left: 6px;
									font-weight: bold;
									color: #101010;
								};
								&:nth-of-type(2) {
									color: rgba(16, 16, 16, 0.35);
								}
							};
							.textStyle {
								color: #d6d6d6 !important;
							}
						};
						.nurse-practitioner-performance {
							margin-top: 6px;
							display: flex;
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
						.good-territory {
							display: flex;
							margin-top: 6px;
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
						}
					}
				}
			}
		}
	}
</style>



