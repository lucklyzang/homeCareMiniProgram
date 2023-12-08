import request from '@/api/request';
import Qs from 'qs'

// 获的banner列表
export function getUserBannerList(data) {
  return request({
    url: '/app-api/promotion/banner/list',
    method: 'get',
		params: data
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

// 获取我的收藏医护
export function getUserCollectNurse(data) {
  return request({
    url: '/app-api/hospital/medical-care/favorite-page',
    method: 'get',
		params: data
  })
}

// 获取医护(首页)
export function getNurse(data) {
  return request({
    url: '/app-api/hospital/medical-care/page',
    method: 'get',
		params: data
  })
}

// 获取推荐商品(首页显示)
export function getHomeHotProduct(data) {
  return request({
    url: '/app-api/product/spu/list',
    method: 'get',
		params: data
  })
}

// 获取商品分类(首页显示)
export function getHomeProductCategory() {
  return request({
    url: '/app-api/product/category/index',
    method: 'get'
  })
}

// 创建医护收藏
export function createNurseFavorite(data) {
  return request({
    url: '/app-api/hospital/care-favorite/create',
    method: 'post',
		data
  })
}

// 校验医护是否收藏
export function verifyNurseFavorite(data) {
  return request({
    url: '/app-api/hospital/care-favorite/get',
    method: 'get',
		params: data
  })
}

// 删除医护收藏
export function deleteNurseFavorite(data) {
  return request({
    url: '/app-api/hospital/care-favorite/delete',
    method: 'delete',
		params: data
  })
}