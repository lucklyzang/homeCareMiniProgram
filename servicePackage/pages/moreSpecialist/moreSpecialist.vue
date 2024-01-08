<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="更多专家" @backClick="backTo">
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
							<u-image :src="!item.avatar ? defaultNurseAvatar : item.avatar" width="63" height="63">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="nurse-practitioner-list-right">
							<view class="nurse-practitioner-name">
								<text>{{ item.name }}</text>
								<text>{{ nurseTitleTransition(item.title) }}</text>
							</view>
							<view class="hospital-name">
								<text>{{ item.organization }}</text>
							</view>
							<view class="rate">
								<u-rate :count="item.rateValue" readonly v-model="item.rateValue" :active-color="item.rateValue == 5 ? '#E86F50' : '#d6d6d6'"></u-rate>
								<text :class="{'textStyle' : item.rateValue < 5}">{{ item.commentScore == 0 ? '0.0' : item.rateValue.toFixed(1) }}</text>
							</view>
							<view class="nurse-practitioner-performance">
								<view class="nurse-practitioner-performance-message">
									<view class="nurse-practitioner-performance-left">
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
	import { getNurse } from '@/api/user.js'
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
			this.queryNurseList({
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
					this.queryNurseList({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: '',
						userId: this.userInfo.userId
					},false)
				}
			},
			
			// 查询更多医护
			queryNurseList(data,flag) {
				this.nurseList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getNurse(data).then((res) => {
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
			
			// 查询更多医护(搜索指定姓名)
			queryNurseListByName(data) {
				this.nurseList = [];
				this.fullNurseList = [];
				this.showLoadingHint = true;
				this.isShowNoHomeNoData = false;
				this.infoText = '搜索中···';
				getNurse(data).then((res) => {
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
				this.queryNurseListByName({
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
					align-items: center;
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
						width: 73px;
						height: 73px;
						margin-right: 10px;
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
									color: #101010;
									margin-top: 4px;
								}
							}
						};
						.hospital-name {
							margin-top: 4px;
							>text {
								word-break: break-all;
								font-size: 12px;
								color: #898C8C;
							}
						};
						.rate {
							display: flex;
							margin-top: 4px;
							align-items: center;
							>text {
								font-size: 12px;
								&:nth-of-type(1) {
									color: #E86F50;
									font-weight: bold;
									margin-left: 4px
								}
							};
							.textStyle {
								color: #d6d6d6 !important;
							}
						};
						.nurse-practitioner-performance {
							margin-top: 4px;
							display: flex;
							.nurse-practitioner-performance-message {
								display: flex;
								justify-content: space-between;
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
