<template>
	<view class="content-box">
		<!-- 删除订单提示 -->
		<view class="delete-info">
			<u-modal :show="deleteShow" @confirm="deleteOrderSureEvent" @cancel="deleteShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :content="deleteInfoContent" :showCancelButton="true" title="是否删除订单">
			</u-modal>
		</view>
		<!-- 取消订单提示 -->
		<view class="cancel-info">
			<u-modal :show="cancelOrderFormShow" @cancel="cancelOrderFormShow=false" @confirm="cancelOrderSureEvent" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="取消订单">
				<view class="slot-content">
					<view class="top-content">
						为保障医护因无效订单而错过有效接单，每日最多取消3次，超过3次后当日不可再发布订单，请谅解。<br/>
						今日剩余 3 次，确认取消订单吗？
					</view>
					<view class="bottom-content">
						<view>
							护士已接单扣除订单金额30%
						</view>
						<view>
							护士已出发扣除订单金额50%
						</view>
						<view>
							退款金额会自动退还到原账户
						</view>
					</view>
				</view>
			</u-modal>
		</view>
		<!-- 申请退款提示 -->
		<view class="apply-refund-info">
			<u-modal :show="applyRefundShow" @confirm="applyRefundShow=false" @cancel="applyRefundShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="申请退款">
				<view class="slot-content">
					<u-textarea height="100" v-model="refundReason" placeholder="请填写申请退款理由" count ></u-textarea>
				</view>
			</u-modal>
		</view>
		<!-- 退出支付提示 -->
		<view class="quit-pay-info">
			<u-modal :show="quitPayShow" @confirm="quitPayShow=false" :buttonReverse="true" @cancel="quitPayShow=false" confirmText="确定" cancelText="取消" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="当前订单还未支付">
				<view class="slot-content">
					确定退出支付吗？
				</view>
			</u-modal>
		</view>
		<!-- 操作订单成功提示 -->
		<view class="have-delete-info">
			<u-modal :show="haveDeleteShow" @confirm="operateOrderSuccessSureEvent" confirmText="确定" confirmColor="#EB3E67" :content="haveDeleteInfoContent" title="">
			</u-modal>
		</view>
		<!-- 提醒派单提示 -->
		<view class="remind-send-orders-info">
			<u-modal :show="remindSendOrdersShow" @confirm="remindSendOrdersShow=false" confirmText="确定" confirmColor="#EB3E67">
				<view class="slot-content">
					<view>
						已提醒派单
					</view>
					<view>
						三分钟前已提醒了
					</view>
				</view>
			</u-modal>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>{{ serviceMessage.items[0]['spuName'] }}</text>
					</view>
					<view class="order-form-status" v-if="serviceMessage.workerStatus != null">
						<text>{{ transitionOrderStatusText(serviceMessage.workerStatus,serviceMessage) }}</text>
					</view>
				</view>
				<view class="order-form-center">
					<view class="order-form-center-left">
						<u-image :src="serviceMessage.items[0]['picUrl']" width="88" height="88">
							<template v-slot:loading>
								<u-loading-icon color="red"></u-loading-icon>
							</template>
						</u-image>
					</view>
					<view class="order-form-center-right">
						<view class="brotected-person">
							<text>被护人</text>
							<text>{{ `${serviceMessage.serverPerson.name} ${serviceMessage.serverPerson.age}岁` }}</text>
						</view>
						<view class="service-address">
							<text>服务地址</text>
							<text>{{ serviceMessage.receiverDetailAddress }}</text>
						</view>
						<view class="expectation-date">
							<text>期望时间</text>
							<text>{{ `${getNowFormatDateText(serviceMessage.serviceDate)} (${judgeWeek(serviceMessage.serviceDate)}) ${serviceMessage.serviceTime}` }}</text>
						</view>
						<view class="evaluation-form">
							<text>初步评估单</text>
							<text>点击查看</text>
						</view>
					</view>
				</view>
			</view>
			<view class="price-list">
				<view class="price-list-top">
					<view class="price-list-title">
						<text>订单价格清单</text>
					</view>
				</view>
				<view class="price-list-content">
					<view class="price-list-one">
						<text>{{ serviceMessage.items[0]['spuName'] }}</text>
						<text>{{`￥${serviceMessage.payPrice}`}}</text>
					</view>
					<view class="price-list-one price-list-two">
						<text>路程费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-three">
						<text>超时费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-four">
						<text>材料费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-five">
						<text>优惠</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-last">
						<text>实付款</text>
						<text>{{`￥${serviceMessage.payPrice}`}}</text>
					</view>
				</view>
			</view>
			<view class="evaluate-message" v-if="serviceMessage.workerStatus == 3 && serviceMessage.commentStatus">
				<view class="evaluate-message-top">
					<view class="evaluate-message-title">
						<text>评价信息</text>
					</view>
				</view>
				<view class="evaluate-message-bottom">
					<view class="service-attitude">
						<view class="service-attitude-title">
							<text>服务态度</text>
						</view>
						<view class="service-attitude-score">
							<u-rate readonly active-color="#F2A15F" size="30" :count="serviceMessage.attitudeScores" v-model="serviceMessage.attitudeScores"></u-rate>
						</view>
					</view>
					<view class="service-attitude">
						<view class="service-attitude-title">
							<text>服务速度</text>
						</view>
						<view class="service-attitude-score">
							<u-rate readonly active-color="#F2A15F" size="30" :count="serviceMessage.speedScores" v-model="serviceMessage.speedScores"></u-rate>
						</view>
					</view>
					<view class="service-attitude">
						<view class="service-attitude-title">
							<text>专业程度</text>
						</view>
						<view class="service-attitude-score">
							<u-rate readonly active-color="#F2A15F" size="30" :count="serviceMessage.specialityScores" v-model="serviceMessage.specialityScores"></u-rate>
						</view>
					</view>
					<view class="evaluate-text">
						<text>啥就看啥酷酷酷酷酷酷酷酷酷酷酷酷给大家都开始了萨迪克</text>
					</view>
					<view class="evaluate-picture">
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
					</view>
				</view>
			</view>
			<view class="order-flow" v-if="serviceMessage.workerStatus != null && serviceMessage.status != 0 && serviceMessage.status < 70">
				<view class="order-flow-title">
					<text>订单流程</text>
				</view>
				<view class="order-flow-content">
					<u-steps :current="currentFlow" dot inactiveColor="rgba(255, 255, 255, 0.5)" activeColor="#fff">
						<u-steps-item title="已支付"></u-steps-item>
						<u-steps-item title="待接单"></u-steps-item>
						<u-steps-item title="待服务"></u-steps-item>
						<u-steps-item title="服务中"></u-steps-item>
						<u-steps-item title="待评价"></u-steps-item>
						<u-steps-item title="订单完成"></u-steps-item>
					</u-steps>
				</view>
			</view>
			<view class="order-message">
				<view class="order-message-top">
					<view class="order-message-title">
						<text>订单信息</text>
					</view>
				</view>
				<view class="order-message-content">
					<view class="order-message-one-special">
						<view class="order-message-one-special-left">
							<text>订单编号:</text>
						</view>
						<view class="order-message-one-special-right">
							<text>{{ serviceMessage.no }}</text>
							<text  @click="copyContent(copyValue)">复制</text>
						</view>
					</view>
					<view class="order-message-one" v-if="serviceMessage.payNo">
						<text>交易号:</text>
						<text>{{ serviceMessage.payNo }}</text>
					</view>
					<view class="order-message-one">
						<text>创建时间:</text>
						<text>{{ serviceMessage.createTime }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.workerStatus != 0 && serviceMessage.payTime">
						<text>付款时间:</text>
						<text>{{ serviceMessage.payTime }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.status >= 30 && serviceMessage.status != 70">
						<text>派单时间:</text>
						<text>{{ serviceMessage.assignTime }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.status == 60">
						<text>完成服务时间:</text>
						<text>{{ serviceMessage.completeTime }}</text>
					</view>
				</view>
			</view>
			<view class="btn-area">
				<text v-if="serviceMessage.workerStatus != 0 && serviceMessage.refundStatus == 0">申请退款</text>
				<text v-if="serviceMessage.status == 60 || serviceMessage.status == 70" @click="deleteOrder(serviceMessage)">删除订单</text>
				<text v-if="serviceMessage.status == 60 || serviceMessage.status == 70" @click="appointmentServiceEvent(serviceMessage)">再次预约</text>
				<text v-if="serviceMessage.workerStatus != 3 && serviceMessage.workerStatus != 4" @click="cancelOrderEvent(serviceMessage)">取消订单</text>
				<text v-if="serviceMessage.workerStatus == 1" @click="remindSendOrdersEvent(serviceMessage)">提醒派单</text>
				<text v-if="serviceMessage.workerStatus == 0" @click="editOrderFormEvent(serviceMessage)">修改订单</text>
				<text v-if="serviceMessage.workerStatus == 0" @click="immediatePayEvent(serviceMessage)" class="evaluate">立即付款</text>
				<text v-if="serviceMessage.workerStatus == 3 && !serviceMessage.commentStatus" class="evaluate" @click="orderFormEvaluateEvent(serviceMessage)">评价</text>
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
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { getOrderDetail, getTradeOrderPage, cancelOrder, deleteOrder, reminderOrder } from '@/api/orderForm.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '加载中···',
				showLoadingHint: true,
				currentFlow: null,
				serviceMessage: {
					id: '',
					no: '',
					createTime: '',
					userRemark: '',
					status: null,
					workerStatus: null,
					refundStatus: '',
					productCount: '',
					finishTime: '',
					cancelTime: '',
					commentStatus: true,
					payStatus: true,
					payOrderId: '',
					payTime: '',
					payExpireTime: '',
					payChannelCode: '',
					payChannelName: '',
					totalPrice: '',
					discountPrice: '',
					deliveryPrice: '',
					adjustPrice: '',
					payPrice: '',
					payNo: '',
					receiverAreaName: '',
					receiverDetailAddress: '',
					couponId: '',
					couponPrice: '',
					pointPrice: '',
					items: [
						{
							id: '',
							orderId: '',
							spuId: '',
							spuName: '',
							skuId: '',
							properties: [
								{
									propertyId: '',
									propertyName: '',
									valueId: '',
									valueName: ''
								}
							],
							picUrl: '',
							count: '',
							commentStatus: true,
							price: '',
							payPrice: '',
							afterSaleId: '',
							afterSaleStatus: ''
						}
					],
					careId: 0,
					serviceDate: '',
					serviceTime: '',
					serverPerson: {
						id: 0,
						memberId: 0,
						name: '',
						mobile: '',
						critical: '',
						birthday: '',
						sex: '',
						age: 0,
						medicalRecord: [],
						special: [],
						status: ''
					},
					images: [],
					assignType: '',
					assignTime: '',
					acceptTime: '',
					setOutTime: '',
					startTime: '',
					completeTime: '',
					aptitudes: [],
					commentRespVO: {
						scores: 0,
						attitudeScores: 0,
						speedScores: 0,
						specialityScores: 0,
						content: ''
					}
				},
				copyValue: '复制测试',
				deleteShow: false,
				haveDeleteShow: false,
				cancelOrderFormShow: false,
				quitPayShow: false,
				applyRefundShow: false,
				remindSendOrdersShow: false,
				refundReason: '',
				deleteInfoContent: '删除订单不可恢复，如有疑问请联系客服人员资讯',
				haveDeleteInfoContent: '已删除订单',
				currentSelectOrderMessage: {}
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'editServiceOrderFormSureChooseMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			this.queryOrderDetail({id:this.editServiceOrderFormSureChooseMessage.orderMessage.id})
		},
		methods: {
			...mapMutations([
				'storeEditServiceOrderFormSureChooseMessage'
			]),
			
			copyContent(data) {
				uni.setClipboardData({
					data,
					success: () => {
						uni.getClipboardData({ 
							success: (res) => {
								uni.showToast({
										title: "复制成功"
								})
							}
						})
					}
				})
			},
			
			// 转换订单流程状态
			transitionOrderFlowStatusText(status,item) {
				let temporaryStatus = status.toString();
				let temporaryWorkerStatus = item.status.toString();
				// 服务完成前类型的订单下包含若干个子状态(10-待分配 20-待接单 30-待出发 40-待服务 50-服务中)
				if (temporaryStatus == 1 || temporaryStatus == 2) {
					switch(temporaryWorkerStatus) {
						case '10' :
						return 0
						break;
						case '20' :
						return 1
						break;
						case '30' :
						return 2
						break;
						case '40' :
						return 2
						break;
						case '50' :
						return 3
						break;
					}	
				} else {
					switch(temporaryStatus) {
						case '1' :
						return 0
						break;
						case '2' :
						if (temporaryWorkerStatus == '20') {
							return 1
						} else if (temporaryWorkerStatus == '30') {
							return 2
						} else if (temporaryWorkerStatus == '40') {
							return 2
						} else if (temporaryWorkerStatus == '50') {
							return 3
						}
						break;
						case '3' :
						if (!item.commentStatus) {
							return 4
						} else {
							return 5
						}
						break
					}
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
			
			// 操作订单成功确定事件
			operateOrderSuccessSureEvent () {
				this.haveDeleteShow = false;
				if (this.infoText == '订单删除中···') {
					uni.navigateBack()
				}
			},
			
			// 查询订单详情
			queryOrderDetail(data) {
				this.showLoadingHint = true;
				this.infoText = '加载中···';
				getOrderDetail(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.serviceMessage = res.data.data;
						this.serviceMessage.payPrice = fenToYuan(this.serviceMessage.payPrice);
						this.currentFlow = this.transitionOrderFlowStatusText(this.serviceMessage.workerStatus,this.serviceMessage);
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
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 预约服务事件
			appointmentServiceEvent (item) {
				// 传递服务订单信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/servicePackage/pages/reservationServiceList/reservationServiceList?transmitData='+mynavData
				})
			},
			
			// 立即付款事件
			immediatePayEvent (item) {
				// 传递订单信息
				let mynavData = JSON.stringify(item);
				let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
				temporaryEditServiceOrderFormSureChooseMessage['orderMessage'] = item;
				this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderPay/orderPay?transmitData='+mynavData
				})
			},
			
			// 取消订单
			cancelOrderPort(data) {
				this.infoText = '订单取消中···';
				this.showLoadingHint = true;
				cancelOrder(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.haveDeleteShow = true;
						this.haveDeleteInfoContent = '已取消订单';
						this.queryOrderDetail({id:this.editServiceOrderFormSureChooseMessage.orderMessage.id})
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
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 删除订单
			deleteOrderPort(data) {
				this.infoText = '订单删除中···';
				this.showLoadingHint = true;
				deleteOrder(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.haveDeleteShow = true;
						this.haveDeleteInfoContent = '已删除订单';
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
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 提醒订单
			reminderOrderPort(data) {
				this.infoText = '派单提醒中···';
				this.showLoadingHint = true;
				reminderOrder(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.remindSendOrdersShow = true;
						this.queryOrderDetail({id:this.editServiceOrderFormSureChooseMessage.orderMessage.id})
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
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 修改订单事件
			editOrderFormEvent (item) {
				// 传递该修改订单的信息
				let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
				temporaryEditServiceOrderFormSureChooseMessage['orderMessage'] = item;
				this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderFormEdit/orderFormEdit'
				})
			},
			
			// 删除订单事件
			deleteOrder(item) {
				this.currentSelectOrderMessage = item;
				this.deleteShow = true
			},
			
			// 删除订单确定事件
			deleteOrderSureEvent () {
				this.deleteShow = false;
				this.deleteOrderPort({id: this.currentSelectOrderMessage.id})
			},
			
			// 提醒派单事件
			remindSendOrdersEvent (item) {
				this.currentSelectOrderMessage = item;
				this.reminderOrderPort(this.currentSelectOrderMessage.id)
			},
			
			// 取消订单事件
			cancelOrderEvent(item) {
				this.currentSelectOrderMessage = item;
				this.cancelOrderFormShow = true
			},
			
			// 取消订单确定事件
			cancelOrderSureEvent () {
				this.cancelOrderFormShow = false;
				this.cancelOrderPort({
					id: this.currentSelectOrderMessage.id,
					reason: ''
				})
			},
			
			// 订单评价事件
			orderFormEvaluateEvent (item) {
				// 传递服务订单信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/orderFormPackage/pages/serviceEvaluate/serviceEvaluate?transmitData='+mynavData
				})
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
						margin-right: 30px;
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
		.cancel-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.slot-content {
							width: 280px;
							.top-content {
								font-size: 16px;
								color: #838C97;
							};
							.bottom-content {
								margin-top: 20px;
								font-size: 16px;
								color: #EB3E67;
								>view {
									&:nth-child(2) {
										margin: 4px 0
									}
								}
							}
						}
					}
				}
			}
		};
		.apply-refund-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.slot-content {
							width: 280px
						}
					}
				}
			}
		};
		.have-delete-info {
			::v-deep .u-transition {
				z-index: 100000 !important;
				.u-popup__content {
					.u-modal {
						.u-modal__content {
							padding: 40px 10px !important;
							box-sizing: border-box;
							.u-modal__content__text {
								font-size: 18px !important;
								color: #101010 !important;
								text-align: center !important
							}
						};
						.u-modal__button-group {
							.u-modal__button-group__wrapper--confirm {
								margin-left: 0 !important
							}
						}
					}
				}
			}
		};
		.remind-send-orders-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.u-modal__content {
							padding: 40px 10px !important;
							box-sizing: border-box;
							.slot-content {
								>view {
									text-align: center;
									font-size: 18px !important;
									color: #101010 !important;
									&:first-child {
										margin-bottom: 6px
									}
								}
							}
						};
						.u-modal__button-group {
							.u-modal__button-group__wrapper--confirm {
								border-radius: 37px !important;
								margin-left: 0 !important;
								background: #EB3E67 !important
							}
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
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 10px 0;
			box-sizing: border-box;
			position: relative;
			.order-form-list {
				padding: 0px 4px 8px 4px;
				background: #fff;
				box-sizing: border-box;
				margin-bottom: 10px;
				.order-form-top {
					display: flex;
					align-items: center;
					height: 50px;
					@include bottom-border-1px(#BBBBBB);
					justify-content: space-between;
					padding: 0 8px 0 10px;
					box-sizing: border-box;
					.order-form-title {
						flex: 1;
						@include no-wrap();
						>text {
							font-size: 16px;
							color: #444444;
							font-weight: bold
						}
					};
					.order-form-status {
						>text {
							display: inline-block;
							padding: 0 0 0 4px;
							box-sizing: border-box;
							font-size: 14px;
							color: #444444;
							font-weight: bold
						}
					}
				};
				.order-form-center {
					display: flex;
					justify-content: space-between;
					padding: 8px;
					box-sizing: border-box;
					.order-form-center-left {
						margin-right: 10px;
						::v-deep .u-image {
							width: 88px !important;
							height: 88px !important
						}
					};
					.order-form-center-right {
						padding-top: 10px;
						box-sizing: border-box;
						.brotected-person {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									word-break: break-all
								}
							}
						};
						.service-address {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									word-break: break-all
								}
							}
						};
						.expectation-date {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									word-break: break-all
								}
							}
						};
						.evaluation-form {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 66px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #3388FF;
									word-break: break-all
								}
							}
						}
					}
				}
			}
		};
		.price-list {
			background: #fff;
			margin-bottom: 10px;
			.price-list-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.price-list-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.price-list-content {
				padding: 6px 16px;
				box-sizing: border-box;
				.price-list-one {
					display: flex;
					justify-content: space-between;
					margin-bottom: 6px;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #3E4248;
						font-weight: bold;
						&:first-child {
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							
						}
					}
				};
				.price-list-last {
					>text {
						&:last-child {
							color: #E82050;
							font-size: 16px;
							font-weight: bold;
						}
					}
				}
			}
		};
		.evaluate-message {
			background: #fff;
			margin-bottom: 10px;
			.evaluate-message-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.evaluate-message-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.evaluate-message-bottom {
				padding: 6px 16px;
				box-sizing: border-box;
				.service-attitude {
					display: flex;
					justify-content: space-between;
					margin-top: 6px;
					align-items: center;
					.service-attitude-title {
						>text {
							font-size: 14px;
							color: #3E4248;
							font-weight: bold;
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
			}
		};
		.order-flow {
			height: 113px;
			background: #EB3E67;
			margin-bottom: 10px;
			padding: 6px 16px 10px 16px;
			box-sizing: border-box;
			.order-flow-title {
				padding-left: 4px;
				box-sizing: border-box;
				font-size: 14px;
				color: #fff;
				margin-bottom: 20px
			};
			.order-flow-content {
				::v-deep .u-steps {
					.u-steps-item {
						.u-steps-item__wrapper {
							background: transparent !important
						};
						.u-steps-item__content {
							.u-text {
								.u-text__value {
									color: #fff !important
								}
							}
						}
					}
				}
			}
		};
		.order-message {
			background: #fff;
			margin-bottom: 10px;
			.order-message-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.order-message-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.order-message-content {
				padding: 6px 16px;
				box-sizing: border-box;
				.order-message-one-special {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					.order-message-one-special-left {
						font-size: 14px;
						font-weight: bold;
						color: #3E4248;
					};
					.order-message-one-special-right {
						display: flex;
						flex: 1;
						justify-content: flex-end;
						>text {
							display: inline-block;
							font-size: 14px;
							color: #3E4248;
							font-weight: bold;
							&:first-child {
								flex: 1;
								color: #B7B6B6;
								margin-right: 4px;
								text-align: right;
								word-break: break-all
							};
							&:last-child {
								color: #3E4248
							}
						}
					}
				};
				.order-message-one {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #3E4248;
						font-weight: bold;
						&:first-child {
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							color: #B7B6B6
						}
					}
				}
			}
		};
		.btn-area {
			flex: 1;
			background: #fff;
			margin: 10px 0;
			padding: 0 10px;
			box-sizing: border-box;
			display: flex;
			height: 62px;
			align-items: center;
			justify-content: flex-end;
			>text {
				min-width: 78px;
				display: inline-block;
				height: 26px;
				padding: 0 12px;
				box-sizing: border-box;
				text-align: center;
				line-height: 26px;
				font-size: 13px;
				color: #5E5E5E;
				border: 1px solid #BBBBBB;
				border-radius: 22px;
				margin-right: 10px;
				&:last-child {
					margin-right: 0
				}
			};
			.evaluate {
				color: #fff;
				background: #FF698C;
				border: none !important;
				margin-right: 0 !important;
			}
		}
	}
</style>
