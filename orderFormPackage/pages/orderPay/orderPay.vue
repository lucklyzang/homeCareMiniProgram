<template>
	<view class="content-box">
		<u-toast ref="uToast"></u-toast>
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<!-- 退出支付提示 -->
		<view class="quit-pay-info">
			<u-modal :show="quitPayShow" @confirm="confirmQuitPayEvent" :buttonReverse="true" @cancel="quitPayShow=false" confirmText="确定" cancelText="取消" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="当前订单还未支付">
				<view class="slot-content">
					确定退出支付吗？
				</view>
			</u-modal>
		</view>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单支付" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-message-wrapper">
			<view class="service-project">
				<view class="service-project-left">
					<image :src="serverMessage.picUrl ? serverMessage.picUrl : jaundiceDetectionPng"></image>
				</view>
				<view class="service-project-right">
					<view class="service-project-right-top">
						<text>{{ payOrderMessage.subject }}</text>
					</view>
					<!-- <view class="service-project-right-bottom">
						<text>上门服务一次</text>
						<text>40分钟</text>
						<text>专业服务</text>
					</view> -->
				</view>
			</view>
			<view class="pay-way">
				<view class="pay-way-title">
					<text>请选择支付方式</text>
				</view>
				<view class="pay-way-content">
					<view class="pay-way-list">
						<view class="pay-way-list-left">
							<u-icon name="chat-fill" color="#20e620" size="40"></u-icon>
							<text>微信支付</text>
						</view>
						<view class="pay-way-list-right">
							<u-icon name="checkmark-circle" size="25" color="#f16c8ca3"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay-area">
			<view class="pay-area-bottom">
				<view class="order-form-price">
					<text>订单金额</text>
					<text v-if="payOrderMessage.price">{{ `￥${payOrderMessage.price}` }}</text>
				</view>
				<view class="to-pay-btn" @click="toPayEvent">
					立即支付
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
		fenToYuan
	} from '@/common/js/utils'
	import { createPayOrder, getEnableCodeList, submitPayOrder } from '@/api/orderForm.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				infoText: '加载中···',
				showLoadingHint: false,
				quitPayShow: false,
				payOrderMessage: {},
				serverMessage: {},
				beforePageRoute: '',
				jaundiceDetectionPng: require("@/static/img/jaundice-detection.png")
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
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryOrderMessage = JSON.parse(options.transmitData);
			this.createPayOrderEvent({
				id: temporaryOrderMessage.payOrderId
			});
			let pages = getCurrentPages();//当前页
			this.beforePageRoute = pages[pages.length - 2].route;//上个页面路径
			if (this.beforePageRoute == 'pages/orderForm/orderForm' || this.beforePageRoute == 'orderFormPackage/pages/orderFormDetails/orderFormDetails') {
				this.serverMessage.picUrl = this.editServiceOrderFormSureChooseMessage.orderMessage.items[0]['picUrl']
			} else {
				this.serverMessage.picUrl = this.serviceOrderFormSureChooseMessage.serviceMessage['picUrl']
			}
		},
		
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				this.quitPayShow = true
			},
			
			// 确定退出支付事件
			confirmQuitPayEvent () {
				uni.navigateBack()
			},
			
			// 创建支付订单
			createPayOrderEvent(data) {
				this.showLoadingHint = true;
				createPayOrder(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.payOrderMessage = res.data.data;
						this.payOrderMessage.price = fenToYuan(this.payOrderMessage.price);
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
			
			// 提交支付订单
			submitPayOrderEvent(data) {
				this.infoText = '支付提交中···',
				this.showLoadingHint = true;
				submitPayOrder(data).then((res) => {
					if ( res && res.data.code == 0) {
						// mock支付(status==10表示支付成功)
						if (res.data.data.status == 10) {
							this.$refs.uToast.show({
								message: '支付成功',
								type: 'success',
								position: 'center'
							});
							uni.switchTab({
								url: '/pages/orderForm/orderForm'
							})
						}	
						// 调起微信支付
						// wx.requestPayment
						// (
						//   {
						//     timeStamp: "1414561699",
						//     nonceStr: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
						//     package: "prepay_id=wx201410272009395522657a690389285100",
						//     signType: "RSA",
						//     paySign: "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==",
						//     success:function(res){},
						//     fail:function(res){},
						//     complete:function(res){}
						//   }
						// )
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
			
			// 支付事件
			toPayEvent () {
				this.submitPayOrderEvent({
					id: this.payOrderMessage.id,
					channelCode: "mock",
					displayMode: ""
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
		::v-deep .u-popup__content{
			.u-modal {
				.u-modal__title {
					font-size: 16px !important;
					color: #101010 !important
				};
				.u-line {
					border: none !important
				};
				.u-modal__content {
					padding: 20px 10px 30px 10px !important;
					font-size: 14px !important;
					color: #898C8C !important
				};
				.u-modal__button-group {
					height: 50px;
					justify-content: center;
					.u-line {
						border: none !important
					};
					.u-modal__button-group__wrapper--cancel {
						flex: none !important;
						width: 100px !important;
						height: 34px !important;
						line-height: 34px !important;
						border-radius: 7px !important;
						border: 1px solid #FF698C !important;
						.u-modal__button-group__wrapper__text {
							font-size: 14px;
							color: #FF698C !important;
						}
					};
					.u-modal__button-group__wrapper--confirm {
						flex: none !important;
						width: 100px !important;
						height: 34px !important;
						line-height: 34px !important;
						border-radius: 7px !important;
						margin-right: 30px;
						background: #FF698C !important;
						border: none !important;
						.u-modal__button-group__wrapper__text {
							font-size: 14px;
							color: #fff !important;
						}
					}
				}
			}
		};
		.top-area-box {
			position: relative;
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
		}
		.order-form-message-wrapper {
			flex: 1;
			background: #F8F8F8;
			overflow: auto;
			padding: 10px 0 0 0;
			box-sizing: border-box;
			width: 100%;
			.service-project {
				width: 95%;
				margin: 0 auto;
				display: flex;
				padding: 12px 10px;
				box-sizing: border-box;
				background: #fff;
				.service-project-left {
					margin-right: 10px;
					>image {
						width: 66px;
						height: 66px
					}
				};
				.service-project-right {
					flex: 1;
					@include no-wrap;
					.service-project-right-top {
						margin-bottom: 5px;
						width: 100%;
						>text {
							display: inline-block;
							width: 100%;
							font-size: 16px;
							color: #000000;
							font-weight: 400;
							@include no-wrap;
						}
					};
					.service-project-right-bottom {
						>text {
							display: inline-block;
							font-size: 11px;
							color: #fff;
							font-weight: 600;
							margin-right: 4px;
							background: #FEB8B7;
							border-radius: 3px;
							height: 20px;
							line-height: 20px;
							padding: 0 6px;
							box-sizing: border-box;
							&:last-child {
								margin-right: 0 !important
							}
						}
					}
				}
			};
			.pay-way {
				padding: 10px;
				box-sizing: border-box;
				background: #fff;
				margin-top: 10px;
				.pay-way-title {
					font-size: 16px;
					color: #101010;
					font-weight: bold
				};
				.pay-way-content {
					margin-top: 20px;
					.pay-way-list {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.pay-way-list-left {
							display: flex;
							align-items: center;
							flex: 1;
							>text {
								margin-left: 6px;
								font-size: 16px;
								color: #101010;
							}
						};
						.pay-way-list-right {}
					}
				}
			}
		};
		.pay-area {
			background: #ffff;
			width: 95%;
			margin: 0 auto;
			height: 65px;
			justify-content: space-between;
			display: flex;
			align-items: center;
			.pay-area-bottom {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.order-form-price {
					>text {
						&:first-child {
							font-size: 13px;
							color: #333333;
							font-weight: 400;
							margin-right: 8px
						};
						&:nth-child(2) {
							font-size: 12px;
							color: #F92C20;
							font-weight: 500;
						};
						&:last-child {
							font-size: 17px;
							color: #F92C20;
							font-weight: 500;
						}
					}
				};
				.to-pay-btn {
					width: 90px;
					height: 40px;
					line-height: 40px;
					background: #E81F50;
					box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.05);
					border-radius: 5px;
					font-size: 14px;
					color: #FFFFFF;
					text-align: center;
					font-weight: 400;
				}
			}
		}
	}
</style>
