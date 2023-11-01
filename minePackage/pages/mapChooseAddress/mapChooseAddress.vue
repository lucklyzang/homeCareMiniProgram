<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="地址管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="address-content">
			<view class="operation-area">
				<view class="operation-top">
					<text>取消</text>
					<text>确定</text>
				</view>
				<view class="operation-bottom">
					<u-search shape="square" :showAction="false" placeholder="搜索地点" v-model="searchValue"></u-search>
				</view>
			</view>
			<view class="map-area"></view>
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
				addressBlackIconPng: require("@/static/img/address-black-icon.png"),
				infoText: '加载中',
				searchValue: ''
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
				uni.redirectTo({
					url: '/minePackage/pages/addAddress/addAddress'
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
		background: #fff;
		.top-area-box {
			position: relative;
			background: #F8F8F8;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #f5f5f5;
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
		.address-content {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			.operation-area {
				background: #fff;
				padding: 20px 10px 10px 10px;
				box-sizing: border-box;
				.operation-top {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
					>text {
						font-size: 16px;
						color: #333
					}
				}
			};
			.map-area {
				flex: 1;
			}
		}
	}
</style>
