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
				<view class="slot-content" v-if="currentSelectOrderMessage.hasOwnProperty('workerStatus')">
					<view class="top-content">
						<view>
							为保障医护因无效订单而错过有效接单，每日最多取消3次，超过3次后当日不可再发布订单，请谅解。
						</view>
						<view>
							{{ `今日剩余 ${canCancelcount} 次，确认取消订单吗？` }} 
						</view>
					</view>
					<view class="bottom-content" v-if="currentSelectOrderMessage.workerStatus.toString() != 0">
						<view v-if="currentSelectOrderMessage.workerStatus.toString() == 1">
							申请退款扣除订单金额10%
						</view>
						<view v-if="currentSelectOrderMessage.workerStatus.toString() == 2">
							护士已接单扣除订单金额30%
						</view>
						<view v-if="currentSelectOrderMessage.workerStatus.toString() == 2">
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
			<u-modal :show="haveDeleteShow" @confirm="operateOrderSuccessSureEvent" confirmText="确定" confirmColor="#EB3E67" :content="haveDeleteInfoContent">
			</u-modal>
		</view>
		<!-- 取消订单成功提示 -->
		<view class="have-cancel-info">
			<u-modal :show="haveCancelShow" @confirm="cancelOrderSuccessSureEvent" confirmText="确定" confirmColor="#EB3E67">
				<view class="slot-content" v-if="currentSelectOrderMessage.hasOwnProperty('workerStatus')">
					<view class="cancel-title" v-if="currentSelectOrderMessage.workerStatus.toString() == 0">
						已取消订单
					</view>
					<view class="cancel-title" v-if="currentSelectOrderMessage.workerStatus.toString() != 0">
						取消订单成功
					</view>
					<view class="cancel-content" v-if="currentSelectOrderMessage.workerStatus.toString() == 1">
						申请退款扣除10%
					</view>
					<view class="cancel-content" v-if="currentSelectOrderMessage.workerStatus.toString() == 2">
						护士已接单扣除订单金额30%
					</view>
					<view class="cancel-content" v-if="currentSelectOrderMessage.workerStatus.toString() == 2">
						护士已出发扣除订单金额50%
					</view>
					<view class="cancel-content" v-if="currentSelectOrderMessage.workerStatus.toString() != 0">
						退款金额会自动退还到原账户
					</view>
				</view>
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
		<u-toast ref="uToast" />
		<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="我的订单">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-tabs">
			<u-tabs :list="list" :current="current" @change="change"
				lineWidth="30"
				lineColor="#E81F50"
				:activeStyle="{
					color: '#333333',
					fontWeight: 500,
					fontSize: '15px'
				}"
				:inactiveStyle="{
					color: '#666666',
					fontWeight: 400,
					fontSize: '15px'
				}"
			></u-tabs>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 0">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="expectation-date">
							<text>期望时间：</text>
							<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
						</view>
						<view class="order-form-status">
							<text :class="{'waitPayStyle' : transitionOrderStatusText(item.workerStatus,item) == '派单中' || transitionOrderStatusText(item.workerStatus,item) == '待支付' || transitionOrderStatusText(item.workerStatus,item) == '服务中' || transitionOrderStatusText(item.workerStatus,item) == '待评价'}">
							{{ transitionOrderStatusText(item.workerStatus,item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="74" height="74">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="order-form-title">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="order-form-center-right-wrapper">
								<view class="brotected-person">
									<text>被护人</text>
									<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
								</view>
								<view class="service-address">
									<text>服务地址</text>
									<text>{{ item.receiverDetailAddress }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-left" v-if="item.workerStatus == 0">
							<text>剩余支付时间：</text>
							<u-count-down v-if="item.countTime > 0" :time="item.countTime" format="mm:ss"></u-count-down>
							<text v-if="item.countTime <= 0 ">00:00</text>
						</view>
						<view class="consumption-rental-right">
							<text>{{`${item.workerStatus == 0 ? '待付' : '实付'}总额`}}</text>
							<text>￥</text>
							<text>{{ `${item.payPrice}` }}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-left" @click.stop="contactNurseEvent(item)" v-if="item.status == 30 || item.status == 40 || item.status == 50">
							<text>联系护士</text>
						</view>
						<view class="btn-area-right">
							<text v-if="item.workerStatus != 3 && item.workerStatus != 4" @click.stop="cancelOrderEvent(item)">取消订单</text>
							<text v-if="item.workerStatus == 1" @click.stop="remindSendOrdersEvent(item)">提醒派单</text>
							<text v-if="item.workerStatus == 0" @click.stop="editOrderFormEvent(item)">修改订单</text>
							<text v-if="(item.status == 60 && item.commentStatus) || item.status == 70" @click.stop="deleteOrder(item)">删除订单</text>
							<text v-if="item.status == 60 || item.status == 70" @click.stop="appointmentServiceEvent(item)">再次预约</text>
							<text v-if="item.status == 60 && !item.commentStatus" class="evaluate" @click.stop="orderFormEvaluateEvent(item)">评价</text>
							<text v-if="item.workerStatus == 0" class="at-once-payment" @click.stop="immediatePayEvent(item)">立即付款</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 1">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="expectation-date">
							<text>期望时间：</text>
							<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
						</view>
						<view class="order-form-status">
							<text :class="{'waitPayStyle' : transitionOrderStatusText(item.workerStatus,item) == '派单中' || transitionOrderStatusText(item.workerStatus,item) == '待支付' || transitionOrderStatusText(item.workerStatus,item) == '服务中' || transitionOrderStatusText(item.workerStatus,item) == '待评价'}">
							{{ transitionOrderStatusText(item.workerStatus,item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="74" height="74">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="order-form-title">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="order-form-center-right-wrapper">
								<view class="brotected-person">
									<text>被护人</text>
									<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
								</view>
								<view class="service-address">
									<text>服务地址</text>
									<text>{{ item.receiverDetailAddress }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-left">
							<text>剩余支付时间：</text>
							<u-count-down v-if="item.countTime > 0" :time="item.countTime" format="mm:ss"></u-count-down>
							<text v-if="item.countTime <= 0 ">00:00</text>
						</view>
						<view class="consumption-rental-right">
							<text>{{`${item.workerStatus == 0 ? '待付' : '实付'}总额`}}</text>
							<text>￥</text>
							<text>{{`${item.payPrice}`}}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-right">
							<text @click.stop="cancelOrderEvent(item)">取消订单</text>
							<text @click.stop="editOrderFormEvent(item)">修改订单</text>
							<text class="at-once-payment" @click.stop="immediatePayEvent(item)">立即付款</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 2">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="expectation-date">
							<text>期望时间：</text>
							<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
						</view>
						<view class="order-form-status">
							<text :class="{'waitPayStyle' : transitionOrderStatusText(item.workerStatus,item) == '派单中' || transitionOrderStatusText(item.workerStatus,item) == '待支付' || transitionOrderStatusText(item.workerStatus,item) == '服务中' || transitionOrderStatusText(item.workerStatus,item) == '待评价'}">
							{{ transitionOrderStatusText(item.workerStatus,item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="74" height="74">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="order-form-title">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="order-form-center-right-wrapper">
								<view class="brotected-person">
									<text>被护人</text>
									<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
								</view>
								<view class="service-address">
									<text>服务地址</text>
									<text>{{ item.receiverDetailAddress }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-right">
							<text>实付总额</text>
							<text>￥</text>
							<text>{{`${item.payPrice}`}}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-right">
							<text @click.stop="cancelOrderEvent(item)">取消订单</text>
							<text @click.stop="remindSendOrdersEvent(item)">提醒派单</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 3">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="expectation-date">
							<text>期望时间：</text>
							<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
						</view>
						<view class="order-form-status">
							<text :class="{'waitPayStyle' : transitionOrderStatusText(item.workerStatus,item) == '派单中' || transitionOrderStatusText(item.workerStatus,item) == '待支付' || transitionOrderStatusText(item.workerStatus,item) == '服务中' || transitionOrderStatusText(item.workerStatus,item) == '待评价'}">
							{{ transitionOrderStatusText(item.workerStatus,item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="74" height="74">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="order-form-title">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="order-form-center-right-wrapper">
								<view class="brotected-person">
									<text>被护人</text>
									<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
								</view>
								<view class="service-address">
									<text>服务地址</text>
									<text>{{ item.receiverDetailAddress }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-right">
							<text>实付总额</text>
							<text>￥</text>
							<text>{{`${item.payPrice}`}}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-left" @click.stop="contactNurseEvent(item)">
							<text>联系护士</text>
						</view>
						<view class="btn-area-right">
							<text @click.stop="cancelOrderEvent(item)">取消订单</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 4">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="expectation-date">
							<text>期望时间：</text>
							<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
						</view>
						<view class="order-form-status">
							<text :class="{'waitPayStyle' : transitionOrderStatusText(item.workerStatus,item) == '派单中' || transitionOrderStatusText(item.workerStatus,item) == '待支付' || transitionOrderStatusText(item.workerStatus,item) == '服务中' || transitionOrderStatusText(item.workerStatus,item) == '待评价'}">
							{{ transitionOrderStatusText(item.workerStatus,item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="74" height="74">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="order-form-title">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="order-form-center-right-wrapper">
								<view class="brotected-person">
									<text>被护人</text>
									<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
								</view>
								<view class="service-address">
									<text>服务地址</text>
									<text>{{ item.receiverDetailAddress }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-right">
							<text>实付总额</text>
							<text>￥</text>
							<text>{{`${item.payPrice}`}}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-right">
							<text @click.stop="appointmentServiceEvent(item)">再次预约</text>
							<text class="evaluate" @click.stop="orderFormEvaluateEvent(item)">评价</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 5">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="expectation-date">
							<text>期望时间：</text>
							<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
						</view>
						<view class="order-form-status">
							<text :class="{'waitPayStyle' : transitionOrderStatusText(item.workerStatus,item) == '派单中' || transitionOrderStatusText(item.workerStatus,item) == '待支付' || transitionOrderStatusText(item.workerStatus,item) == '服务中' || transitionOrderStatusText(item.workerStatus,item) == '待评价'}">
							{{ transitionOrderStatusText(item.workerStatus,item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="74" height="74">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="order-form-title">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="order-form-center-right-wrapper">
								<view class="brotected-person">
									<text>被护人</text>
									<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
								</view>
								<view class="service-address">
									<text>服务地址</text>
									<text>{{ item.receiverDetailAddress }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-right">
							<text>实付总额</text>
							<text>￥</text>
							<text>{{`${item.payPrice}`}}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-right">
							<text @click.stop="deleteOrder(item)">删除订单</text>
							<text @click.stop="appointmentServiceEvent(item)">再次预约</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
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
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { getTradeOrderPage, cancelOrder, deleteOrder, reminderOrder, tradeOrderCancancelcount } from '@/api/orderForm.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '加载中···',
				showLoadingHint: false,
				currentPageNum: 1,
				pageSize: 5,
				totalCount: 0,
				status: 'nomore',
				tradeList: [],
				fullTradeList: [],
				deleteShow: false,
				haveDeleteShow: false,
				cancelOrderFormShow: false,
				quitPayShow: false,
				applyRefundShow: false,
				remindSendOrdersShow: false,
				refundReason: '',
				canCancelcount: '',
				haveCancelShow: false,
				deleteInfoContent: '删除订单不可恢复，如有疑问请联系客服人员咨询',
				haveDeleteInfoContent: '已删除订单',
				isShowNoData: false,
				list: [
					{
						name: '全部',
						badge: {
							value: ''
						}
					}, 
					{
						name: '待付款',
						badge: {
							value: ''
						}
					}, 
					{
						name: '派单中',
						badge: {
							value: ''
						}
					},
					{
						name: '服务中',
						badge: {
							value: ''
						}
					},
					{
						name: '待评价',
						badge: {
							value: ''
						}
					},
					{
						name: '取消|退款',
						badge: {
							value: ''
						}
					}
				],
				current: 0,
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
			if (this.editServiceOrderFormSureChooseMessage.hasOwnProperty('current')) {
				this.current = this.editServiceOrderFormSureChooseMessage.current;
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					status: this.transitionOrderStatus(this.editServiceOrderFormSureChooseMessage.current)
				},true)
			}	else {
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					status: ''
				},true)
			} 
		},
		methods: {
			...mapMutations([
				'storeEditServiceOrderFormSureChooseMessage'
			]),
			
			// 倒计时结束事件
			countDownFinishEvent () {
				console.log('结束');
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
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryTradeOrderPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						status: this.transitionOrderStatus(this.current)
					},false)
				}
			},
			
			// 操作订单成功确定事件
			operateOrderSuccessSureEvent () {
				this.haveDeleteShow = false
			},
			
			// 取消订单成功确定事件
			cancelOrderSuccessSureEvent () {
				this.haveCancelShow = false
			},
			
			// 查询交易订单可取消次数
			tradeOrderCancancelcountEvent () {
				this.infoText = '加载···';
				this.showLoadingHint = true;
				tradeOrderCancancelcount().then((res) => {
					if ( res && res.data.code == 0) {
						this.cancelOrderFormShow = true;
						this.canCancelcount = res.data.data;
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
			
			
			// 查询交易订单
			queryTradeOrderPage(data,flag) {
				this.tradeList = [];
				// 重置所有类型订单数量
				this.list.forEach((item) => { return item['badge']['value'] = 0 });
				if (flag) {
					this.fullTradeList = [];
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getTradeOrderPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						// 将当前存储的订单切换类型重置为0
						let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
						temporaryEditServiceOrderFormSureChooseMessage['current'] = 0;
						this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
						this.totalCount = res.data.data.total;
						this.tradeList = res.data.data.list;
						// 切换到待评价订单时只展示待评价的订单(已评价和已完成订单状态都是3)
						if (res.data.data.list.length > 0) {
							if (this.current == 4) {
								this.tradeList = this.tradeList.filter((item) => { return item.commentStatus == false })
							};
							this.tradeList.forEach((item) => {
								item.payPrice = fenToYuan(item.payPrice);
								item.countTime = (new Date(item.createTime).getTime() + (15*60*1000)) - new Date().getTime(); 
							});
						};
						this.fullTradeList = this.fullTradeList.concat(this.tradeList);
						// 展示当期类型订单数量
						this.list[this.current]['badge']['value'] = this.totalCount;
						if (this.fullTradeList.length == 0) {
							this.isShowNoData = true
						} else {
							this.isShowNoData = false
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
			cancelOrderPort(id,reason) {
				this.infoText = '订单取消中···';
				this.showLoadingHint = true;
				cancelOrder(id,reason).then((res) => {
					if ( res && res.data.code == 0) {
						this.haveCancelShow = true;
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
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
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
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
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
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
			
			// 订单类型切换事件
			change(index) {
				this.current = index.index;
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoData = false;
				this.fullTradeList = [];
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					status: this.transitionOrderStatus(this.current)
				},true)
			},
			
			// 变更查询订单状态参数
			transitionOrderStatus(status) {
				switch(status) {
				  case 0 :
					return ''
					break;
				  case 1 :
					return 0
					break;
				  case 2 :
					return 1
					break;
				  case 3 :
					return 2
					break;
				  case 4 :
					return 3
					break;
				  case 5 :
					return 4
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
			
			// 删除订单事件
			deleteOrder(item) {
				this.currentSelectOrderMessage = item;
				this.deleteShow = true
			},
			
			// 删除订单确定事件
			deleteOrderSureEvent () {
				this.deleteShow = false;
				this.deleteOrderPort(this.currentSelectOrderMessage.id)
			},
			
			// 提醒派单事件
			remindSendOrdersEvent (item) {
				this.currentSelectOrderMessage = item;
				this.reminderOrderPort(this.currentSelectOrderMessage.id)
			},
			
			// 取消订单事件
			cancelOrderEvent(item) {
				this.currentSelectOrderMessage = item;
				this.tradeOrderCancancelcountEvent()
			},
			
			// 取消订单确定事件
			cancelOrderSureEvent () {
				this.cancelOrderFormShow = false;
				this.cancelOrderPort(this.currentSelectOrderMessage.id,'')
			},
			
			// 订单评价事件
			orderFormEvaluateEvent (item) {
				// 传递服务订单信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/orderFormPackage/pages/serviceEvaluate/serviceEvaluate?transmitData='+mynavData
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
			
			// 联系护士事件
			contactNurseEvent (item) {
				this.currentPageNum = 1;
				this.totalCount = 0;
				// 传递该订单详情及当前切换的订单类型的信息
				let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
				temporaryEditServiceOrderFormSureChooseMessage['orderMessage'] = item;
				temporaryEditServiceOrderFormSureChooseMessage['current'] = this.current;
				this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
				uni.navigateTo({
					url: '/messagePackage/pages/chatInterface/chatInterface?transmitData='+item.id
				})
			},
			
			// 订单详情点击事件
			enterOrderDetailsEvent (item) {
				this.currentPageNum = 1;
				this.totalCount = 0;
				// 传递该订单详情及当前切换的订单类型的信息
				let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
				temporaryEditServiceOrderFormSureChooseMessage['orderMessage'] = item;
				temporaryEditServiceOrderFormSureChooseMessage['current'] = this.current;
				this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderFormDetails/orderFormDetails'
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
		::v-deep .u-transition {
			z-index: 100000 !important;
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
		.have-cancel-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.u-modal__content {
							padding: 40px 10px !important;
							box-sizing: border-box;
							.slot-content {
								.cancel-title {
									color: #101010;
									font-size: 18px;
									text-align: center;
									margin-bottom: 12px;
								};
								.cancel-content {
									color: #EB3E67;
									font-size: 16px;
									margin-bottom: 6px;
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
		@include content-wrapper;
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
		};
		.order-form-tabs {
			z-index: 1;
			::v-deep .u-tabs {
				.u-tabs__wrapper__scroll-view {
					.u-tabs__wrapper__nav__item {
						position: relative;
						.u-badge {
							position: absolute;
							top: 0;
							right: -6px;
							background: #fff !important;
							border: 1px solid #E81F50 ;
							color: #E81F50 !important;
							width: 16px !important;
							height: 16px !important;
							border-radius: 50%;
							display: inline-block;
							text-align: center;
							line-height: 16px;
							@include no-wrap
						};
						.u-badge--not-dot {
							padding: 0 !important
						}
					}
				}
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 10px 0;
			box-sizing: border-box;
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
			.order-form-list {
				background: #fff;
				margin-bottom: 10px;
				.order-form-top {
					display: flex;
					align-items: center;
					height: 50px;
					@include bottom-border-1px(#DCDCDC);
					justify-content: space-between;
					padding: 0 8px 0 10px;
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
				};
				.order-form-bottom {
					display: flex;
					padding: 0 8px 8px 8px;
					box-sizing: border-box;
					justify-content: space-between;
					align-items: center;
					.btn-area-left {
						display: flex;
						>text {
							min-width: 78px;
							display: inline-block;
							height: 30px;
							padding: 0 12px;
							box-sizing: border-box;
							text-align: center;
							line-height: 30px;
							font-size: 14px;
							color: #fff;
							background: #289E8E;
							font-weight: 400;
							border-radius: 3px
						}
					};
					.btn-area-right {
						flex: 1;
						display: flex;
						justify-content: flex-end;
						>text {
							min-width: 78px;
							display: inline-block;
							height: 30px;
							padding: 0 12px;
							box-sizing: border-box;
							text-align: center;
							line-height: 30px;
							font-size: 14px;
							color: #666666;
							font-weight: 400;
							border: 1px solid rgba(153,153,153,1);
							border-radius: 3px;
							margin-right: 10px;
							&:last-child {
								margin-right: 0
							}
						};
						.at-once-payment {
							color: #fff;
							background: #FF698C;
							border: none !important;
							margin-right: 0 !important;
						};
						.complete-service {
							color: #fff;
							background: #FF698C;
							border: none !important;
							margin-right: 0 !important;
						};
						.evaluate {
							color: #fff;
							background: #FF698C;
							border: none !important;
							margin-right: 0 !important;
						}
					}	
				}
			}
		}
	}
</style>
