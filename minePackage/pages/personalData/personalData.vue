<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="modalShow" :title="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure" cancelColor="#747679" confirmColor="#FC4579">
		</u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="个人资料" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="personal-photo">
			<image :src="personPhotoSource"></image>
			<view class="change-avatar" @click="getImg">
				<text>更换头像</text>
			</view>
		</view>
		<view class="set-center-content">
			<view class="update-phone-number" @click="updateNickNameEvent">
				<view class="update-phone-number-left">
					<text>昵称</text>
				</view>
				<view class="update-phone-number-right">
					<text>{{ niceNameValue }}</text>
					<u-icon name="arrow-right" color="#000000" size="18"></u-icon>
				</view>
			</view>
			<view class="update-phone-number" @click="updatePhoneNumberEvent">
				<view class="update-phone-number-left">
					<text>绑定号码</text>
				</view>
				<view class="update-phone-number-right">
					<text>{{ phoneNumberValue }}</text>
					<u-icon name="arrow-right" color="#000000" size="18"></u-icon>
				</view>
			</view>
			<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>清除缓存</text>
				</view>
				<view class="weixin-binding-right">
					<text>{{ `${currentSize}M` }}</text>
					<text @click="clearCacheEvent">清除缓存</text>
				</view>
			</view>
		</view>
		<view class="quit-login-btn-box">
			<view class="quit-login-btn" @click="logOutEvent" :class="{'quitLoginBtnStyle' : showLoadingHint }">
				<text> {{ showLoadingHint && !infoText ? '登出中···' : '退出登录' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import store from '@/store'
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { userSignOut } from '@/api/login.js'
	import { updateUserMessage } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				modalShow: false,
				niceNameValue: '',
				phoneNumberValue: '',
				modalContent: '',
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				personPhotoSource: '',
				personPhotoFile: '',
				photoImageOnlinePath: '',
				currentSize: ''
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
		onShow() {
			this.getStorageInfoSyncEvent();
			this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
			this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname;
			this.phoneNumberValue = !this.userBasicInfo || JSON.stringify(this.userBasicInfo) == '{}' ? '' : this.userBasicInfo.mobile;
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 顶部导航返回事件
			backTo () {
				this.changeUserBasicInfo({});
				uni.navigateBack()
			},
			
			// 获取应用缓存大小事件
			getStorageInfoSyncEvent () {
				this.currentSize = uni.getStorageInfoSync()['currentSize']/1000
			},
			
			// 清除缓存事件
			clearCacheEvent () {
				uni.showLoading({
				  title: '正在清除缓存'
				});
				uni.clearStorageSync();
				uni.hideLoading();
				uni.showToast({
				  title: '缓存已清除',
				  icon: 'success'
				});
				this.getStorageInfoSyncEvent()
			},
			
			// 上传图片方法
			getImg() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							let url = res.tempFiles[imgI].path;
							//获取最后一个的位置
							let index = url.lastIndexOf(".");
							//获取后缀
							let jpgUrl = url.substr(index + 1);
							if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
								that.$refs.uToast.show({
									message: '只可上传jpg或png格式的图片!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							let isLt2M = res.tempFiles[imgI].size/1024/1024 < 5;
							if (!isLt2M) {
								that.$refs.uToast.show({
									message: '图片必须小于5MB!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							that.personPhotoFile = res.tempFiles[imgI]['path'];
							that.uploadFileEvent(that.personPhotoFile);
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.personPhotoBase64 = base64;
									that.personPhotoSource = that.personPhotoBase64;
								}
							})
						}
					}
				})
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				uni.uploadFile({
				 url: 'https://dev.nurse.blinktech.cn/nurse/app-api/infra/file/upload',
				 filePath: imgI,
				 name: 'file',
				 header: {
					'content-type': 'multipart/form-data',
					'Authorization': `Bearer ${store.getters.token}`
				 },
				 success: (res) => {
					if (res.statusCode == 200) {
						let temporaryData = JSON.parse(res.data);
						this.photoImageOnlinePath = temporaryData.data;
						this.personPhotoSource = this.photoImageOnlinePath;
						this.updateUserMessageEvent({
							avatar: this.photoImageOnlinePath
						})
					} else {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: '上传图片失败',
							type: 'error',
							position: 'center'
						})
					}
				 },
				 fail: (err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.errMsg,
						type: 'error',
						duration: 5000,
						position: 'center'
					})
				 }
				})
			},
			
			// 修改用户头像事件
			updateUserMessageEvent (data) {
				this.infoText = '头像更换中···';
				this.showLoadingHint = true;
				updateUserMessage(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '修改头像成功',
							type: 'success',
							position: 'center'
						});
						let temporaryUserBasicInfo = this.userBasicInfo;
						temporaryUserBasicInfo['avatar'] = this.photoImageOnlinePath;
						this.changeUserBasicInfo(temporaryUserBasicInfo)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false
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
			
			// 退出登录事件
			logOutEvent () {
				this.modalShow = true;
				this.modalContent = '是否确定退出登录?'
			},
			
			// 是否退出登录弹框确定事件
			sureCancel () {
				this.modalContent = '';
				this.modalShow = false;
				this.infoText = '';
				this.showLoadingHint = true;
				userSignOut().then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '退出登录成功!',
							type: 'success',
							position: 'bottom'
						});
						// 清空store和localStorage
						this.$store.dispatch('resetLoginState');
						removeAllLocalStorage();
						uni.redirectTo({
							url: '/pages/login/login'
						})
					} else {
					 this.modalShow = true;
					 this.modalContent = res.data.msg
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = `${err.message}`
				})
			},
			
			// 是否退出登录弹框取消事件
			cancelSure () {
				this.modalShow = false
			},
			
			// 修改昵称事件
			updateNickNameEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/setNickName/setNickName'
				})
			},
			
			// 更换绑定手机号事件
			updatePhoneNumberEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/updatePhoneOldCode/updatePhoneOldCode'
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
		background: #fff;
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
		.personal-photo {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.change-avatar {
				margin-top: 20px;
				width: 90px;
				height: 32px;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #FC4579;
				font-size: 14px;
				color: #FC4579
			};
			image {
				width: 77px;
				height: 77px;
				border-radius: 50%;
			}
		};
		.set-center-content {
			flex: 1;
			overflow: auto;
			padding: 20px 10px 10px 10px;
			box-sizing: border-box;
			.update-phone-number {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 60px;
				@include bottom-border-1px(#F7F7F7);
				.update-phone-number-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 14px;
					color: #000000
				};
				.update-phone-number-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						font-size: 14px;
						color: #000000;
						margin-right: 6px;
					}
				}
			};
			.weixin-binding {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 60px;
				@include bottom-border-1px(#F7F7F7);
				.weixin-binding-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 14px;
					color: #000000
				};
				.weixin-binding-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						&:nth-child(1) {
							font-size: 14px;
							color: #000000;
							margin-right: 6px;
						};
						&:nth-child(2) {
							font-size: 12px;
							color: #ffffff;
							display: inline-block;
							width: 65px;
							height: 24px;
							text-align: center;
							line-height: 24px;
							background: #FC4579;
							border-radius: 4px;
						}
					}
				}
			}
		};
		.quit-login-btn-box {
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			.quit-login-btn {
				width: 70%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 46px;
				border: 1px solid #FC4579;
				border-radius: 8px;
				font-size: 14px;
				color: #FC4579;
			};
			.quitLoginBtnStyle {
				opacity: 0.5;
			}
		}
	}
</style>
