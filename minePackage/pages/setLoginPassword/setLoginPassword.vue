<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="登录密码设置" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="set-center-content">
			<view class="new-password">
				<u--input
					placeholder="输入新的密码"
					border="none"
					@change="newPasswordChangeEvent"
					v-model="passwordValue"
					type="password"
					clearable
				></u--input>
			</view>
			<view class="new-password again-new-password">
				<u--input
					placeholder="再次确认新的密码"
					border="none"
					@change="againPasswordChangeEvent"
					v-model="againPasswordValue"
					type="password"
					clearable
				></u--input>
			</view>
			<view class="password-rule">
				密码长度为6-20位,需包含大小写英文字母、数字、特殊字符。
			</view>
		</view>
		<view class="bottom-btn-area">
			<view class="sure-btn" :class="{'sureBtnStyle': !passwordValueCorrect || !againPasswordValueCorrect || showLoadingHint}" @click="completeSetPasswordEvent">
				<text>{{ showLoadingHint ? '设置中···' : '完成' }}</text>
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
	import { updateUserMessage } from '@/api/user.js'
	import { setPassword } from '@/api/login.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				passwordValue: '',
				againPasswordValue: '',
				passwordValueCorrect: false,
				againPasswordValueCorrect: false
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
		},
		onReady() {
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 新密码输入框值改变事件
			newPasswordChangeEvent (value) {
				let regexWidthCharRange = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[`~!@#$%^&*()_\-+=<>.?:"{}].*).{6,20}$/;
				if (regexWidthCharRange.test(value)) {
					if (this.passwordValue === this.againPasswordValue) {
						this.passwordValueCorrect = true;
						this.againPasswordValueCorrect = true;
					} else {
						this.passwordValueCorrect = false
					}	
				} else {
					this.passwordValueCorrect = false
				}
			},
			
			// 再次密码输入框值改变事件
			againPasswordChangeEvent (value) {
				let regexWidthCharRange = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[`~!@#$%^&*()_\-+=<>.?:"{}].*).{6,20}$/;
				if (regexWidthCharRange.test(value)) {
					if (this.passwordValue === this.againPasswordValue) {
						this.againPasswordValueCorrect = true;
						this.passwordValueCorrect = true;
					} else {
						this.againPasswordValueCorrect = false
					}
				} else {
					this.againPasswordValueCorrect = false
				}
			},
			
			// 密码过滤空格函数
			formatter(value) {
				return value.replace(/^\s+|\s+$/g, '')
			},
			
			// 设置密码事件
			completeSetPasswordEvent () {
				let regexWidthCharRange = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[`~!@#$%^&*()_\-+=<>.?:"{}].*).{6,20}$/; 
				if (this.passwordValue === '' || this.againPasswordValue === '') {
					this.$refs.uToast.show({
						message: '密码不能为空!',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (this.passwordValue.length  < 6 || this.againPasswordValue.length < 6) {
					this.$refs.uToast.show({
						message: '密码不低于6位数!',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (this.passwordValue.length > 20 || this.againPasswordValue.length > 20) {
					this.$refs.uToast.show({
						message: '密码不超过20位数!',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!regexWidthCharRange.test(this.passwordValue) || !regexWidthCharRange.test(this.againPasswordValue)) {
					this.$refs.uToast.show({
						message: '密码不符合要求!',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (this.passwordValue !== this.againPasswordValue) {
					this.$refs.uToast.show({
						message: '两次输入不一致!',
						type: 'error',
						position: 'center'
					});
					return;
				};
				this.setLoginPasswordPort();
			},
			
			// 设置密码接口
			setLoginPasswordPort () {
				this.showLoadingHint = true;
				let loginMessage = {
					password: this.passwordValue
				};
				setPassword(loginMessage).then((res) => {
					if ( res && (res.data.code == 0 || res.data.code == 401) ) {
						this.$refs.uToast.show({
							message: '密码设置成功!',
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
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'success',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'success',
						position: 'bottom'
					})
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
		::v-deep .u-popup {
			flex: none !important
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
				.header_content {
					align-items: center !important;
					.header_title_center {
						left: 350rpx !important;
						color: #101010 !important;
						text {
							color: #101010 !important;
						}
					}
				}
			}
		};
		.set-center-content {
			flex: 1;
			overflow: auto;
			padding: 20px;
			box-sizing: border-box;
			.new-password {
				::v-deep .u-input {
					background: #fff;
					height: 34px;
					padding: 0 4px !important;
					box-sizing: border-box;
				}
			};
			.again-new-password {
				margin-top: 20px;
				::v-deep .u-input {
					background: #fff;
					height: 34px;
					padding: 0 4px !important;
					box-sizing: border-box;
				}
			};
			.password-rule {
				margin-top: 10px;
				font-size: 12px;
				color: #c0c0c0;
				word-break: break-all;
				text-align: center;
			}
		};
		.bottom-btn-area {
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			.sure-btn {
				width: 80%;
				border-radius: 4px;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 42px;
				background: #FC4579;
				font-size: 14px;
				color: #fff
			};
			.sureBtnStyle {
				opacity: .6
			}
		}
	}
</style>
