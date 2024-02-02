<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="相关协议" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="agreement-image-area">
			<image :src="aboutAgreementPng"></image>
		</view>
		<view class="agreement-content">
			<view class="agreement-title">
				<text>隐私协议</text>
			</view>
			<view class="agreement-message">
				<view>
					一、简介
				</view>
				<view>
					这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议  这里是隐私协议
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
				aboutAgreementPng: require("@/static/img/about-agreement.png"),
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
		background: #fff;
		overflow: auto;
		padding-bottom: 20px;
		box-sizing: border-box;
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
		.agreement-image-area {
			width: 100%;
			height: 120px;
			display: flex;
			justify-content: center;
			align-items: center;
			>image {
				width: 90px;
				height: 90px
			}
		};
		.agreement-content {
			flex: 1;
			overflow: auto;
			width: 92%;
			margin: 0 auto;
			padding: 20px;
			box-sizing: border-box;
			box-shadow: 0px 1px 4px 0px rgba(137, 140, 140, 0.24);
			.agreement-title {
				font-size: 16px;
				color: #101010;
				text-align: center;
				font-weight: 500;
			};
			.agreement-message {
				font-size: 14px;
				color: #101010;
				text-align: justify;
				font-weight: 400;
				>view {
					&:nth-child(1) {
						margin-bottom: 4px;
					};
					&:nth-child(2) {
						text-indent: 28px;
					}
				}
			}
		}
	}
</style>
