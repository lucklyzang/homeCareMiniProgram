<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="用户评价" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="user-evaluate-box">
			<view class="user-evaluate-list">
				<view class="user-puoto">
					<u-image shape="circle" width="50" height="50" :src="jaundiceDetectionServicePng"></u-image>
				</view>
				<view class="user-evaluate-list-left">
					<view>
						<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
						<text>5.0</text>
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
				<view class="user-puoto">
					<u-image shape="circle" width="50" height="50" :src="jaundiceDetectionServicePng"></u-image>
				</view>
				<view class="user-evaluate-list-left">
					<view>
						<u-rate :count="count" activeColor="#FFA903" v-model="value" readonly></u-rate>
						<text>5.0</text>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				count: 1,
				value: 1,
				jaundiceDetectionServicePng: require("@/static/img/jaundice-detection-service.png"),
				infoText: '加载中'
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
		},
		methods: {
			...mapMutations([
			]),
			
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
		.top-area-box {
			position: relative;
			background: #fff;
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
		};
		.user-evaluate-box {
			flex: 1;
			width: 96%;
			margin: 0 auto;
			padding: 10px 10px 20px 10px;
			box-sizing: border-box;
			overflow: auto;
			.user-puoto {
				display: flex;
				align-items: center;
				margin-right: 10px;
			};
			.user-evaluate-list {
				display: flex;
				justify-content: space-between;
				padding: 10px 0;
				box-sizing: border-box;
				@include bottom-border-1px(#d9dbe3);
				.user-evaluate-list-left {
					flex: 1;
					>view {
						&:nth-child(1) {
							display: flex;
							>text {
								font-size: 12px;
								color: #FFA903;
								margin-left: 4px
							}
						};
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
</style>
