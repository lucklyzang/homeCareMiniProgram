<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="用户评价" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="user-evaluate-box">
			<u-empty text="暂无评价" v-if="isShowNoHomeNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">	
				<view class="user-evaluate-list" v-for="(item,index) in fullCommentList" :key="index">
					<view class="user-puoto">
						<u-image shape="circle" width="50" height="50" :src="!item.userAvatar ? defaultPersonPhotoIconPng : item.userAvatar "></u-image>
					</view>
					<view class="user-evaluate-list-left">
						<view class="user-evaluate-list-top">
							<view>
								<text>{{ item.content }}</text>
							</view>
							<view>
								<text>{{ !item.userNickname ? '匿名用户' :  item.userNickname }}</text>
								<text>{{ getNowFormatDate(new Date(item.createTime),4) }}</text>
							</view>
						</view>
						<view class="user-evaluate-list-bottom">
							<view>
								<u-rate :count="item.scores" activeColor="#F9B128" v-model="item.scores" readonly></u-rate>
								<text>{{ item.scores == 0 || !item.scores ? '0.0' : item.scores.toFixed(1)  }}</text>
							</view>
							<view>
								<text>{{ item.spuName }}</text>
							</view>
						</view>
					</view>	
				</view>
				<u-loadmore :status="status" v-if="fullCommentList.length > 0" />
			</scroll-view>
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
	import { getProductComment } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				commentList: [],
				fullCommentList: [],
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '加载中···'
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
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryAddress = JSON.parse(options.transmitData);
			this.queryProductComment({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize,
				careId: temporaryAddress.id,
				type: 0
			},true)
		},
		methods: {
			...mapMutations([
			]),
			
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
						careId: temporaryAddress.id,
						type: 0
					},false)
				}
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
						title: err.message,
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
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
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
		.user-evaluate-box {
			flex: 1;
			width: 98%;
			margin: 0 auto;
			padding: 10px 10px 20px 10px;
			box-sizing: border-box;
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
			 .user-puoto {
			 	display: flex;
			 	align-items: center;
			 	margin-right: 10px;
			 };
			.user-evaluate-list {
				display: flex;
				justify-content: space-between;
				padding: 10px;
				box-sizing: border-box;
				background: #fff;
				@include bottom-border-1px(#d9dbe3);
				.user-evaluate-list-left {
					flex: 1;
					.user-evaluate-list-top {
						padding: 8px;
						box-sizing: border-box;
						background: #fbfbfb;
						>view {
							&:nth-child(1) {
								font-size: 15px;
								color: #333333;
								font-weight: 400;
								word-break: break-all;
							};
							&:nth-child(2) {
								margin: 4px 0;
								display: flex;
								justify-content: space-between;
								align-items: center;
								>text {
									display: inline-block;
									font-size: 11px;
									color: #999999;
									font-weight: 400;
									&:nth-child(1) {
										flex: 1;
										@include no-wrap;
										padding-right: 8px;
										box-sizing: border-box;
									}
								}
							}
						}
					};
					.user-evaluate-list-bottom {
						height: 40px;
						display: flex;
						justify-content: space-between;
						align-items: center;
						>view {
							&:nth-child(1) {
								flex: 1;
								display: flex;
								align-items: center;
								::v-deep .u-rate {
									margin-right: 4px;
								};
								>text {
									font-size: 12px;
									color: #BBBBBB;
								}
							};
							&:nth-child(2) {
								>text {
									font-size: 11px;
									color: #fff;
									display: inline-block;
									font-weight: 600;
									padding: 3px 6px;
									box-sizing: border-box;
									background: #FEB8B7;
									border-radius: 3px;
								}
							}
						}
					}
				}	
			}
		}
	}
</style>
