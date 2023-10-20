<template>
	<view class="content-box">
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单修改" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-list-wrapper">
		</view>
		<view class="submit-area">
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
				uni.switchTab({
					url: '/pages/orderForm/orderForm'
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
		::v-deep .u-popup {
			flex: none !important
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
		.order-form-list-wrapper {
			flex: 1;
			background: #F8F8F8;
			overflow: auto;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		};
		.submit-area {
			background: #F8F8F8;
			width: 100%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
