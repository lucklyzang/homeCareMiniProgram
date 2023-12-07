import request from '@/api/request';
import Qs from 'qs'

// 获的banner列表
export function getUserBannerList() {
  return request({
    url: '/app-api/radar/banner/list',
    method: 'get'
  })
};

// 获取用户基本信息
export function getUserMessage() {
  return request({
    url: '/app-api/member/user/get',
    method: 'get'
  })
};

// 修改用户信息
export function updateUserMessage(data) {
  return request({
    url: '/app-api/member/user/update',
    method: 'post',
		data
  })
};

// 修改用户头像
export function updateUserAvatar(data) {
  return request({
    url: '/app-api/member/user/update-avatar',
    method: 'post',
		data
  })
};

// 创建用户服务地址
export function createAddress(data) {
  return request({
    url: '/app-api/member/server-address/create',
    method: 'post',
		data
  })
};

// 更新用户服务地址
export function updateAddress(data) {
  return request({
    url: '/app-api/member/server-address/update',
    method: 'put',
		data
  })
};

// 获取用户服务地址列表
export function getUserAddressList(data) {
  return request({
    url: '/app-api/member/server-address/queryByUserId/list',
    method: 'get',
		params: data
  })
};

// 删除用户服务地址
export function deleteUserAddress(data) {
  return request({
    url: '/app-api/member/server-address/delete',
    method: 'delete',
		params: data
  })
};


