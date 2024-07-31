<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 删除全部搜索记录提示 -->
		<view class="delete-info">
			<u-modal :show="deleteSearchShow" @confirm="deleteSearchSureEvent" @cancel="deleteSearchShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="删除全部搜索记录后无法恢复,确定删除?">
			</u-modal>
		</view>
		<view class="top-area-box">
			<view class="top-area-left" @click="backTo">
				<u-icon name="arrow-left" color="#101010" size="22"></u-icon>
			</view>
			<view class="search-box">
				<u-search @blur="searchInputBlurEvent"  @focus="searchInputFocusEvent" v-model="searchValue" placeholder="请输入您想查询的内容" bgColor="#EBEBEB" searchIconColor="rgba(232, 32, 80, 0.66)" :actionStyle="{color: '#fff',padding: '4px 10px',background: '#E82050',borderRadius: '50px',fontSize: '14px'}" @change="searchInputEvent" @custom="searchEvent" :clearabled="true" :showAction="true"></u-search>
			</view>
		</view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="search-init-box" v-if="isShowSearchInput">
			<view class="search-history-box">
				<view class="search-history-title">
					<view class="search-history-title-left">
						<text>搜索历史</text>
					</view>
					<view class="search-history-title-right" @click="deleteHistorySearchEvent" v-if="searchHistoryList.length > 0">
						<u-icon name="trash" color="#101010" size="22"></u-icon>
					</view>
				</view>
				<view class="search-history-content">
					<view class="search-history-list" :key="index" v-for="(item,index) in searchHistoryList" @click="searchItemClickEvent(item,index,'history')">
						<text>{{ item }}</text>
						<u-icon name="close" color="#101010" size="18" @click.native.stop="deleteSingleEvent(item,index)"></u-icon>
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
		</view>
		<view class="service-details-bottom" v-if="!isShowSearchInput">
			<view class="tabs-area">
				<u-tabs :current="current" lineColor="#FF5F83" :inactiveStyle="{color: '#999999',fontSize: '14px'}"
				 :activeStyle="{color: '#101010',fontSize: '14px',fontWeight:'bold'}"
				:list="listTabsName" @click="tabClickEvent"></u-tabs>
			</view>
			<view class="all-service-box" v-if="current == 0">
				<view class="all-service-list-box">
					<u-empty text="暂无服务" v-if="isShowNoHomeNoData"></u-empty>
					<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolowerService">
						<view class="service-list" v-for="(item,index) in fullServiceCategoryDetailsList" :key="index" @click="enterServiceDetailsEvent(item.id)">
							<view class="service-list-left">
								<u-image :src="item.picUrl" width="76" height="76">
									 <template v-slot:loading>
											<u-loading-icon color="red"></u-loading-icon>
										</template>
								</u-image>
							</view>
							<view class="service-list-right">
								<view class="service-project">
									<text>{{ item.name }}</text>
									<text>{{ item.introduction }}</text>
								</view>
								<view class="service-price">
									<text>￥</text>
									<text>{{ `${item.price}` }}</text>
								</view>
							</view>
						</view>
						<u-loadmore :status="status"  v-if="fullServiceCategoryDetailsList.length > 0" />
					</scroll-view>
				</view>
			</view>
			<view class="nurse-box" v-if="current == 1">
				<view class="specialist-list-box">
					<u-empty text="暂无医护" v-if="isShowNoHomeNoData"></u-empty>
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
			<view class="organization-box" v-if="current == 2">
				<view class="organization-list-box">
					<u-empty text="暂无机构" v-if="isShowNoHomeNoData"></u-empty>
					<view class="organization-list" v-for="(item,index) in organizationList" :key="index">
						<view class="image-area">
							<u-image :src="item.logo ? item.logo : jaundiceDetectionServicePng" width="70" height="70">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
							<view class="distance-area">
								 {{ `${item.distance}` }} 
							</view>
						</view>
						<view class="name-text-area">
							{{ item.content }}
						</view>
						<view class="address-text-area">
							{{ item.addressPath }}
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
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { getNurse, getOrganizationList, getServiceProductCategoryDetails, getSearchPhrase, deleteHisOne, deleteHisAll } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				isShowSearchInput: false,
				deleteSearchShow: false,
				defaultNurseAvatar: require("@/static/img/health-nurse.png"),
				jaundiceDetectionServicePng: require("@/static/img/jaundice-detection-service.png"),
				showLoadingHint: false,
				infoText: '加载中···',
				searchValue: '',
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				nurseList: [],
				fullNurseList: [],
				serviceCategoryDetailsList: [],
				fullServiceCategoryDetailsList: [],
				organizationList: [],
				coordinate: '',
				searchHistoryList: [],
				searchHotList: [],
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
			},true);
			// 获取当前所在位置
			try {
				this.isGetLocation()
			} catch(err) {
				this.$refs.uToast.show({
					message: `${err}`,
					type: 'error',
					position: 'center'
				})
			}
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				if (this.isShowSearchInput) {
					this.isShowSearchInput = false;
				} else {
					uni.navigateBack()
				}
			},
			
			isGetLocation(a = "scope.userLocation") { //检查当前是否已经授权访问scope属性
				let _this = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting[a]) { //每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
							_this.getAuthorizeInfo()
						} else {
							_this.getLocation()
						}
					}
				})
			},
			
			getAuthorizeInfo(a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				let _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
						_this.getLocation()
					}
				})
			},
			
			//获取当前所在位置的经纬度
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: (res) => {
						this.coordinate = `${res.latitude},${res.longitude}`;
						console.log(2,this.coordinate);
					},
					fail: (err) => {
						this.$refs.uToast.show({
							message: '无法获取位置信息！无法使用位置功能',
							type: 'error',
							position: 'center'
						})
					}
				})
			},
			
			// 搜索框失焦事件
			searchInputBlurEvent () {
			},
			
			// 搜索框获焦事件
			searchInputFocusEvent () {
				this.isShowSearchInput = true;
				this.getSearchPhraseEvent(this.current === 0 ? 1 : this.current === 1 ? 3 : 2)
			},
			
			// 搜索框值变化事件
			searchInputEvent () {
				
			},
			
			// 删除单个搜索记录事件
			deleteSingleEvent (item,index) {
				deleteHisOne(this.current === 0 ? 1 : this.current === 1 ? 3 : 2,{name: item}).then((res) => {
					if ( res && res.data.data) {
						this.searchHistoryList.splice(index,1)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}	
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 删除全部历史搜索记录弹框事件
			deleteHistorySearchEvent () {
				this.deleteSearchShow = true
			},
			
			// 删除全部历史搜索记录弹框确定事件
			deleteSearchSureEvent () {
				deleteHisAll(this.current === 0 ? 1 : this.current === 1 ? 3 : 2).then((res) => {
					if ( res && res.data.data) {
						this.deleteSearchShow = false;
						this.searchHistoryList = []
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}	
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 查询搜索词组事件
			getSearchPhraseEvent(type) {
				getSearchPhrase({type}).then((res) => {
					if ( res && res.data.code == 0) {
						this.searchHistoryList = res.data.data.his;
						this.searchHotList = res.data.data.hot;
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}	
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'center'
					})
				})
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
						pageSize: this.pageSize,
					},true)
				} else if (this.current == 1) {
					this.fullNurseList = [];
					this.queryNurseList({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: '',
						userId: this.userInfo.userId
					},true)
				} else if (this.current == 2) {
					this.getOrganizationListEvent(this.searchValue,this.coordinate)
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
						pageSize: this.pageSize,
					},false)
				}
			},
			
			// 查询所有服务
			queryServiceProductCategoryDetails(data,flag) {
				this.serviceCategoryDetailsList = [];
				if (flag) {
					this.fullServiceCategoryDetailsList = [];
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
						this.serviceCategoryDetailsList.forEach((item) => {
							return item.price = fenToYuan(item.price)
						});
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
			
			// 获取组织机构列表
			getOrganizationListEvent (name,coordinate) {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.organizationList = [];
				this.isShowNoHomeNoData = false;
				getOrganizationList({name,coordinate}).then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.organizationList.push({
									id: item.id.toString(),
									content: item.name,
									logo: item.logo,
									addressPath: item.addressPath,
									distance: !item.distance && item.distance != 0 ? '' : `${item.distance}km`
								})
							}
						} else {
							this.isShowNoHomeNoData = true
						}
					}
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
			
			// 进入服务详情事件
			enterServiceDetailsEvent (item) {
				// 传递服务地址信息
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index?transmitData='+item
				})
			},
			
			// 搜索事件
			searchEvent () {
				if (this.isShowSearchInput) {
					this.isShowSearchInput = false
				};
				if (this.current == 0) {
					this.currentPageNum = 1;
					this.queryServiceProductCategoryDetails({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						keyword: this.searchValue
					},true)
				} else if (this.current == 1) {
					this.currentPageNum = 1;
					this.queryNurseListByName({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: this.searchValue,
						userId: this.userInfo.userId
					})
				} else if (this.current == 2) {
					this.getOrganizationListEvent(this.searchValue,this.coordinate)
				}
			},
			
			// 快捷搜索事件
			searchItemClickEvent(item,index,type) {
				if (this.isShowSearchInput) {
					this.isShowSearchInput = false
				};
				this.searchValue = item;
				if (this.current == 0) {
					this.currentPageNum = 1;
					this.queryServiceProductCategoryDetails({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						keyword: item
					},true)
				} else if (this.current == 1) {
					this.currentPageNum = 1;
					this.queryNurseListByName({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						name: item,
						userId: this.userInfo.userId
					})
				} else if (this.current == 2) {
					this.getOrganizationListEvent(item,this.coordinate)
				}
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
					position: relative;
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
						position: relative;
						padding: 3px 16px;
						box-sizing: border-box;
						margin-right: 10px;
						margin-bottom: 8px;
						background: #F4F5F7;
						border-radius: 20px;
						font-size: 13px;
						color: #101010;
						::v-deep {
							.uicon-close {
								position: absolute;
								top: -8px !important;
								right: -8px !important;
							}
						}
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
				overflow: auto;
				.all-service-list-box {
					padding: 10px 0;
					box-sizing: border-box;
					height: 100%;
					width: 94%;
					margin: 0 auto;
					overflow: auto;
					position: relative;
					.scroll-view {
						height: 100%
					};
					::v-deep .u-empty {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%)
					 };
					.service-list {
						margin-top: 10px;
						padding: 4px 8px;
						height: 100px;
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
								height: 76px;
								justify-content: space-between;
								>text {
									display: inline-block;
									width: 100%;
									@include no-wrap;
									&:first-child {
										font-size: 16px;
										color: #101010;
										font-weight: 400;
										margin-bottom: 12px
									};
									&:last-child {
										font-size: 11px;
										color: #999999;
										font-weight: 400;
									}
								}
							};
							.service-price {
								>text {
									&:nth-child(1) {
										font-size: 12px;
										color: #F92C20;
										font-weight: 500;
									};
									&:nth-child(2) {
										font-size: 17px;
										color: #F92C20;
										font-weight: 500;
									}
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
										font-weight: 400;
										max-width: 100px;
										@include no-wrap;
									};
									&:nth-child(2) {
										font-size: 14px;
										font-weight: 400;
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
										font-size: 13px;
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
											font-size: 13px;
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
											font-size: 13px;
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
									padding: 0 6px;
									box-sizing: border-box;
									height: 20px;
									text-align: center;
									line-height: 20px;
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
				overflow: auto;
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
					position: relative;
					::v-deep .u-empty {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%)
					 };
					.organization-list {
						width: 49%;
						margin-right: 2%;
						box-sizing: border-box;
						border-bottom-left-radius: 9px;
						border-bottom-right-radius: 9px;
						margin-bottom: 10px;
						border: 1px solid #FEB8B7;
						padding-bottom: 8px;
						box-sizing: border-box;
						.image-area {
							height: 105px;
							position: relative;
							::v-deep .u-image {
								width: 100% !important;
								height: 105px !important;
								uni-image {
									width: 100% !important;
									height: 105px !important;
								};
								.u-image__error {
									width: 100% !important;
									height: 105px !important;
								};
								.u-image__loading {
									width: 100% !important;
									height: 105px !important;
								};
								image {
									width: 100% !important;
									height: 105px !important;
								}
							};
							.distance-area {
								position: absolute;
								top: 80%;
								left: 50%;
								transform: translateX(-50%);
								font-size: 14px;
								color: #fff;
							}
						};
						.name-text-area {
							font-size: 12px;
							color: #101010;
							max-height: 45px;
							overflow-y: auto;
							word-break: break-all;
							padding: 6px 8px 0 8px;
							box-sizing: border-box;
							font-weight: 500;
							
						};
						.address-text-area {
							font-size: 12px;
							color: #a0a0a0;
							height: 24px;
							padding: 6px 8px 0 8px;
							box-sizing: border-box;
							@include no-wrap;
						};
						&:nth-child(even) {
							margin-right: 0 !important;
						}
					}
				}
			}
		}
	}
</style>
