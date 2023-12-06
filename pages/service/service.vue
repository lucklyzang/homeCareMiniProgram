<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="服务">
				</nav-bar> 
			</view>
			<view class="search-box">
				<u-search placeholder="搜索服务名称" height="30" shape="square" :action-style="{color: '#fff',fontSize: '16px'}" :clearabled="true" bg-color="#fff" v-model="searchValue"></u-search>
			</view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="content-area-box">
			<view class="content-left">
				<view class="service-list" v-for="(item,index) in serviceTypeList" :key="index" @click="serviceTypeClickEvent(item,index)">
					<text :class="{'selectServieTypeStyle': currentIndex === index }">{{ item }}</text>
				</view>
			</view>
			<view class="content-right">
				<view class="content-list" @click="enterServiceDetailsEvent">
					<view class="content-list-left">
						<u-image src="@/static/img/health-nurse.png" width="70" height="70">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="content-list-right">
						<view class="service-introduce">
							<view class="service-name">
								<text>婴儿黄疸测定</text>
							</view>
							<view class="service-price">
								<text>￥158</text>
							</view>
						</view>
						<view class="collect-icon">
							<u-icon name="heart-fill" color="#FC4579" size="34"></u-icon>
						</view>
					</view>
				</view>
				<view class="content-list">
					<view class="content-list-left">
						<u-image src="@/static/img/health-nurse.png" width="70" height="70">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="content-list-right">
						<view class="service-introduce">
							<view class="service-name">
								<text>婴儿黄疸测定</text>
							</view>
							<view class="service-price">
								<text>￥158</text>
							</view>
						</view>
						<view class="collect-icon">
							<u-icon name="heart-fill" color="#FC4579" size="34"></u-icon>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				currentIndex: 0,
				infoText: '',
				searchValue: '',
				showLoadingHint: false,
				serviceTypeList: ['推荐服务','健康护理','妈妈护理','宝宝护理','慢病护理','母婴服务套餐','健康护理套餐','推荐服务','健康护理','妈妈护理','宝宝护理','慢病护理','母婴服务套餐','健康护理套餐']
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
			}
		},
		onShow() {
		},
		methods: {
			...mapMutations([
			]),
			
			// 服务类型点击事件
			serviceTypeClickEvent (item,index) {
				this.currentIndex = index
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index'
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
			height: 230px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				.header_fixed {
					.header_title_center {
						color: #fff !important;
						text {
							color: #fff !important;
						}
					}
				}	
			};
			.search-box {
				position: absolute;
				top: 100px;
				left: 3%;
				width: 94%;
				z-index: 10;
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 230px
			}
		};
		.content-area-box {
			flex: 1;
			z-index: 10;
			height: 0;
			margin-top: -80px;
			display: flex;
			.content-left {
				width: 25%;
				height: 100%;
				overflow: auto;
				background: #F5F5F5;
				.service-list {
					height: 100%;
					height: 48px;
					width: 100%;
					>text {
						width: 100%;
						display: inline-block;
						height: 48px;
						text-align: center;
						line-height: 48px;
						font-size: 13px;
						color: #666667
					};
					.selectServieTypeStyle {
						font-size: 14px !important;
						color: #F16C8C !important;
						background: #fff !important
					}
				}
			};
			.content-right {
				width: 75%;
				height: 100%;
				overflow: auto;
				padding: 10px 0 10px 10px;
				box-sizing: border-box;
				background: #fff;
				.content-list {
					display: flex;
					padding: 14px 0;
					box-sizing: border-box;
					align-items: center;
					justify-content: space-between;
					@include bottom-border-1px(rgba(157, 156, 156, 0.8));
					.content-list-left {
						::v-deep .u-image {
							// width: 70px !important;
							// height: 70px !important
						}
					};
					.content-list-right {
						margin-left: 10px;
						padding-right: 10px;
						box-sizing: border-box;
						flex: 1;
						width: 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.service-introduce {
							flex: 1;
							@include no-wrap;
							.service-name {
								>text {
									@include no-wrap;
									width: 100%;
									display: inline-block;
									font-size: 14px;
									margin-bottom: 20px;
									color: #101010;
									font-weight: bold
								}
							};
							.service-price {
								>text {
									font-size: 14px;
									color: #E86F50;
								}
							}
						};
						.collect-icon {}
					}
				}
			}
		}
	}
</style>
