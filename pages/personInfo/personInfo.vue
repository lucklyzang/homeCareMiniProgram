<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 我的客服弹框 -->
		<view class="support-staff-box">
			<u-popup :show="showSupportStaffBox" :closeable="true" mode="center"  @close="closeSupportStaffBox">
				<view class="support-staff-content">
					<view class="support-staff-top">
							<image src="@/static/img/support-staff.png"></image>
							<text>服务电话</text>
							<text>409-5646-89893434</text>
					</view>
					<view class="support-staff-bottom">
						<view class="support-staff-left">
							<image src="@/static/img/message.png"></image>
							<button open-type="contact" bindcontact="handleContact" session-from="sessionFrom">发送消息</button>
						</view>
						<view class="support-staff-right">
							<image src="@/static/img/phone.png"></image>
							<text>拨打电话</text>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="个人中心">
				</nav-bar> 
			</view>
			<image :src="loginBackgroundPng"></image>
			<view class="user-info">
				<view class="user-photo" @click="enterPersonMessagePageEvent">
					<image :src="personPhotoSource"></image>
				</view>
				<view class="user-nickname" @click="enterPersonMessagePageEvent">
					<text>{{ niceNameValue }}</text>
				</view>
			</view>
			<view class="center-area-box">
				<view v-for="(item,index) in functionList" :key="index">
					<image :src="item.iconImg"></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view class="bottom-area-box">
			<view v-for="(item,index) in bottomFunctionList" :key="index" @click="bottomFunctionClickEvent(item.name)">
				<view class="function-item-left">
					<image :src="item.iconImg"></image>
					<text>{{ item.name }}</text>
				</view>
				<view class="function-item-right">
					<u-icon name="arrow-right" color="#CCCCCC" size="20"></u-icon>
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
	import { getUserMessage } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '',
				showLoadingHint: false,
				showSupportStaffBox: false,
				personPhotoSource: '',
				niceNameValue: '张三',
				functionList: [
					{
						name: '守望家',
						iconImg: require("@/static/img/logo-ellipse-icon.png")
					},
					{
						name: '全屋适老化改造',
						iconImg: require("@/static/img/house-reconstruction.png")
					},
					{
						name: '慢病管理',
						iconImg: require("@/static/img/chronic-care-management.png")
					}
				],
				bottomFunctionList: [
					{
						name: '我的地址',
						iconImg: require("@/static/img/my-location.png")
					},
					{
						name: '我的被护人',
						iconImg: require("@/static/img/my-be-escorted-person.png")
					},
					{
						name: '我的医护',
						iconImg: require("@/static/img/my-medic.png")
					},
					{
						name: '初步评估单管理',
						iconImg: require("@/static/img/evaluation-form-management.png")
					},
					{
						name: '收藏',
						iconImg: require("@/static/img/my-collect.png")
					},
					{
						name: '客服',
						iconImg: require("@/static/img/my-service.png")
					},
					{
						name: '相关协议',
						iconImg: require("@/static/img/related-agreement.png")
					}
				]
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			},
			depName() {
			},
			accountName() {
			}
		},
		onShow() {
			// 初次进入该页面时，查询用户基本信息
			if (!this.userBasicInfo || JSON.stringify(this.userBasicInfo) == '{}') {
				this.queryUserBasicMessage()
			} else {
				this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
				this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname
			}
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 头像和昵称点击事件
			enterPersonMessagePageEvent () {
				// uni.navigateTo({
				// 	url: '/minePackage/pages/personalData/personalData'
				// })
			},
			
			// 获取用户基本信息
			queryUserBasicMessage () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				getUserMessage().then((res) => {
					if ( res && res.data.code == 0) {
						this.changeUserBasicInfo(res.data.data);
						this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng :  this.userBasicInfo.avatar;
						this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}	
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			//客服弹框关闭事件
			closeSupportStaffBox () {
				this.showSupportStaffBox = false
			},
			
			//底部功能区点击事件
			bottomFunctionClickEvent (name) {
				if (name == '我的医护') {
					uni.navigateTo({
						url: '/minePackage/pages/myNurse/myNurse'
					})
				} else if (name == '收藏') {
					uni.navigateTo({
						url: '/minePackage/pages/myCollect/myCollect'
					})
				} else if (name == '我的地址') {
					uni.navigateTo({
						url: '/minePackage/pages/addressManagement/addressManagement'
					})
				} else if (name == '相关协议') {
					uni.navigateTo({
						url: '/minePackage/pages/aboutAgreement/aboutAgreement'
					})
				} else if (name == '我的被护人') {
					uni.navigateTo({
						url: '/minePackage/pages/myProtectedPersons/myProtectedPersons'
					})
				} else if (name == '初步评估单管理') {
					uni.navigateTo({
						url: '/minePackage/pages/mine/index/index'
					})
				} else if (name == '客服') {
					this.showSupportStaffBox = true
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
		::v-deep .u-popup {
			.u-popup__content {
				width: 90%;
				padding: 30px 10px 20px 10px;
				box-sizing: border-box;
				border-radius: 14px;
				.u-popup__content__close {
					.u-icon__icon {
						color: #101010 !important
					}
				};
				.support-staff-content {
					.support-staff-top {
						display: flex;
						flex-direction: column;
						align-items: center;
						>image {
							width: 106px;
							height: 129px
						};
						>text {
							font-size: 18px;
							color: #101010;
							&:nth-of-type(1) {
								margin: 10px 0;
							}
						}
					};
					.support-staff-bottom {
						display: flex;
						margin-top: 20px;
						.support-staff-left {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 24px;
								height: 24px;
								margin-bottom: 6px
							};
							uni-button {
								height: 20px;
								line-height: 20px;
								background: #fff;
								image {
								  width: 24px;
									height: 24px
								}
							};
							uni-button:after {
								border: none
							};
							button {
								height: 20px;
								line-height: 20px;
								background: #fff;
								font-size: 14px;
								color: #4E9FD5;
							};
							button:after {
								border: none
							}
						};
						.support-staff-right {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 24px;
								height: 24px;
								margin-bottom: 6px
							};
							>text {
								font-size: 14px;
								color: #4E9FD5
							}
						}
					}
				}
			}
		};
		.top-area-box {
			position: relative;
			width: 100%;
			height: 290px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				.header_title_center {
					color: #fff !important;
					text {
						color: #fff !important;
					}
				}
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 230px
			};
			.user-info {
				width: 100%;
				height: 230px;
				display: flex;
				align-items: center;
				color: #fff;
				font-size: 20px;
				padding-left: 10px;
				box-sizing: border-box;
				.user-photo {
					width: 70px;
					height: 70px;
					background: #fff;
					margin: 0 15px;
					border-radius: 50%;
					z-index:1;
					image {
						width: 70px;
						height: 70px;
						border-radius: 50%;
					}
				}
			};
			.user-nickname {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				padding-right: 10px;
				box-sizing: border-box;
				z-index: 1;
				font-size: 16px;
				color: #FFFFFF;
				font-weight: 400;
				@include no-wrap;
				>text {
					@include no-wrap;
				}
			};
			.center-area-box {
				width: 94%;
				position: absolute;
				left: 3%;
				top: 170px;
				height: 110px;
				background: #FFFFFF;
				box-shadow: 0 4px 20px 0 rgba(0,0,0,0.08);
				border-radius: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				>view {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					>image {
						width: 45px;
						height: 45px;
						margin-bottom: 10px
					};
					>text {
						font-size: 13px;
						color: #333333;
						font-weight: 400;
					}
				}
			}
		};
		.bottom-area-box {
			width: 94%;
			margin: 0 auto;
			margin-top: 6px;
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: auto;
			>view {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 50px;
				position: relative;
				@include bottom-border-1px(#DCDCDC);
				.function-item-left {
					>image {
						width: 20px;
						height: 20px;
						margin-right: 6px;
						vertical-align: middle
					};
					>text {
						font-size: 14px;
						color: #333333;
						font-weight: 400;
						vertical-align: middle
					}
				};
				.function-item-right {
					
				}
			}
		}
	}
</style>
