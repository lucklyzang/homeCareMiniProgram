import request from '@/api/request';
import Qs from 'qs'

// 创建交易订单
export function createOrder(data) {
  return request({
    url: '/app-api/trade/order/create',
    method: 'post',
		data
  })
};

// 修改订单
export function editOrder(data) {
  return request({
    url: '/app-api/trade/order/update',
    method: 'put',
		data
  })
};

// 查询可取消剩余次数
export function tradeOrderCancancelcount() {
  return request({
    url: '/app-api/trade/order/can-cancel-count',
    method: 'put'
  })
};

// 用户催单
export function reminderOrder(id) {
  return request({
    url: `/app-api/trade/order/reminder?id=${id}`,
    method: 'put'
  })
};

// 取消交易订单
export function cancelOrder(id,reason) {
  return request({
    url: `/app-api/trade/order/cancel?id=${id}&reason=${reason}`,
    method: 'delete'
  })
};

// 退款(订单已完成)
export function afterSaleOrder(data) {
  return request({
    url: '/app-api/trade/after-sale/create',
    method: 'post',
		data
  })
};

// 删除交易订单
export function deleteOrder(id) {
  return request({
    url: `/app-api/trade/order/delete?id=${id}`,
    method: 'delete'
  })
};

// 获取支付订单
export function createPayOrder(data) {
  return request({
    url: '/app-api/pay/order/get',
    method: 'get',
		params: data
  })
};

// 获得交易订单数量
export function getTradeOrderCount() {
  return request({
    url: '/app-api/trade/order/get-count',
    method: 'get'
  })
};

// 查询服务时间
export function getServiceTime(data) {
  return request({
    url: '/app-api/trade/order/get-service-time',
    method: 'get',
		params: data
  })
};

// 提交支付订单
export function submitPayOrder(data) {
  return request({
    url: '/app-api/pay/order/submit',
    method: 'post',
		data
  })
};

// 获取支付渠道列表
export function getEnableCodeList(data) {
  return request({
    url: '/app-api/pay/channel/get-enable-code-list',
    method: 'get',
		params: data
  })
};

// 创建交易订单项评价
export function createOrderComment(data) {
  return request({
    url: '/app-api/trade/order/item/create-comment',
    method: 'post',
		data
  })
};

// 获取交易订单分页
export function getTradeOrderPage(data) {
  return request({
    url: '/app-api/trade/order/page',
    method: 'get',
		params: data
  })
};

// 获取交易订单详情
export function getOrderDetail(data) {
  return request({
    url: '/app-api/trade/order/get-detail',
    method: 'get',
		params: data
  })
};

// 查询交易订单用户和医护信息
export function getTradeOrderUserCareInfo(data) {
  return request({
    url: '/app-api/trade/order/get-user-care-info',
    method: 'get',
		params: data
  })
};