<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="sureCancelShow" title="确定删除此图片?" :showCancelButton="true" @confirm="sureCancel" @cancel="cancelSure"></u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单评价" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="expectation-date">
						<text>期望时间：</text>
						<text v-if="serviceMessage.serviceDate">{{ `${getNowFormatDateText(serviceMessage.serviceDate)} (${judgeWeek(serviceMessage.serviceDate)}) ${serviceMessage.serviceTime}` }}</text>
					</view>
					<view class="order-form-status" v-if="serviceMessage.workerStatus != null">
						<text :class="{'waitPayStyle' : transitionOrderStatusText(serviceMessage.workerStatus,serviceMessage) == '派单中' || transitionOrderStatusText(serviceMessage.workerStatus,serviceMessage) == '待支付' || transitionOrderStatusText(serviceMessage.workerStatus,serviceMessage) == '服务中' || transitionOrderStatusText(serviceMessage.workerStatus,serviceMessage) == '待评价'}">
						{{ transitionOrderStatusText(serviceMessage.workerStatus,serviceMessage) }}</text>
					</view>
				</view>
				<view class="order-form-center">
					<view class="order-form-center-left">
						<u-image :src="serviceMessage.items[0]['picUrl']" width="66" height="66">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="order-form-center-right">
						<view class="order-form-title">
							<text>{{ serviceMessage.items[0]['spuName'] }}</text>
						</view>
						<view class="order-form-center-right-wrapper">
							<view class="brotected-person">
								<text>被护人</text>
								<text>{{ `${serviceMessage.servicePerson.name} ${serviceMessage.servicePerson.age}岁` }}</text>
							</view>
							<view class="service-address">
								<text>服务地址</text>
								<text>{{ serviceMessage.receiverDetailAddress }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-right">
						<text>实付总额</text>
						<text>￥</text>
						<text>{{`${serviceMessage.payPrice}`}}</text>
					</view>
				</view>
			</view>
			<view class="order-form-evaluate-content">
				<view class="service-attitude">
					<view class="service-attitude-title">
						<text>服务态度</text>
					</view>
					<view class="service-attitude-score">
						<u-rate active-color="#F2A15F" size="22" :count="serviceAttitudeCount" v-model="serviceAttitudeValue"></u-rate>
					</view>
				</view>
				<view class="service-attitude">
					<view class="service-attitude-title">
						<text>服务速度</text>
					</view>
					<view class="service-attitude-score">
						<u-rate active-color="#F2A15F" size="22" :count="serviceAttitudeCount" v-model="serviceSpeedValue"></u-rate>
					</view>
				</view>
				<view class="service-attitude">
					<view class="service-attitude-title">
						<text>专业程度</text>
					</view>
					<view class="service-attitude-score">
						<u-rate active-color="#F2A15F" size="22" :count="serviceAttitudeCount" v-model="majorLevelValue"></u-rate>
					</view>
				</view>
			</view>
			<view class="textarea-wrapper">
				<u--textarea :formatter="formatter" ref="textarea" v-model="evaluateValue" maxlength="150" height="140" placeholder="请填写你的评价内容 (150字)" count ></u--textarea>
			</view>
			<view class="upload-photo-area">
				<view>
					<view v-for="(item, index) in imgArr" :key='index'>
						<image :src="item" mode="aspectFit"></image>
						<u-icon name="close" size="20" color="#000000" @click="photoDelete(item,index)">></u-icon>
					</view>
					<view @click="getImg">
						<u-icon name="plus" size="36" color="#CCCCCC"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-area">
			<text @click="submitEvent">提交</text>
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
	import { createOrderComment } from '@/api/orderForm.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '提交中···',
				showLoadingHint: false,
				serviceAttitudeCount: 5,
				serviceAttitudeValue: '',
				sureCancelShow: false,
				imgArr: [],
				fileList: [],
				imgOnlinePathArr: [],
				imgIndex: '',
				serviceSpeedValue: '',
				majorLevelValue: '',
				evaluateValue: '',
				serviceMessage: {}
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
		onReady() {
			this.$refs.textarea.setFormatter(this.formatter)
		},
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryAddress = JSON.parse(options.transmitData);
			this.serviceMessage = temporaryAddress;
			this.serviceMessage['servicePerson'] = !temporaryAddress['serverPerson'] ? temporaryAddress['servicePerson'] : temporaryAddress['serverPerson'];
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 评价内容过滤空格函数
			formatter(value) {
				return value.replace(/\s*/g,"")
			},
			
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgArr.splice(this.imgIndex,1);
				this.fileList.splice(this.imgIndex,1)
			},
			
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false;
			},
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 2(只展示月)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator1 = "月";
				let seperator2 = "日";
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 2) {
					currentdate = month + seperator1
				} else {
					currentdate = month + seperator1 + strDate + seperator2
				};
				return currentdate
			},
			
			// 判断周几
			judgeWeek (currentDate) {
				let date = new Date(currentDate);
				let day = date.getDay();
				switch (day) {
					case 0:
						return "周日"
						break;
					case 1:
						return "周一"
						break;
					case 2:
						return "周二"
						break;
					case 3:
						return "周三"
						break;
					case 4:
						return "周四"
						break;
					case 5:
						return "周五"
						break;
					case 6:
						return "周六"
						break
					}
			},
			
			// 转换订单状态
			transitionOrderStatusText(status,item) {
				let temporaryStatus = status.toString();
				let temporaryWorkerStatus = item.status.toString();
				// 服务中类型的订单下包含3个子状态(30-待出发 40-待服务 50-服务中)
				if (this.current == 3) {
					switch(temporaryWorkerStatus) {
						case '30' :
						return '待出发'
						break;
						case '40' :
						return '待服务'
						break;
						case '50' :
						return '服务中'
						break;
					}	
				} else {
					switch(temporaryStatus) {
						case '0' :
						return '待支付'
						break;
						case '1' :
						return '派单中'
						break;
						case '2' :
						if (temporaryWorkerStatus == '30') {
							return '待出发'
						} else if (temporaryWorkerStatus == '40') {
							return '待服务'
						} else if (temporaryWorkerStatus == '50') {
							return '服务中'
						}
						break;
						case '3' :
						if (!item.commentStatus) {
							return '待评价'
						} else {
							return '已完成'
						}
						break;
						case '4' :
						if (item.refundStatus == 0) {
							return '已取消'
						} else if (item.refundStatus == 1) {
							return '退款中'
						} else if (item.refundStatus == 2) {
							return '已退款'
						}
						break
					}
				}
			},
			
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 选择图片方法
			getImg() {
				if (this.imgArr.length == 9) {
					this.$refs.uToast.show({
						message: "至多只能上传9张图片",
						position: 'center'
					});
					return
				};
				let that = this;
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
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
							that.fileList.push(res.tempFiles[imgI]['path']);
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.imgArr.push(base64);
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
				return new Promise((resolve, reject) => {
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
							this.imgOnlinePathArr.push(temporaryData.data);
							resolve()
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '上传图片失败',
								type: 'error',
								position: 'center'
							});
							reject()
						}
					 },
					 fail: (err) => {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: err.errMsg,
							type: 'error',
							duration: 5000,
							position: 'center'
						});
						reject()
					 }
					})
				})
			},
			
			// 创建评价
			createOrderCommentEvent(data) {
				this.showLoadingHint = true;
				createOrderComment(data).then((res) => {
					this.imgOnlinePathArr = [];
					if ( res && res.data.code == 0) {
						// 传递服务订单信息
						let mynavData = JSON.stringify(this.serviceMessage);
						uni.navigateTo({
							url: '/orderFormPackage/pages/serviceEvaluateFeedback/serviceEvaluateFeedback?transmitData='+mynavData
						})
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.imgOnlinePathArr = [];
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 提交评价事件
			async submitEvent () {
				// 上传图片文件流到服务端
				if (this.fileList.length > 0) {
					for (let imgI of this.fileList) {
						await this.uploadFileEvent(imgI)
					}
				};
				if (!this.serviceAttitudeValue) {
					this.$refs.uToast.show({
						message: '请对服务态度进行打分',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!this.serviceSpeedValue) {
					this.$refs.uToast.show({
						message: '请对服务速度进行打分',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!this.majorLevelValue) {
					this.$refs.uToast.show({
						message: '请对专业程度进行打分',
						type: 'error',
						position: 'center'
					});
					return
				};
				this.createOrderCommentEvent({
					anonymous: false,
					orderItemId: this.serviceMessage.items[0].id,
					attitudeScores: !this.serviceAttitudeValue ? 0 : this.serviceAttitudeValue,
					speedScores: !this.serviceSpeedValue ? 0 : this.serviceSpeedValue,
					specialityScores: !this.majorLevelValue ? 0 : this.majorLevelValue,
					content: this.evaluateValue,
					picUrls: this.imgOnlinePathArr
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
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 6px 0 10px 0;
			box-sizing: border-box;
			position: relative;
			.order-form-list {
				background: #fff;
				.order-form-top {
					display: flex;
					align-items: center;
					height: 50px;
					@include bottom-border-1px(#DCDCDC);
					justify-content: space-between;
					padding: 0 8px;
					box-sizing: border-box;
					.expectation-date {
						display: flex;
						align-items: center;
						justify-content: space-between;
						>text {
							display: inline-block;
							&:nth-child(1) {
								margin-right: 4px;
								font-size: 12px;
								color: #333333;
								font-weight: 400;
							};
							&:nth-child(2) {
								flex: 1;
								font-size: 12px;
								color: #000000;
								font-weight: 400;
								word-break: break-all
							}
						}
					};
					.order-form-status {
						>text {
							display: inline-block;
							padding: 0 0 0 4px;
							box-sizing: border-box;
							font-size: 14px;
							color: #999999;
							font-weight: 400;
						};
						.waitPayStyle {
							color: #E81F50 !important;
						}
					}
				};
				.order-form-center {
					display: flex;
					justify-content: space-between;
					padding: 8px 8px 0 8px;
					box-sizing: border-box;
					.order-form-center-left {
						margin-right: 12px;
						::v-deep .u-image {
						}
					};
					.order-form-center-right {
						flex: 1;
						.order-form-title {
							word-break: break-all;
							>text {
								font-size: 16px;
								color: #000000;
								font-weight: 400;
							}
						};
						.order-form-center-right-wrapper {
							margin-top: 6px;
							background: #FAFAFA;
							padding: 4px;
							box-sizing: border-box;
							.brotected-person {
								margin-bottom: 6px;
								display: flex;
								justify-content: space-between;
								>text {
									display: inline-block;
									font-size: 13px;
									color: #333333;
									font-weight: 400;
									&:nth-child(1) {
										margin-right: 10px;
									};
									&:nth-child(2) {
										flex: 1;
										word-break: break-all
									}
								}
							};
							.service-address {
								display: flex;
								justify-content: space-between;
								>text {
									display: inline-block;
									font-size: 13px;
									color: #333333;
									font-weight: 400;
									&:nth-child(1) {
										margin-right: 10px;
									};
									&:nth-child(2) {
										flex: 1;
										word-break: break-all
									}
								}
							}
						}
					}
				};
				.consumption-rental {
					padding: 10px 8px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.consumption-rental-left {
						display: flex;
						align-items: center;
						::v-deep .u-count-down {
							.u-count-down__text {
								font-size: 13px !important; 
								font-weight: bold !important;
								color: #FF0000 !important;
							}
						};
						>text {
							display: inline-block;
							font-size: 13px;
							font-weight: bold;
							color: #FF0000;
							&:nth-child(1) {
								margin-right: 4px
							};
							&:nth-child(2) {
							}
						}
					};
					.consumption-rental-right {
						flex: 1;
						display: flex;
						width: 0;
						align-items: center;
						justify-content: flex-end;
						>text {
							display: inline-block;
							&:nth-child(1) {
								font-size: 14px;
								color: #000000;
								font-weight: 600;
							};
							&:nth-child(2) {
								margin-top: 3px;
								font-size: 12px;
								color: #000000;
								font-weight: 600;
							};
							&:nth-child(3) {
								font-size: 17px;
								color: #000000;
								font-weight: 700;
							}
						}
					}
				}
			};
			.order-form-evaluate-content {
				padding: 6px 8px 10px 8px;
				background: #fff;
				box-sizing: border-box;
				border-top: 1px solid #f5f5f5;
				.service-attitude {
					display: flex;
					justify-content: space-between;
					margin-top: 6px;
					align-items: center;
					.service-attitude-title {
						display: flex;
						align-content: center;
						>text {
							font-size: 14px;
							color: #333333;
							font-weight: 400;
						}
					};
					.service-attitude-score {
						flex: 1;
						padding-left: 20px;
						box-sizing: border-box;
					}
				};
				.evaluate-text {
					padding: 4px 6px;
					margin-top: 20px;
					box-sizing: border-box;
					word-break: break-all;
					border: 1px solid #BBBBBB
				};
				.evaluate-picture {
					margin-top: 20px;
					display: flex;
					flex-wrap: wrap;
					::v-deep .u-transition {
						width: 32% !important;
						height: 88px !important;
						margin-right: 2%;
						margin-bottom: 10px;
						&:nth-child(3n+3) {
							margin-right: 0 !important
						};
						.u-image {
							.uni-image {
								width: 100% !important
							}
						}
					}
				}
			};
			.textarea-wrapper {
				padding: 6px 8px 10px 8px;
				background: #fff;
				box-sizing: border-box;
			};
			.upload-photo-area {
				padding: 6px 8px 10px 8px;
				background: #fff;
				box-sizing: border-box;
				>view {
					&:nth-child(1) {
						width: 100%;
						font-size: 34px;
						display: flex;
						flex-wrap: wrap;
						>view {
							width: 32%;
							height: 100px;
							display: flex;
							align-items: center;
							justify-content: center;
							vertical-align: top;
							margin-right: 2%;
							margin-top: 2%;
							position: relative;
							.u-icon {
								position: absolute;
								top: 0;
								right: 0
							};
							&:nth-child(1) {
								margin-top: 0;
							};
							&:nth-child(2) {
								margin-top: 0;
							};
							&:nth-child(3) {
								margin-top: 0;
							};
							&:nth-child(3n+3) {
								margin-right: 0;
							};
							&:last-child {
								.u-icon {
									position: relative !important; 
								};
								box-sizing: border-box;
								background: #EEEEEE;
								border: 1px solid rgba(220,220,220,1);
								border-radius: 6px;
							};
							image {
								width: 100%;
								height: 100%
							}
						}
					}
				}
			}
		};
		.submit-area {
			width: 90%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				display: inline-block;
				width: 100%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				background: #E81F50;
				border-radius: 6px;
				font-size: 14px;
				color: #fff;
			}
		}
	}
</style>
