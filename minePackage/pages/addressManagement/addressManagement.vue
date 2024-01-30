<template>
	<view class="content-box">
		<u-modal :show="modalShow" :title="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="地址管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="address-list-box">
			<view class="image-box" v-if="isEmpty">
				<image :src="noAddressManagementPng"></image>
			</view>
			<view v-else class="address-list" v-for="(item,index) in addressList" :key="index" @click="chooseAddressEvent(item)">
				<view class="address-list-top">
					<view class="site">
						<image :src="addressBlackIconPng"></image>
						<text>地址:</text>
						<text>{{ item.address }}</text>
					</view>
					<view class="detail-site">
						<text>详细地址:</text>
						<text>{{ item.detailAddress }}</text>
					</view>
				</view>
				<view class="line"></view>
				<view class="address-list-bottom">
					<view class="list-bottom-left">
						<u-radio-group 
								v-model="item.defaultStatus"
								 @change="(n) => { checkboxChange(item,n) }"
								shape="circle">
							<u-radio activeColor="#11D183" size="18" iconSize="12" name="默认地址" label="默认地址"></u-radio>
						</u-radio-group>
					</view>
					<view class="list-bottom-right">
						<image :src="editBlackIconPng" @click.stop="editAddressEvent(item)"></image>
						<image :src="deleteBlackIconPng" @click.stop="deleteAddressEvent(item)"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="addSiteEvent">添加地址</text>
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
	import { getUserAddressList, deleteUserAddress, updateDefaultAddress } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				addressList: [],
				defaultStatus: '默认地址',
				isEmpty: false,
				modalShow: false,
				modalContent: '',
				beforePageRoute: '',
				selectServerAddressId: '',
				noAddressManagementPng: require("@/static/img/no-address-management.png"),
				addressBlackIconPng: require("@/static/img/address-black-icon.png"),
				editBlackIconPng: require("@/static/img/edit-black-icon.png"),
				deleteBlackIconPng: require("@/static/img/delete-black-icon.png")
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'serviceOrderFormSureChooseMessage',
				'editServiceOrderFormSureChooseMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			this.queryUserAddressList();
			let pages = getCurrentPages();//当前页
			this.beforePageRoute = pages[pages.length - 2].route;//上个页面路径
		},
		methods: {
			...mapMutations([
				'storeServiceOrderFormSureChooseMessage',
				'storeEditServiceOrderFormSureChooseMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			checkboxChange(item,n) {
				console.log('change', item,n);
				if (n == '默认地址') {
					this.updateUserDefaultAddress({
						userId: item.userId,
						areaId: item.areaId,
						address: item.address,
						detailAddress: item.detailAddress,
						defaultStatus: true,
						coordinate: "",
						id: item.id
					})
				}
			},
			
			// 更新用户默认地址
			updateUserDefaultAddress (data) {
				this.showLoadingHint = true;
				updateDefaultAddress(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '默认地址更新成功',
							type: 'success',
							position: 'center'
						});
						this.queryUserAddressList();
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 获取用户服务地址列表
			queryUserAddressList () {
				this.isEmpty = false;
				this.showLoadingHint = true;
				this.addressList = [];
				getUserAddressList({
					userId: this.userInfo.userId
				}).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							this.isEmpty = false;
							this.addressList = res.data.data;
							this.addressList.forEach((item) => {
								item.defaultStatus = item.defaultStatus == false ? '' : '默认地址';
							})
						} else {
							this.isEmpty = true
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
			
			// 编辑地址事件
			editAddressEvent (item) {
				// 传递服务地址信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/minePackage/pages/editAddress/editAddress?transmitData='+mynavData
				})
			},
			
			// 删除地址事件
			deleteAddressEvent (item) {
				this.selectServerAddressId = item.id;
				this.modalShow = true;
				this.modalContent = '确认删除该地址?'
			},
			
			// 是否删除地址弹框确定事件
			sureCancel () {
				this.showLoadingHint = true;
				this.modalContent = '';
				this.modalShow = false;
				deleteUserAddress({
					id: this.selectServerAddressId
				}).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '删除地址成功!',
							type: 'success',
							position: 'bottom'
						});
						this.queryUserAddressList()
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
			
			// 是否删除地址弹框取消事件
			cancelSure () {
				this.modalShow = false
			},
			
			// 选择地址事件
			chooseAddressEvent (item) {
				// 传递地址信息
				if (this.beforePageRoute == 'pages/personInfo/personInfo') {
					return
				};
				if (this.beforePageRoute == 'orderFormPackage/pages/orderFormEdit/orderFormEdit') {
					let tmporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
					tmporaryEditServiceOrderFormSureChooseMessage['chooseAddressMessage'] = item;
					this.storeEditServiceOrderFormSureChooseMessage(tmporaryEditServiceOrderFormSureChooseMessage);
				} else {
					let tmporaryServiceOrderFormSureChooseMessage = this.serviceOrderFormSureChooseMessage;
					tmporaryServiceOrderFormSureChooseMessage['chooseAddressMessage'] = item;
					this.storeServiceOrderFormSureChooseMessage(tmporaryServiceOrderFormSureChooseMessage)
				};
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 添加地址事件
			addSiteEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/addAddress/addAddress'
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
		.address-list-box {
			flex: 1;
			overflow: auto;
			padding: 10px 6px;
			box-sizing: border-box;
			.image-box {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				>image {
					width: 348px;
					height: 348px
				}
			};
			.address-list {
				padding: 10px 0 0 0;
				box-sizing: border-box;
				border: 1px solid #BBBBBB;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 10px;
				.address-list-top {
					padding: 0 6px;
					box-sizing: border-box;
					.site {
						word-break: break-all;
						>image {
							width: 24px;
							height: 32px;
							vertical-align: middle;
							margin-right: 4px;
						};
						>text {
							font-size: 14px;
							color: #101010;
							&:nth-of-type(1) {
								margin-right: 6px
							}
						}
					};
					.detail-site {
						padding-left: 28px;
						box-sizing: border-box;
						word-break: break-all;
						margin-bottom: 8px;
						>text {
							font-size: 14px;
							color: #101010;
							&:nth-child(1) {
								margin-right: 6px
							}
						}
					}
				};
				.line {
					width: 99%;
					height: 1px;
					background: #C8C8C8;
					margin: 0 auto;
				};
				.address-list-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 40px;
					padding: 0 6px;
					box-sizing: border-box;
					.list-bottom-left {
						display: flex;
						::v-deep .u-radio-group {
							.u-radio {
								.u-radio__text {
									font-size: 14px !important;
									color: #686868 !important;
								}
							}
						}
					};
					.list-bottom-right {
						display: flex;
						>image {
							width: 24px;
							height: 32px;
							&:nth-child(1) {
								margin-right: 10px
							}
						}
					}
				}
			};
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
