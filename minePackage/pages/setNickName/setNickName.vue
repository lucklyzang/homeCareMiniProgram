<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="设置昵称" @backClick="backTo">
					<template #right>
						<view @click="setNickNameEvent">
							<text>完成</text>
						</view>
					</template>
				</nav-bar> 
		  </view>
		</view>
		<view class="set-center-content">
			<view class="nick-name-box">
				 <u--input
				    placeholder="请输入昵称"
						clearable
						type="text"
						border="none"
				    v-model="niceNameValue"
				  ></u--input>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				niceNameValue: ''
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
			this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 设置昵称事件
			setNickNameEvent () {
				if (this.niceNameValue === '') {
					this.$refs.uToast.show({
						message: '昵称不能为空!',
						type: 'error',
						position: 'center'
					});
					return
				};
				this.updateUserMessageEvent({
					nickname: this.niceNameValue
				})
			},
			
			// 修改用户头像事件
			updateUserMessageEvent (data) {
				this.infoText = '昵称设置中···';
				this.showLoadingHint = true;
				updateUserMessage(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '修改昵称成功',
							type: 'success',
							position: 'center'
						});
						let temporaryUserBasicInfo = this.userBasicInfo;
						temporaryUserBasicInfo['nickname'] = this.niceNameValue;
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
			background: #f5f5f5;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #f5f5f5;
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
					};
					.header_right_info {
						width: 58px;
						height: 32px;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #FC4579;
						border-radius: 4px;
						font-size: 14px;
						color: #fff;
					}
				}
			}
		};
		.set-center-content {
			flex: 1;
			overflow: auto;
			.nick-name-box {
				padding: 10px 6px;
				background: #fff;
				box-sizing: border-box
			}
		}
	}
</style>
