<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="top-area-left" @click="backTo">
				<u-icon name="arrow-left" color="#101010" size="22"></u-icon>
			</view>
			<view class="search-box">
				<u-search v-model="searchValue" placeholder="请输入您想查询的内容" bgColor="#EBEBEB" searchIconColor="rgba(232, 32, 80, 0.66)" :actionStyle="{color: '#fff',padding: '4px 10px',background: '#E82050',borderRadius: '50px',fontSize: '14px'}" @change="searchInputEvent" @custom="searchEvent" :clearabled="true" :showAction="true"></u-search>
			</view>
		</view>
		<view class="loading-box" v-if="showLoadingHint">
			<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
		</view>
		<!-- <view class="search-init-box">
			<view class="search-history-box">
				<view class="search-history-title">
					<view class="search-history-title-left">
						<text>搜索历史</text>
					</view>
					<view class="search-history-title-right" @click="deleteHistorySearchEvent">
						<u-icon name="trash" color="#101010" size="22"></u-icon>
					</view>
				</view>
				<view class="search-history-content">
					<view class="search-history-list" :key="index" v-for="(item,index) in searchHistoryList" @click="searchItemClickEvent(item,index,'history')">
						<text>{{ item }}</text>
					</view>
				</view>
			</view>
			<view class="search-history-box search-hot-box">
				<view class="search-history-title">
					<view class="search-history-title-left">
						<text>热门搜索</text>
					</view>
				</view>
				<view class="search-history-content">
					<view class="search-history-list" :key="index" v-for="(item,index) in searchHotList" @click="searchItemClickEvent(item,index,'hot')">
						<text>{{ item }}</text>
					</view>
				</view>
			</view>
		</view> -->
		<view class="service-details-bottom">
			<view class="tabs-area">
				<u-tabs lineColor="#FF5F83" :inactiveStyle="{color: '#999999',fontSize: '14px'}"
				 :activeStyle="{color: '#101010',fontSize: '14px',fontWeight:'bold'}"
				:list="listTabsName" @click="tabClickEvent"></u-tabs>
			</view>
			<view class="all-service-box" v-if="current == 0">
				<view class="all-service-list-box">
					<u-empty text="暂无服务" v-if="isShowNoHomeNoData"></u-empty>
					<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolowerService">
						<view class="service-list" v-for="(item,index) in fullServiceCategoryDetailsList" :key="index" @click="enterServiceDetailsEvent(item.id)">
							<view class="service-list-left">
								<u-image :src="item.picUrl" width="63" height="63">
									 <template v-slot:loading>
											<u-loading-icon color="red"></u-loading-icon>
										</template>
								</u-image>
							</view>
							<view class="service-list-right">
								<view class="service-project">
									<text>{{ item.name }}</text>
									<text>内部专属护理,欢迎体验!</text>
								</view>
								<view class="service-price">
									<text>{{ `￥${item.price}起` }}</text>
								</view>
							</view>
						</view>
						<u-loadmore :status="status" v-show="fullServiceCategoryDetailsList.length > 0" />
					</scroll-view>
				</view>
			</view>
			<view class="nurse-box" v-if="current == 1">
				<view class="specialist-list-box">
					<u-empty text="暂无医护" v-if="isShowNoHomeNoData"></u-empty>
					<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
						<view class="nurse-practitioner-list" v-for="(item,index) in fullNurseList" :key="index" @click="viewSpecialistDetailsEvent(item)">
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
									<text>{{ item.title ? nurseTitleTransition(item.title) : '无' }}</text>
								</view>
								<view class="hospital-name">
									<text>{{ item.organization }}</text>
								</view>
								<view class="rate">
									<u-rate :count="item.rateValue" readonly v-model="item.rateValue" active-color="#E86F50"></u-rate>
									<text>{{ item.commentCount }}</text>
									<text>条评价</text>
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
					<u-loadmore :status="status" v-show="fullNurseList.length > 0" />
					</scroll-view>
				</view>
			</view>
			<view class="organization-box" v-if="current == 2">
				<view class="organization-list-box">
					<view class="organization-list">
						
					</view>
					<view class="organization-list">
						
					</view>
					<view class="organization-list">
						
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
	import { getNurse } from '@/api/user.js'
	import { getServiceProductCategoryDetails } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				searchValue: '',
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				jaundiceDetectionServicePng: require("@/static/img/jaundice-detection-service.png"),
				infoText: '加载中···',
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				nurseList: [],
				fullNurseList: [],
				serviceCategoryDetailsList: [],
				fullServiceCategoryDetailsList: [],
				searchHistoryList: ['李云龙','楚云飞','黄疸','母婴护理','疫苗'],
				searchHotList: ['李云龙','楚云飞','黄疸','母婴护理','疫苗'],
				current: 0,
				listTabsName: [
					{
						name: '全部服务'
					},
				  {
				  	name: '护师'
				  },
					{
						name: '机构'
					}
				]          
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'nurseRankDictData'
			]),
			userName() {
			},
			proId() {
			}
		},
		onLoad() {
			this.queryServiceProductCategoryDetails({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize
			},true)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// tab切换事件
			tabClickEvent (item) {
				this.current = item.index;
				this.searchValue = '';
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoHomeNoData = false;
				if (this.current == 0) {
					this.fullServiceCategoryDetailsList = [];
					this.queryServiceProductCategoryDetails({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize
					},true)
				} else if (this.current == 1) {
					this.fullNurseList = [];
					this.queryNurseList({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: '',
						userId: this.userInfo.userId
					},true)
				}
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
			
			// 监听护师列表滚动
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
			
			// 查询医护
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
								item['rateValue'] = item.commentScore == 0 ? 0 : Math.floor(item.commentScore/item.commentCount)
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
			
			// 查询医护(搜索指定姓名)
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
								item['rateValue'] = item.commentScore == 0 ? 0 : Math.floor(item.commentScore/item.commentCount)
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
			
			// 监听服务列表滚动
			scrolltolowerService () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryServiceProductCategoryDetails({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize
					},false)
				}
			},
			
			// 查询所有服务
			queryServiceProductCategoryDetails(data,flag) {
				this.serviceCategoryDetailsList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getServiceProductCategoryDetails(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.serviceCategoryDetailsList = res.data.data.list;
						this.fullServiceCategoryDetailsList = this.fullServiceCategoryDetailsList.concat(this.serviceCategoryDetailsList);
						if (this.fullServiceCategoryDetailsList.length == 0) {
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
			
			// 查看护师详情事件
			viewSpecialistDetailsEvent (item) {
				// 传递护师信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/servicePackage/pages/specialistDetails/specialistDetails?transmitData='+mynavData
				})
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent (item) {
				// 传递服务地址信息
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index?transmitData='+item
				})
			},
			
			// 搜索事件
			searchEvent () {
				if (this.current == 1) {
					this.queryNurseListByName({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: this.searchValue,
						userId: this.userInfo.userId
					})
				}
			},
			
			// 快捷搜索事件
			searchItemClickEvent(item,index,type) {
				if (type == 'history') {
					
				} else {}
			},
			
			// 删除历史搜索事件
			deleteHistorySearchEvent () {},
			
			// 搜索框值变化事件
			searchInputEvent () {}
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
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			box-sizing: border-box;
			width: 100%;
			margin: 80px 0 0 0;
			.top-area-left {
				width: 30px;
				::v-deep .u-search {
					.u-content {
						height: 35px !important
					}
				}
			};
			.search-box {
				flex: 1;
				padding: 0 0 0 10px;
				box-sizing: border-box;
				height: 60px;
				display: flex;
				align-items: center;
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.search-init-box {
			padding: 10px 0;
			flex: 1;
			width: 92%;
			margin: 0 auto;
			overflow: auto;
			box-sizing: border-box;
			.search-history-box {
				.search-history-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14px;
					.search-history-title-left {
						font-size: 16px;
						color: #181818
					};
					.search-history-title-right {};
				};
				.search-history-content {
					display: flex;
					flex-wrap: wrap;
					.search-history-list {
						padding: 3px 16px;
						box-sizing: border-box;
						margin-right: 8px;
						margin-bottom: 8px;
						background: #F4F5F7;
						border-radius: 20px;
						font-size: 13px;
						color: #101010
					}
				}
			};
			.search-hot-box {
				margin-top: 10px;
				.search-history-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14px;
					.search-history-title-left {
						font-size: 13px !important;
					}
				}
			}		
		};
		.service-details-bottom {
			padding: 10px 0;
			flex: 1;
			display: flex;
			height: 0;
			flex-direction: column;
			box-sizing: border-box;
			.tabs-area {
				background: #fff;
				box-shadow: 0px 1px 3px 0px rgba(137, 140, 140, 0.61);
				::v-deep .u-tabs {
					.u-tabs__wrapper__scroll-view-wrapper {
						.u-tabs__wrapper__nav__item {
							flex: 1
						}
					}
				}
			};
			.all-service-box {
				flex: 1;
				.all-service-list-box {
					padding: 10px 0;
					box-sizing: border-box;
					height: 100%;
					width: 94%;
					margin: 0 auto;
					overflow: auto;
					.service-list {
						margin-top: 10px;
						padding: 4px 8px;
						height: 75px;
						box-sizing: border-box;
						background: #F8F8F8;
						border-radius: 8px;
						margin-bottom: 10px;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.service-list-left {
							::v-deep .u-image {
								// width: 63px !important;
								// height: 63px !important
							}
						};
						.service-list-right {
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding-left: 10px;
							box-sizing: border-box;
							.service-project {
								display: flex;
								flex-direction: column;
								flex: 1;
								width: 0;
								>text {
									display: inline-block;
									width: 100%;
									@include no-wrap;
									&:first-child {
										font-size: 16px;
										color: #101010;
										font-weight: bold;
										margin-bottom: 12px
									};
									&:last-child {
										font-size: 12px;
										color: #888888
									}
								}
							};
							.service-price {
								>text {
									font-size: 16px;
									color: #E95E5E
								}
							}
						}
					}
				}
			};
			.nurse-box {
				flex: 1;
				overflow: auto;
				.specialist-list-box {
					padding: 10px 0;
					width: 94%;
					margin: 0 auto;
					box-sizing: border-box;
					height: 100%;
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
						padding: 10px 0;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: relative;
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
									display: inline-block;
									&:nth-child(1) {
										font-size: 16px;
										color: #101010;
										margin-right: 10px;
										font-weight: bold
									};
									&:nth-child(2) {
										width: 67px;
										height: 22px;
										text-align: center;
										line-height: 22px;
										background: #F2A15F;
										color: #fff;
										border-radius: 3px;
										font-size: 12px;
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
								>text {
									font-size: 12px;
									&:nth-of-type(1) {
										color: #101010;
										margin-left: 4px
									};
									&:nth-of-type(2) {
										color: rgba(16, 16, 16, 0.35)
									}
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
								margin-top: 4px;
								display: flex;
								align-items: center;
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
			};
			.organization-box {
				flex: 1;
				.organization-list-box {
					padding: 10px 0;
					width: 94%;
					margin: 0 auto;
					box-sizing: border-box;
					height: 100%;
					overflow: auto;
					display: flex;
					align-content: flex-start;
					flex-wrap: wrap;
					.organization-list {
						width: 49%;
						margin-right: 2%;
						box-sizing: border-box;
						height: 190px;
						border: 1px solid #FEB8B7;
						border-radius: 9px;
						margin-bottom: 10px;
						&:nth-child(2) {
							margin-right: 0 !important;
						}
					}
				}
			}
		}
	}
</style>
