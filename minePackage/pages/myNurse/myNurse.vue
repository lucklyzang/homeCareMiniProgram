<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的医护" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="specialist-content-area">
			<view class="search-box">
				<u-search v-model="searchValue" bgColor="#fff" :actionStyle="{color: '#FF698C',fontSize: '16px'}" @change="searchInputEvent" @custom="searchEvent" :clearabled="true" :showAction="true"></u-search>
			</view>
			<view class="specialist-list-box">
				<u-empty text="暂无收藏医护" v-if="isShowNoHomeNoData"></u-empty>
				<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
					<view class="nurse-practitioner-list" v-for="(item,index) in fullNurseList" :key="index" @click="viewSpecialistDetailsEvent(item)">
						<view class="nurse-practitioner-list-top">
							<text>{{ item.practice }}</text>
						</view>
						<view class="nurse-practitioner-list-left">
							<view class="nurse-practitioner-list-left-top">
								<u-image :src="!item.avatar ? defaultNurseAvatar : item.avatar" width="70" height="70">
									 <template v-slot:loading>
											<u-loading-icon color="red"></u-loading-icon>
										</template>
								</u-image>
							</view>
							<view class="rate">
								<view class="rate-box">
									<u-rate size="12" :count="!item.rateValue ? 5 : item.rateValue" readonly v-model="item.rateValue" :active-color="item.rateValue == 5 ? '#F9B128' : '#DCDCDC'"></u-rate>
									<text :class="{'textStyle' : item.rateValue >= 5}">{{ item.commentScore == 0 ? '0.0' : item.rateValue.toFixed(1) }}</text>
								</view>
								<view class="rate-text">
									<text>{{ item.commentCount }}</text>
									<text>条评价</text>
								</view>
							</view>
						</view>
						<view class="nurse-practitioner-list-right">
							<view class="nurse-practitioner-name">
								<text>{{ item.name }}</text>
								<text>{{ nurseTitleTransition(item.title) }}</text>
							</view>
							<view class="hospital-message-center">
								<view class="hospital-name">
									<image src="@/static/img/red-circle-icon.png"></image>
									<text>{{ item.organization }}</text>
								</view>
								<view class="nurse-practitioner-performance">
									<view class="nurse-practitioner-performance-left">
										<image src="@/static/img/red-circle-icon.png"></image>
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
							</view>
							<view class="good-territory">
								<text v-for="(innerItem,innerIndex) in item.genius" :key="innerIndex">{{ innerItem }}</text>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" v-if="fullNurseList.length > 0" />
				</scroll-view>
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
	import { getUserCollectNurse } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				jaundiceDetectionServicePng: require("@/static/img/jaundice-detection-service.png"),
				infoText: '加载中···',
				current: 0,
				showLoadingHint: false,
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				nurseList: [],
				fullNurseList: [],
				searchValue: '',
				listTabsName: [
					{
						name: '服务详情'
					},
				  {
				  	name: '预约须知'
				  },
					{
						name: '用户评价'
					}
				]          
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'nurseRankDictData'
			])
		},
		onLoad() {
			this.queryUserCollectNurseList({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize,
				name: '',
				userId: this.userInfo.userId
			},true)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
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
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryUserCollectNurseList({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: '',
						userId: this.userInfo.userId
					},false)
				}
			},
			
			// 查询我的收藏医护
			queryUserCollectNurseList(data,flag) {
				this.nurseList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getUserCollectNurse(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.nurseList = res.data.data.list;
						if (res.data.data.list.length == 0) {
							this.isShowNoHomeNoData = true;
						} else {
							this.nurseList.forEach((item) => {
								item['rateValue'] = item.commentScore == 0 ? 0 : Math.floor(item.commentScore/item.commentCount) > 5 ? 5 : Math.floor(item.commentScore/item.commentCount);
							})
						};
						this.fullNurseList = this.fullNurseList.concat(this.nurseList);
						if (this.fullNurseList.length == 0) {
							this.isShowNoHomeNoData = true
						} else {
							this.isShowNoHomeNoData = false
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false;
					} else {
						let totalPage = Math.ceil(this.totalCount/this.pageSize);
						if (this.currentPage >= totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore';
						}	
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false;
					} else {
						this.status = 'loadmore'
					};
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 查询我的收藏医护(搜索指定姓名)
			queryUserCollectNurseListByName(data) {
				this.nurseList = [];
				this.fullNurseList = [];
				this.showLoadingHint = true;
				this.isShowNoHomeNoData = false;
				this.infoText = '搜索中···';
				getUserCollectNurse(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.nurseList = res.data.data.list;
						if (res.data.data.list.length == 0) {
							this.isShowNoHomeNoData = true;
						} else {
							this.nurseList.forEach((item) => {
								item['rateValue'] = item.commentScore == 0 ? 0 : Math.floor(item.commentScore/item.commentCount) > 5 ? 5 : Math.floor(item.commentScore/item.commentCount);
							})
						};
						this.fullNurseList = this.fullNurseList.concat(this.nurseList);
						if (this.fullNurseList.length == 0) {
							this.isShowNoHomeNoData = true
						} else {
							this.isShowNoHomeNoData = false
						};
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
			
			// 查看护师详情事件
			viewSpecialistDetailsEvent (item) {
				// 传递护师信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/servicePackage/pages/specialistDetails/specialistDetails?transmitData='+mynavData
				})
			},
			
			// 搜索事件
			searchEvent () {
				this.queryUserCollectNurseListByName({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					name: this.searchValue,
					userId: this.userInfo.userId
				})
			},
			
			// 搜索框值变化事件
			searchInputEvent () {
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
		position: relative;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 20000;
		};
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
		.specialist-content-area {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			.search-box {
				padding: 0 10px;
				box-sizing: border-box;
				height: 60px;
				display: flex;
				align-items: center;
			};
			.specialist-list-box {
				flex: 1;
				width: 96%;
				margin: 0 auto;
				overflow: auto;
				position: relative;
				margin-bottom: 10px;
				.scroll-view {
					height: 100%
				};
				::v-deep .u-empty {
				 	position: absolute;
				 	top: 50%;
				 	left: 50%;
				 	transform: translate(-50%,-50%)
				 };
				.nurse-practitioner-list {
					padding: 30px 6px 20px 6px;
					box-sizing: border-box;
					background: #fff;
					border-radius: 8px;
					display: flex;
					justify-content: space-between;
					position: relative;
					box-shadow: 0px 1px 2px 0px rgba(202, 200, 200, 0.46);
					margin-bottom: 10px;
					.nurse-practitioner-list-top {
						position: absolute;
						top: 0;
						right: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 111px;
						height: 26px;
						background: linear-gradient(to right, #ffa7c0, #FC4278);
						box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.4);
						border-top-right-radius: 8px;
						>text {
							font-size: 12px;
							color: #fff
						}
					};
					.nurse-practitioner-list-left {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-right: 10px;
						width: 110px;
						.nurse-practitioner-list-left-top {
							width: 70px;
							height: 70px;
							::v-deep .u-image {
								width: 70px !important;
								height: 70px !important;
								border-radius: 50% !important;
								uni-image {
									width: 70px !important;
									height: 70px !important;
									border-radius: 50% !important;
								}
							};
							::v-deep image {
								width: 70px !important;
								height: 70px !important;
								border-radius: 50% !important;
							}
						};
						.rate {
							margin-top: 6px;
							display: flex;
							flex-direction: column;
							justify-content: center;
							.rate-box {
								display: flex;
								color: #d6d6d6;
								font-size: 12px;
								align-items: center;
								::v-deep .u-rate {
									margin-right: 2px;
								};
								.textStyle {
									color: #F9B128 !important
								}
							};
							.rate-text {
								>text {
									font-size: 11px;
									font-weight: 400;
									&:nth-of-type(1) {
										margin-left: 4px;
										color: #999999;
										word-break: break-all;
									};
									&:nth-of-type(2) {
										color: #999999;
									}
								}
							}
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
									color: #000000;;
									margin-right: 10px;
									font-weight: bold
								};
								&:nth-child(2) {
									font-size: 14px;
									color: #F2A15F;
								}
							}
						};
						.hospital-message-center {
							margin: 8px 0;
							display: flex;
							flex-direction: column;
							background: #FAFAFA;
							padding: 6px;
							box-sizing: border-box;
							.hospital-name {
								display: flex;
								align-items: center;
								image {
									width: 6px;
									height: 6px;
									margin-right: 4px;
								};
								>text {
									flex: 1;
									word-break: break-all;
									font-size: 12px;
									color: #333333;
									font-weight: 400;
								}
							};
							.nurse-practitioner-performance {
								display: flex;
								margin-top: 4px;
								.nurse-practitioner-performance-left {
									margin-right: 20px;
									display: flex;
									align-items: center;
									position: relative;
									image {
										width: 6px;
										height: 6px;
										margin-right: 4px; 
									};
									>text {
										font-size: 12px;
										font-weight: 400;
										&:nth-child(2) {
											color: #333333;
										};
										&:nth-child(3) {
											color: #E81F50;
											margin: 0 4px;
										};
										&:nth-child(4) {
											color: #333333;
										}
									}
								};
								.nurse-practitioner-performance-left ::after {
									content: '';
									width: 1px;
									height: 14px;
									background: #333333;
									position: absolute;
									top: 1px;
									right: -10px;
								};
								.nurse-practitioner-performance-right {
									display: flex;
									align-items: center;
									>text {
										font-size: 12px;
										font-weight: 400;
										&:nth-child(1) {
											color: #333333;
										};
										&:nth-child(2) {
											margin: 0 4px;
											color: #E81F50;
										};
										&:nth-child(3) {
											color: #333333
										}
									}
								}
							}
						};
						.good-territory {
							display: flex;
							margin-top: 4px;
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
