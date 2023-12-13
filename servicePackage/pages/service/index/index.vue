<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="服务详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="service-details-content">
			<view class="service-details-top">
				<view class="service-image">
					<image :src="productDetailsMessage.picUrl" mode=""></image>
					<view class="rate-box" v-if="isVerifyProductFavoriteComplete">
						<u-icon v-if="!isProductFavorite" name="heart" color="#fff" size="26" @click="collectProductEvent"></u-icon>
						<u-icon v-else name="heart-fill" color="#FC4579" size="26" @click="collectProductEvent"></u-icon>
					</view>
				</view>
				<view class="service-price-message">
					<view class="service-name">
						<text>{{ productDetailsMessage.name }}</text>
					</view>
					<view class="service-price">
						<text>{{ `￥${productDetailsMessage.price}` }}</text>
					</view>
				</view>
			</view>
			<view class="service-details-bottom">
				<view class="tabs-area">
					<u-tabs lineColor="#0F0F0F" :inactiveStyle="{color: '#999999',fontSize: '14px'}"
					 :activeStyle="{color: '#101010',fontSize: '14px',fontWeight:'bold'}"
					:list="listTabsName" @click="tabClickEvent"></u-tabs>
				</view>
				<view class="service-details-box" v-if="current == 0">
					<view class="title-area">
						<text>服务详情</text>
					</view>
					<view class="service-content-area">
						<view class="service-goal">
							<view>
								<text>服务目的</text>
							</view>
							<view>
								<text>提高家长自我监护新生儿黄宜的能力，避免高胆红素血症导致的不良结局的发生</text>
							</view>
						</view>
						<view class="service-entry">
							<view>
								<text>服务内容</text>
							</view>
							<view>
								<text>1.经皮测单新生儿胆红素指数，判断胆红素水平</text>
								<text>2.黄宜相关知识宣教。</text>
							</view>
						</view>
						<view class="apply-person">
							<view>
								<text>适用人群</text>
							</view>
							<view>
								<text>0-6个月婴幼儿</text>
							</view>
						</view>
					</view>
				</view>
				<view class="appointment-notice-box" v-if="current == 1">
					<view class="title-area">
						<text>预约须知</text>
					</view>
					<view class="service-content-area">
						1.每个订单仅为一位用户提供一次服务。 若需在同个时间段下单多个项目，可在护土接单后和护土沟通追加项目，可享受定折扣。<br>
						2.请务必保证提交的信息真实、准确无误.<br>
						3.下单后请保持电话通畅，工作人员会联系您确认相关信息4.下单后原则上不支持修改服务时间，如需修改，请联系平台喜服或与服务护土沟通。<br>
						5.开始服务前，请务必确认上门护士身份、核实订单准确6.受限于客观条件，有以下情况者不在服务范围内: 具有攻击性、传染性、易产生过激反应等7.超时费和超路程费收费规则:<br>
						(1)超时费: 超出服务标准时长，每超出30分钟，则加收50元，以此类推。<br>
						(2) 护士已接单未出门，扣除用户订单金额30% <br>
					</view>
				</view>
				<view class="user-evaluate-box" v-if="current == 2">
					<view class="title-area">
						<text>用户评价</text>
					</view>
					<view class="service-content-area">
						<u-empty text="暂无评价" v-if="isShowNoHomeNoData"></u-empty>
						<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
							<view class="user-evaluate-list" v-for="(item,index) in fullCommentList" :key="index">
								<view class="user-evaluate-list-left">
									<view>
										<u-rate :count="item.scores" activeColor="#FFA903" v-model="item.scores" readonly></u-rate>
									</view>
									<view>
										<text>{{ item.content }}</text>
									</view>
									<view>
										<text>{{ item.userNickname }}</text>
										<text>互联网预约</text>
									</view>
								</view>
								<view class="user-evaluate-list-right">
									<text>{{ item.spuName }}</text>
									<text>{{ getNowFormatDate(new Date(item.createTime),4) }}</text>
								</view>
							</view>
							<u-loadmore :status="status" v-show="fullCommentList.length > 0" />
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		<view class="appointment-btn-area" @click="appointmentServiceEvent">
			<text>预约</text>
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
	import { getProductDetails, getProductComment, createProductFavorite, deleteProductFavorite, examineProductFavorite } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				count: 5,
				value: 2,
				jaundiceDetectionServicePng: require("@/static/img/jaundice-detection-service.png"),
				infoText: '加载中···',
				current: 0,
				isProductFavorite: false,
				isVerifyProductFavoriteComplete: false,
				productDetailsMessage: {},
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				commentList: [],
				spuId: '',
				fullCommentList: [],
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
				'userInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onLoad(options) {
			this.spuId = options.transmitData;
			this.queryProductDetails(options.transmitData);
			this.examineProductFavoriteEvent({spuId: this.spuId })
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
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoHomeNoData = false;
				if (this.current == 2) {
					this.fullCommentList = [];
					this.queryProductComment({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						spuId: this.spuId,
						type: 0
					},true)
				}
			},
			
			// 查询服务详情
			queryProductDetails (id) {
				this.showLoadingHint = true;
				getProductDetails({
					id
				}).then((res) => {
					if ( res && res.data.code == 0) {
						this.productDetailsMessage = res.data.data;
						this.productDetailsMessage.price = fenToYuan(this.productDetailsMessage.price);
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
					this.queryProductComment({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						spuId: this.spuId,
						type: 0
					},false)
				}
			},
			
			// 收藏/取消收藏服务事件
			collectProductEvent () {
				if (this.isProductFavorite) {
					this.cancelProductCollectEvent()
				} else {
					this.createProductFavoriteEvent()
				}
			},
			
			// 校验商品是否收藏
			examineProductFavoriteEvent(data) {
				this.isVerifyProductFavoriteComplete = false;
				examineProductFavorite(data).then((res) => {
					this.isVerifyProductFavoriteComplete = true;
					if ( res && res.data.code == 0) {
						this.isProductFavorite = res.data.data
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 创建商品收藏
			createProductFavoriteEvent() {
				this.showLoadingHint = true;
				this.infoText = '收藏中···';
				createProductFavorite({spuId: this.spuId }).then((res) => {
					if ( res && res.data.code == 0) {
						this.isProductFavorite = true
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
				deleteProductFavorite({spuId: this.spuId }).then((res) => {
					if ( res && res.data.code == 0) {
						this.isProductFavorite = false
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
			
			// 查询服务评价
			queryProductComment(data,flag) {
				this.commentList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getProductComment(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.commentList = res.data.data.list;
						if (res.data.data.list.length == 0) {
							this.isShowNoHomeNoData = true;
						} else {
							this.commentList.forEach((item) => {
								item['rateValue'] = Math.floor(item.commentScore/item.commentCount)
							})
						};
						this.fullCommentList = this.fullCommentList.concat(this.commentList);
						if (this.fullCommentList.length == 0) {
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
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 预约服务事件
			appointmentServiceEvent () {
				// 传递服务信息
				let mynavData = JSON.stringify(this.productDetailsMessage);
				uni.navigateTo({
					url: '/servicePackage/pages/reservationServiceList/reservationServiceList?transmitData='+mynavData
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
		.service-details-content {
			width: 100%;
			overflow: auto;
			padding-bottom: 80px;
			box-sizing: border-box;
			.service-details-top {
				.service-image {
					position: relative;
					height: 391px;
					width: 100%;
					>image {
						width: 100%;
						height: 100%
					};
					.rate-box {
						position: absolute;
						bottom: 10px;
						left: 20px
					}
				};
				.service-price-message {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20px 10px;
					box-sizing: border-box;
					background: #fff;
					.service-name {
						flex: 1;
						word-break: break-all;
						padding-right: 10px;
						box-sizing: border-box;
						>text {
							font-size: 18px;
							color: #101010
						}
					};
					.service-price {
						>text {
							font-size: 18px;
							color: #E86F50
						}
					}
				}
			};
			.service-details-bottom {
				padding: 10px 0;
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
				.service-details-box {
					.title-area {
						height: 40px;
						line-height: 40px;
						padding-left: 6px;
						box-sizing: border-box;
						>text {
							font-size: 14px;
							color: #999999
						}
					};
					.service-content-area {
						background: #fff;
						padding: 10px 10px 20px 10px;
						box-sizing: border-box;
						.service-goal {
							>view {
								&:first-child {
									margin-bottom: 10px;
									>text {
										font-size: 14px;
										color: #F16C8C
									}
								};
								&:last-child {
									>text {
										font-size: 14px;
										color: #101010
									}
								}
							}
						};
						.service-entry {
							margin: 15px 0;
							>view {
								&:first-child {
									margin-bottom: 10px;
									>text {
										font-size: 14px;
										color: #F16C8C
									}
								};
								&:last-child {
									>text {
										display: block;
										font-size: 14px;
										color: #101010
									}
								}
							}
						};
						.apply-person {
							>view {
								&:first-child {
									margin-bottom: 10px;
									>text {
										font-size: 14px;
										color: #F16C8C
									}
								};
								&:last-child {
									>text {
										font-size: 14px;
										color: #101010
									}
								}
							}
						}
					}
				};
				.appointment-notice-box {
					.title-area {
						height: 40px;
						line-height: 40px;
						padding-left: 6px;
						box-sizing: border-box;
						>text {
							font-size: 14px;
							color: #999999
						}
					};
					.service-content-area {
						background: #fff;
						padding: 10px 10px 20px 10px;
						box-sizing: border-box;
						font-size: 14px;
						color: #101010
					}	
				};
				.user-evaluate-box {
					.title-area {
						height: 40px;
						line-height: 40px;
						padding-left: 6px;
						box-sizing: border-box;
						>text {
							font-size: 14px;
							color: #999999
						}
					};
					.service-content-area {
						background: #fff;
						padding: 10px 10px 20px 10px;
						box-sizing: border-box;
						max-height: 300px;
						min-height: 150px;
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
						.user-evaluate-list {
							display: flex;
							justify-content: space-between;
							padding: 10px 0;
							box-sizing: border-box;
							@include bottom-border-1px(#E5EBFF);
							.user-evaluate-list-left {
								flex: 1;
								>view {
									&:nth-child(2) {
										margin: 4px 0;
										>text {
											font-size: 14px;
											color: #101010;
											word-break: break-all
										}
									};
									&:nth-child(3) {
										>text {
											font-size: 12px;
											color: #BBBBBB;
											word-break: break-all;
											&:nth-child(1) {
												margin-right: 4px
											}
										}
									}
								}
							};
							.user-evaluate-list-right {
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								align-items: flex-end;
								>text {
									&:nth-child(1) {
										font-size: 12px;
										color: #FF698C;
									};
									&:nth-child(2) {
										font-size: 12px;
										color: #BBBBBB;
									}
								}
							}
						}
					}	
				}
			}
		};
		.appointment-btn-area {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 80px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f5f5f5;
			>text {
				width: 370px;
				height: 40px;
				text-align: center;
				line-height: 40px;
				background: #F16C8C;
				border-radius: 20px;
				font-size: 12px;
				color: #fff
			}
		}
	}
</style>
