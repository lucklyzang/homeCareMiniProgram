<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
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
					<image :src="defaultPersonPhotoIconPng"></image>
				</view>
				<view class="user-nickname">
					<view>
						<text>六年龙</text>
						<text>主任护师</text>
					</view>
					<view>
						<text>成都妇女儿童医院机构</text>
					</view>
				</view>
				<view class="rate-box">
					<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
				</view>
			</view>
			<view class="center-area-box">
				<view class="center-area-top">
					<view>
						<view>
							<image :src="serviceQuantityIconPng"></image>
						</view>
						<view>
							<text>2312</text>
							<text>服务量(人)</text>
						</view>
					</view>
					<view>
						<view>
							<image :src="serviceHourIconPng"></image>
						</view>
						<view>
							<text>542</text>
							<text>服务时长(h)</text>
						</view>
					</view>
					<view>
						<view>
							<image :src="collectQuantityIconPng"></image>
						</view>
						<view>
							<text>32k</text>
							<text>收藏量</text>
						</view>
					</view>
				</view>
				<view class="center-area-bottom">
					从事产科临床工作二十余年，母乳喂养咨询工作多年，有丰富的母婴护理及母乳喂养实践经验。对母乳喂养问题处理、哺乳期乳房问题、早产儿喂养等均有深入研究。
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import {} from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				serviceQuantityIconPng: require("@/static/img/service-quantity-icon.png"),
				serviceHourIconPng: require("@/static/img/service-hour-icon.png"),
				collectQuantityIconPng: require("@/static/img/collect-quantity-icon.png"),
				infoText: '',
				count: 1,
				value: 1,
				showLoadingHint: false,
				deviceNumber: 0,
				personPhotoSource: ''
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo'
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
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo',
				'changeEnterFamilyManagementPageSource'
			]),
			
			// 查看更多用户评价事件
			viewMoreUserEvaluateEvent () {
				uni.redirectTo({
					url: '/servicePackage/pages/moreUseEvaluate/moreUseEvaluate'
				})
			},
			
			// 顶部导航返回事件
			backTo () {
				uni.switchTab({
					url: '/pages/index/index'
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
		background: #f5f5f5;
		.top-area-box {
			position: relative;
			width: 100%;
			height: 340px;
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
			overflow: auto;
			.service-project {
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				margin-top: 10px;
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
		}
	}
</style>
