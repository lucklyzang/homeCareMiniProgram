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

// 用户催单
export function reminderOrder(id) {
  return request({
    url: `/app-api/trade/order/reminder?id=${id}`,
    method: 'put'
  })
};

// 取消交易订单
export function cancelOrder(data) {
  return request({
    url: '/app-api/trade/order/cancel',
    method: 'delete',
		params: data
  })
};

// 删除交易订单
export function deleteOrder(data) {
  return request({
    url: '/app-api/trade/order/delete',
    method: 'delete',
		params: data
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