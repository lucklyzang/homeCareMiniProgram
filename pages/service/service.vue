<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="服务">
				</nav-bar> 
			</view>
			<view class="search-box">
				<u-search placeholder="搜索服务名称" height="30" :action-style="{color: '#fff',fontSize: '16px'}" :clearabled="true" bg-color="#fff" :showAction="true" @custom="searchEvent" v-model="searchValue"></u-search>
			</view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="content-area-box">
			<view class="content-left">
				<view class="service-list" v-for="(item,index) in serviceCategoryList" :key="index" @click="serviceTypeClickEvent(item,index)">
					<text class="right-line" v-if="currentIndex === index"></text>
					<text class="name-text" :class="{'selectServieTypeStyle': currentIndex === index }">{{ item.name }}</text>
				</view>
			</view>
			<view class="content-right">
				<u-empty text="暂无对应服务项目" v-if="isShowNoHomeNoData"></u-empty>
				<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
					<view class="content-list" v-for="(item,index) in fullServiceCategoryDetailsList" :key="index" @click="enterServiceDetailsEvent(item.id)">
						<view class="content-list-left">
							<u-image :src="item.picUrl" width="76" height="76">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="content-list-right">
							<view class="service-introduce">
								<view class="service-name">
									<text>{{ item.name }}</text>
								</view>
								<view class="other-info">
									<!-- <text>{{ item.introduction }}</text> -->
									<text>{{ item.hasOwnProperty('commentScore') ? `${item.commentScore.toFixed(1)}分` : '暂无评分' }}</text>
									<text>{{ `销量${item.salesCount}` }}</text>
								</view>
								<view class="service-price">
									<text>￥</text>
									<text>{{ `${item.price}` }}</text>
								</view>
							</view>
							<view class="collect-icon" @click.stop="collectProductEvent(item,index)">
								<u-icon name="heart-fill" :color="item.collect ? '#FC4579': '#999999'" size="28"></u-icon>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" v-if="fullServiceCategoryDetailsList.length > 0" />
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
	import navBar from "@/components/zhouWei-navBar"
	import { fenToYuan } from '@/common/js/utils'
	import { getServiceProductCategory, getServiceProductCategoryDetails, createProductFavorite, deleteProductFavorite } from '@/api/user.js'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				currentIndex: 0,
				infoText: '加载中···',
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				status: 'nomore',
				isShowNoHomeNoData: false,
				currentId: '',
				serviceCategoryDetailsList: [],
				fullServiceCategoryDetailsList: [],
				serviceCategoryList: [],
				searchValue: '',
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo',
				'userInfo',
				'parentServiceCategoryMessage'
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
			this.queryServiceProductCategory()
		},
		methods: {
			...mapMutations([
				'changeParentServiceCategoryMessage'
			]),
			
			// 服务类型点击事件
			serviceTypeClickEvent (item,index) {
				this.searchValue = '';
				this.currentIndex = index;
				this.currentId = item.id;
				this.fullServiceCategoryDetailsList = [];
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoHomeNoData = false;
				this.changeParentServiceCategoryMessage(item);
				this.queryServiceProductCategoryDetails({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					categoryId: this.currentId
				},true)
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent (item) {
				// 传递服务地址信息
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index?transmitData='+item
				})
			},
			
			// 收藏/取消收藏服务事件
			collectProductEvent (item,index) {
				if (item.collect) {
					this.cancelProductCollectEvent(item,index)
				} else {
					this.createProductFavoriteEvent(item,index)
				}
			},
			
			// 创建商品收藏
			createProductFavoriteEvent(item,index) {
				this.showLoadingHint = true;
				this.infoText = '收藏中···';
				createProductFavorite({spuId: item.id }).then((res) => {
					if ( res && res.data.code == 0) {
						this.$set(this.fullServiceCategoryDetailsList[index],'collect',true);
						this.$forceUpdate();
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
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
			
			// 取消服务收藏事件
			cancelProductCollectEvent (item,index) {
				this.showLoadingHint = true;
				this.infoText = '取消收藏中···';
				deleteProductFavorite({spuId: item.id }).then((res) => {
					if ( res && res.data.code == 0) {
						this.$set(this.fullServiceCategoryDetailsList[index],'collect',false);
						this.$forceUpdate();
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
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
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryServiceProductCategoryDetails({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						categoryId: this.currentId
					},false)
				}
			},
			
			// 查询服务分类
			queryServiceProductCategory () {
				this.showLoadingHint = true;
				this.serviceCategoryList = [];
				getServiceProductCategory({
					userId: this.userInfo.userId
				}).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							this.serviceCategoryList = res.data.data;
							this.serviceCategoryList = this.serviceCategoryList.filter((item) => { return item.parentId == 0 });
							// 回显首页点击的服务大类
							if (JSON.stringify(this.parentServiceCategoryMessage) != '{}') {
								this.currentIndex = this.serviceCategoryList.findIndex((item) => { return item.id == this.parentServiceCategoryMessage.id })
							};
							// 查询服务分类第一项下的服务明细
							this.fullServiceCategoryDetailsList = [];
							this.queryServiceProductCategoryDetails({
								pageNo: this.currentPageNum,
								pageSize: this.pageSize,
								categoryId: JSON.stringify(this.parentServiceCategoryMessage) != '{}' ? this.parentServiceCategoryMessage.id : this.serviceCategoryList[0]['id']
							},true)
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
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
			
			// 查询服务分类明细
			queryServiceProductCategoryDetails(data,flag) {
				this.serviceCategoryDetailsList = [];
				this.isShowNoHomeNoData = false;
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
			
			// 搜索事件
			searchEvent () {
				this.currentPageNum = 1;
				this.fullServiceCategoryDetailsList = [];
				this.queryServiceProductCategoryDetails({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					categoryId: JSON.stringify(this.parentServiceCategoryMessage) != '{}' ? this.parentServiceCategoryMessage.id : this.serviceCategoryList[0]['id'],
					keyword: this.searchValue
				},true)
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
				background: #FAFAFA;
				.service-list {
					height: 48px;
					line-height: 48px;
					text-align: center;
					width: 100%;
					position: relative;
					.right-line {
						width: 3px;
						height: 28px;
						background: #F92C20;
						border-radius: 1px;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%)
					};
					.name-text {
						padding-left: 6px;
						box-sizing: border-box;
						width: 100%;
						display: inline-block;
						height: 48px;
						text-align: center;
						line-height: 48px;
						font-size: 12px;
						font-weight: 400;
						color: #666666;
						@include no-wrap;
					};
					.selectServieTypeStyle {
						font-size: 12px !important;
						color: #000000 !important;
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
						height: 76px;
						padding-right: 10px;
						box-sizing: border-box;
						flex: 1;
						width: 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.service-introduce {
							flex: 1;
							height: 76px;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							@include no-wrap;
							.service-name {
								>text {
									@include no-wrap;
									width: 100%;
									display: inline-block;
									font-size: 13px;
									color: #333333;
									font-weight: 600;
								}
							};
							.other-info {
								margin-top: -10px;
								@include no-wrap;
								display: flex;
								>text {
									display: inline-block;
									font-size: 12px;
									&:nth-child(1) {
										position: relative;
										color: orange;
										padding-right: 12px;
										box-sizing: border-box;
									};
									&:nth-child(1) ::after {
										content: '';
										width: 1px;
										height: 12px;
										background: #b1b1b1;
										position: absolute;
										top: 50%;
										transform: translateY(-50%);
										right: 0;
									};
									&:nth-child(2) {
										flex: 1;
										@include no-wrap;
										padding-left: 12px;
										color: #333333;
										font-weight: 400;
										box-sizing: border-box;
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
						};
						.collect-icon {}
					}
				}
			}
		}
	}
</style>
