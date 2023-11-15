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
							<text>发送消息</text>
						</view>
						<view class="support-staff-right">
							<image src="@/static/img/phone.png"></image>
							<text>拨打电话</text>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area">
			<view class="top-area-left" @click="searchEvent">
				<u-search placeholder="输入医院护士服务项目" bg-color="#fff" :show-action="false" v-model="searchValue"></u-search>
			</view>
			<view class="top-area-right">
				<image src="@/static/img/scan-icon.png"></image>
				<image src="@/static/img/home-service-icon.png" @click="showSupportStaffBox = true"></image>
			</view>
		</view>
		<view class="banner-area-box">
			<u-swiper @click="swiperClickEvent" keyName="image"  indicator :list="bannerList"></u-swiper>
		</view>
		<view class="center-area">
			<view class="nurse-type">
				<view class="nurse-type-list" v-for="(item,index) in nurseList" :key="index" @click="enterServiceTypeEvent(item,index)">
					<image :src="item.icon"></image>
					<text>{{ item.text }}</text>
				</view>
			</view>
			<view class="latest-news">
				<view class="latest-news-left">
					<image src="@/static/img/latest-news.png" @click="enterMessageListEvent"></image>
				</view>
				<view class="latest-news-right">
					<view class="new-content-list">
						啥叫考虑到哈吉斯客户哈哈哈哈哈哈哈哈哈
					</view>
					<view class="new-content-list">
						活动就撒开好了哈哈哈哈哈好累好累好累好累好累好累
					</view>
				</view>
			</view>
			<view class="recommend-service">
				<view class="service-title">
					<view class="service-title-left">推荐服务</view>
					<view class="service-title-right">我们的每一位护工都是经过严格培训!</view>
				</view>
				<view class="service-list" @click="enterServiceDetailsEvent">
					<view class="service-list-left">
						<u-image src="@/static/img/health-nurse.png" width="63" height="63">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="service-list-right">
						<view class="service-project">
							<text>婴儿黄疸检测</text>
							<text>内部专属护理,欢迎体验!</text>
						</view>
						<view class="service-price">
							<text>￥150起</text>
						</view>
					</view>
				</view>
				<view class="service-list">
					<view class="service-list-left">
						<u-image src="@/static/img/health-nurse.png" width="63" height="63">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="service-list-right">
						<view class="service-project">
							<text>婴儿黄疸检测</text>
							<text>内部专属护理,欢迎体验!</text>
						</view>
						<view class="service-price">
							<text>￥150起</text>
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
				<view class="nurse-practitioner-list" @click="viewSpecialistDetailsEvent">
					<view class="nurse-practitioner-list-left">
						<u-image src="@/static/img/health-nurse.png" width="63" height="63">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="nurse-practitioner-list-right">
						<view class="nurse-practitioner-name">
							<text>张颖</text>
							<text>主管护师</text>
						</view>
						<view class="hospital-name">
							<text>成都市妇女儿童中心医院 (东城根)</text>
						</view>
						<view class="rate">
							<u-rate :count="count" v-model="value" active-color="#E86F50"></u-rate>
							<text>5624</text>
							<text>条评价</text>
						</view>
						<view class="nurse-practitioner-performance">
							<view class="nurse-practitioner-performance-left">
								<text>帮助</text>
								<text>3456</text>
								<text>人</text>
							</view>
							<view class="nurse-practitioner-performance-right">
								<text>服务</text>
								<text>345</text>
								<text>小时</text>
							</view>
						</view>
						<view class="good-territory">
							<text>乳腺疏通</text>
							<text>黄疸检测</text>
						</view>
					</view>
				</view>
				<view class="nurse-practitioner-list">
					<view class="nurse-practitioner-list-left">
						<u-image src="@/static/img/health-nurse.png" width="63" height="63">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="nurse-practitioner-list-right">
						<view class="nurse-practitioner-name">
							<text>张颖</text>
							<text>主管护师</text>
						</view>
						<view class="hospital-name">
							<text>成都市妇女儿童中心医院 (东城根)</text>
						</view>
						<view class="rate">
							<u-rate :count="count" v-model="value" active-color="#E86F50"></u-rate>
							<text>5624</text>
							<text>条评价</text>
						</view>
						<view class="nurse-practitioner-performance">
							<view class="nurse-practitioner-performance-left">
								<text>帮助</text>
								<text>3456</text>
								<text>人</text>
							</view>
							<view class="nurse-practitioner-performance-right">
								<text>服务</text>
								<text>345</text>
								<text>小时</text>
							</view>
						</view>
						<view class="good-territory">
							<text>乳腺疏通</text>
							<text>黄疸检测</text>
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
	import { getUserBannerList } from '@/api/user.js'
	import _ from 'lodash'
	export default {
		components: {
		},
		data() {
			return {
				infoText: '',
				count: 5,
				value: 2,
				bannerList: [],
				showSupportStaffBox: false,
				nurseList: [
					{
						text: '健康护理',
						icon: require("@/static/img/health-nurse.png")
					},
					{
						text: '妈妈护理',
						icon: require("@/static/img/mother-nurse.png")
					},
					{
						text: '宝宝护理',
						icon: require("@/static/img/baby-nurse.png")
					},
					{
						text: '慢病看护',
						icon: require("@/static/img/chronic-disease-nurse.png")
					}
				],
				searchValue: '',
				showLoadingHint: false,
				isShowHomeNoData: false
			}
		},	
		onShow() {
			this.queryUserBannerList()
		},
		onHide () {
		},
		destroyed () {
		},
		computed: {
			...mapGetters([
				'userInfo'
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
			]),
			
			//客服弹框关闭事件
			closeSupportStaffBox () {
				this.showSupportStaffBox = false
			},
			
			// 轮播图点击事件
			swiperClickEvent (index) {
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
				uni.switchTab({
					url: '/pages/service/service'
				})
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index'
				})
			},
			
			// 查看护师详情事件
			viewSpecialistDetailsEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/specialistDetails/specialistDetails'
				})
			},
			
			// 查看更多护师事件
			viewMoreSpecialistEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/moreSpecialist/moreSpecialist'
				})
			},
			
			// 获取首页banner列表
			queryUserBannerList () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.bannerList = [];
				getUserBannerList().then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.bannerList.push({
									image: item.picUrl,
									title: item.title
								})
							}
						}
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
							>text {
								font-size: 14px;
								color: #4E9FD5
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
					box-sizing: border-box;
					@include no-wrap;
					.new-content-list {
						@include no-wrap;
						width: 100%;
						font-size: 12px;
						color: #2C2C2C;
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



