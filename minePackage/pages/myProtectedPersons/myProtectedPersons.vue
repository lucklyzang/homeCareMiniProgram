<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<u-modal :show="modalShow" :title="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="被护人" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="protected-persons-box">
			<view class="image-box" v-if="isShowNoHomeNoData">
				<image :src="noProtectedPersonsPng"></image>
			</view>
			<scroll-view class="scroll-view" scroll-y="true"  v-if="!isShowNoHomeNoData" @scrolltolower="scrolltolower">
				<view class="protected-persons-list" v-for="(item,index) in fullServerPersonList" :key="index">
					<view class="protected-persons-top">
						<view class="protected-persons-top-left">
							<view class="person-message">
								<text>{{ item.name }}</text>
								<text>{{ item.sex == 0 ? '男' : '女' }}</text>
								<text>{{ `${item.age}岁` }}</text>
							</view>
							<view class="check-status">
								<text>已通过审核</text>
							</view>
						</view>
						<view class="protected-persons-top-right">
							<image :src="editBlackIconPng" @click="editServerPersonEvent(item)"></image>
							<image :src="deleteBlackIconPng" @click="deleteServerPersonEvent(item,index)"></image>
						</view>
					</view>
					<view class="protected-persons-center">
						<text v-if="item.realname == 'NO'" @click="realnameAuthenticationEvent">点击进行实名</text>
						<text v-else>已实名</text>
					</view>
					<view class="protected-persons-bottom">
						<view class="id-number">
							<text>身份证</text>
							<text>{{ item.idCard }}</text>
						</view>
						<view class="contact-way">
							<text>联系方式</text>
							<text>{{ item.mobile }}</text>
						</view>
						<view class="emergency-contact">
							<text>紧急联系人</text>
							<text>{{ item.critical }}</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-show="fullServerPersonList.length > 0" />
			</scroll-view>
		</view>
		<view class="add-btn">
			<text @click="addProtectedPersonsEvent">新增被护人</text>
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
	import { getServerPerson, deleteServerPerson } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				count: 1,
				value: 1,
				modalShow: false,
				modalContent: '',
				selectServerPersonId: '',
				selectServerPersonIndex: '',
				currentPageNum: 1,
				pageSize: 30,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				noProtectedPersonsPng: require("@/static/img/no-protected-persons.png"),
				editBlackIconPng: require("@/static/img/edit-black-icon.png"),
				deleteBlackIconPng: require("@/static/img/delete-black-icon.png"),
				infoText: '加载中',
				checked: ['1'],
				serverPersonList: [],
				fullServerPersonList: []
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
		onShow() {
			this.fullServerPersonList = [];
			this.queryUserServerPersonList({
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
			
			checkboxChange(n) {
				console.log('change', n);
			},
			
			// 实名认证事件
			realnameAuthenticationEvent () {
				
			},
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryUserServerPersonList({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize
						// userId: this.userInfo.userId
					},false)
				}
			},
			
			// 查询被服务人列表
			queryUserServerPersonList(data,flag) {
				this.serverPersonList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getServerPerson(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.serverPersonList = res.data.data.list;
						this.fullServerPersonList = this.fullServerPersonList.concat(this.serverPersonList);
						if (this.fullServerPersonList.length == 0) {
							this.isShowNoHomeNoData = true
						} else {
							this.isShowNoHomeNoData = false
						};
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
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
			
			// 删除被护人事件
			deleteServerPersonEvent (item,index) {
				this.selectServerPersonId = item.id;
				this.selectServerPersonIndex = index;
				this.modalShow = true;
				this.modalContent = '确认删除该被护人?'
			},
			
			// 编辑被护人事件
			editServerPersonEvent (item) {
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/minePackage/pages/editProtectedPersons/editProtectedPersons?transmitData='+mynavData
				})
			},
			
			// 是否删除被护人弹框确定事件
			sureCancel () {
				this.showLoadingHint = true;
				this.modalContent = '';
				this.modalShow = false;
				deleteServerPerson({
					id: this.selectServerPersonId
				}).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '删除被护人成功!',
							type: 'success',
							position: 'bottom'
						});
						this.fullServerPersonList.splice(this.selectServerPersonIndex,1);
						if (this.fullServerPersonList.length == 0) {
							this.isShowNoHomeNoData = true;
						};
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
			
			// 是否删除被护人弹框取消事件
			cancelSure () {
				this.modalShow = false
			},
			
			// 添加被护人事件
			addProtectedPersonsEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/addProtectedPersons/addProtectedPersons'
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
		background: #f1f1f1;
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
		.protected-persons-box {
			flex: 1;
			overflow: auto;
			padding: 10px 6px;
			box-sizing: border-box;
			.scroll-view {
				height: 100%
			};
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
			.protected-persons-list {
				padding: 10px;
				box-shadow: 0px 2px 6px 0 rgba(137, 140, 140, 0.61);
				box-sizing: border-box;
				border: 1px solid #BBBBBB;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 10px;
				.protected-persons-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.protected-persons-top-left {
						flex: 1;
						width: 0;
						display: flex;
						align-items: center;
						.person-message {
							>text {
								&:nth-child(1) {
									font-size: 18px;
									color: #101010
								};
								&:nth-child(2) {
									font-size: 14px;
									color: #101010;
									margin: 0 6px
								};
								&:nth-child(3) {
									font-size: 14px;
									color: #101010
								}
							}
						};
						.check-status {
							height: 20px;
							line-height: 20px;
							padding: 0 10px;
							box-sizing: border-box;
							background: rgba(147, 210, 243, 0.29);
							border-radius: 3px;
							font-size: 12px;
							color: #289E8E;
							margin-left: 10px;
							margin-top: 4px;
						}
					};
					.protected-persons-top-right {
						>image {
							width: 24px;
							height: 32px;
							&:first-child {
								margin-right: 10px
							}
						}
					}
				};
				.protected-persons-center {
					>text {
						display: inline-block;
						height: 20px;
						margin: 10px 0;
						line-height: 20px;
						padding: 0 10px;
						box-sizing: border-box;
						background: rgba(147, 210, 243, 0.29);
						font-size: 14px;
						color: #4095E5;
						margin-top: 4px
					}
				};
				.protected-persons-bottom {
					>view {
						&:nth-child(2) {
							margin: 10px 0;
						};
						display: flex;
						justify-content: space-between;
						>text {
							&:nth-child(1) {
								font-size: 14px;
								color: #757575;
							};
							&:nth-child(2) {
								flex: 1;
								text-align: right
							}
						}
					}
				}
			}
		};
		.add-btn {
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			>text {
				width: 94%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				font-size: 18px;
				color: #FFFFFF;
				background: #F16C8C;
				border-radius: 10px;
			}
		}
	}
</style>
