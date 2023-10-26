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
			</view>
		</view>
		<view class="bottom-area-box">
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
				width: 94%;
				position: absolute;
				left: 3%;
				top: 190px;
				height: 130px;
				background: #fff;
				margin: 0 auto;
				border-radius: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				box-shadow: 0px 2px 6px 0 rgba(92, 133, 136, 0.29)
			}
		};
		.bottom-area-box {
			width: 90%;
			margin: 0 auto;
			padding: 0 2px;
			box-sizing: border-box;
			margin-top: 6px;
			display: flex;
			flex-direction: column;
			overflow: auto
		}
	}
</style>
