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
    url: '/app-api/member/server-address/list',
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
		params: data,
		paramsSerializer: function (params) {
			return Qs.stringify(params, { arrayFormat: "repeat" });  
		}
  })
}

// 获取医护(详情)
export function getNurseDetails(data) {
  return request({
    url: '/app-api/hospital/medical-care/get',
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

// 获取商品分类(服务页显示)
export function getServiceProductCategory() {
  return request({
    url: '/app-api/product/category/list',
    method: 'get'
  })
}

// 获取商品明细
export function getServiceProductCategoryDetails(data) {
  return request({
    url: '/app-api/product/spu/page',
    method: 'get',
		params: data,
		paramsSerializer: function (params) {
			return Qs.stringify(params, { arrayFormat: "repeat" });  
		}
  })
}

// 获取商品详情
export function getProductDetails(data) {
  return request({
    url: '/app-api/product/spu/get-detail',
    method: 'get',
		params: data
  })
}

// 获取商品评价
export function getProductComment(data) {
  return request({
    url: '/app-api/product/comment/page',
    method: 'get',
		params: data
  })
}

// 获取商品评价(指定条数)
export function getProductCommentList(data) {
  return request({
    url: '/app-api/product/comment/list',
    method: 'get',
		params: data
  })
}

// 创建医护收藏
export function createNurseFavorite(careId) {
  return request({
    url: `/app-api/hospital/care-favorite/create?careId=${careId}`,
    method: 'post'
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

// 创建被服务人
export function createServerPerson(data) {
  return request({
    url: '/app-api/member/server-person/create',
    method: 'post',
		data
  })
}

// 获取被服务人
export function getServerPerson(data) {
  return request({
    url: '/app-api/member/server-person/page',
    method: 'get',
		params: data
  })
}

// 删除被服务人
export function deleteServerPerson(data) {
  return request({
    url: '/app-api/member/server-person/delete',
    method: 'delete',
		params: data
  })
}

// 更新被服务人
export function updateServerPerson(data) {
  return request({
    url: '/app-api/member/server-person/update',
    method: 'put',
		params: data
  })
}

// 获取商品收藏分页
export function getProductFavorite(data) {
  return request({
    url: '/app-api/product/favorite/page',
    method: 'get',
		params: data
  })
}

// 创建商品收藏
export function createProductFavorite(data) {
  return request({
    url: '/app-api/product/favorite/create',
    method: 'post',
		data
  })
}

// 删除商品收藏
export function deleteProductFavorite(data) {
  return request({
    url: '/app-api/product/favorite/delete',
    method: 'delete',
		data
  })
}

// 检查是否收藏过商品
export function examineProductFavorite(data) {
  return request({
    url: '/app-api/product/favorite/exits',
    method: 'get',
		params: data
  })
}

