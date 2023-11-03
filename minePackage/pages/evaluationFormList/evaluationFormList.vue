<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="初步评估单管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="evaluation-form-box">
			<!-- <view class="image-box">
				<image :src="noProtectedPersonsPng"></image>
			</view> -->
			<u-index-list :index-list="indexList">
					<template v-for="(item, index) in itemArr">
						<!-- #ifdef APP-NVUE -->
						<u-index-anchor :text="indexList[index]"></u-index-anchor>
						<!-- #endif -->
						<u-index-item>
							<!-- #ifndef APP-NVUE -->
							<u-index-anchor :text="indexList[index]"></u-index-anchor>
							<!-- #endif -->
							<view class="list-cell" v-for="(cell, index) in item">
								{{cell}}
							</view>
						</u-index-item>
					</template>
			</u-index-list>
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
				infoText: '加载中',
				indexList: ["A", "B", "C"],
				itemArr: [
					['列表A1','列表A2','列表A3'],
					['列表B1','列表B2','列表B3'],
					['列表C1','列表C2','列表C3']
				]
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
					url: '/minePackage/pages/mine/index/index'
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
				background: #F8F8F8;
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
		.evaluation-form-box {
			flex: 1;
			overflow: auto;
			padding: 10px 6px;
			box-sizing: border-box;
			.image-box {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				>image {
					width: 334px;
					height: 334px
				}
			};
			.list-cell {
				display: flex;
				box-sizing: border-box;
				width: 100%;
				padding: 10px 24rpx;
				overflow: hidden;
				color: #323233;
				font-size: 14px;
				line-height: 24px;
				background-color: #fff;
			}
		}
	}
</style>
