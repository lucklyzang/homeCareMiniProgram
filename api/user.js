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

// 记录banner浏览次数
export function recordBannerBrowse(data) {
  return request({
    url: '/app-api/promotion/banner/browse',
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
    method: 'put',
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

// 更新用户默认服务地址
export function updateDefaultAddress(data) {
  return request({
    url: '/app-api/member/server-address/updateAddressDefaultStatus',
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
export function getNurseHome() {
  return request({
    url: '/app-api/hospital/medical-care/list',
    method: 'get'
  })
}

// 获取医护
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

// 创建资讯收藏
export function createInformationFavorite(data) {
  return request({
    url: '/app-api/promotion/information/add/collect',
    method: 'post',
		data
  })
}

// 取消资讯收藏
export function deleteInformationFavorite(data) {
  return request({
    url: '/app-api/promotion/information/delete/collect',
    method: 'post',
		data
  })
}

// 获取我的收藏列表
export function myCollectInformationList(data) {
  return request({
    url: '/app-api/promotion/information/page/favorites',
    method: 'get',
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
		data
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

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/app-api/infra/file/upload',
    method: 'post',
		data
  })
}

// 标记站内信为已读(通知)
export function updateNotifymessageRead(ids) {
  return request({
    url: `/app-api/system/notify-message/update-read?ids=${ids}`,
    method: 'put'
  })
}

// 标记站内信全读(通知)
export function updateNotifymessageAllRead() {
  return request({
    url: '/app-api/system/notify-message/update-all-read',
    method: 'put'
  })
}


// 查询通知概要
export function notifyMessageSummary() {
  return request({
    url: '/app-api/system/notify-message/summary',
    method: 'get'
  })
}

// 获得我的通知信息分页
export function notifyMessageSummaryPage(data) {
  return request({
    url: '/app-api/system/notify-message/my-page',
    method: 'get',
		params: data
  })
}

// 标记公告为已读
export function updateNotifyRead(id) {
  return request({
    url: `/app-api/system/notice/update-read?id=${id}`,
    method: 'put'
  })
}

// 标记公告全读
export function updateNotifyAllRead() {
  return request({
    url: `/app-api/system/notice/update-all-read`,
    method: 'put'
  })
}

// 查询公告概要
export function notifySummary(data) {
  return request({
    url: '/app-api/system/notice/summary',
    method: 'get',
		params: data
  })
}

// 获得公告信息分页
export function notifySummaryPage(data) {
  return request({
    url: '/app-api/system/notice/page',
    method: 'get',
		params: data
  })
}

// 获取最新一条未读资讯
export function latestNews(data) {
  return request({
    url: '/app-api/promotion/information/get/latest/summary',
    method: 'get',
		params: data
  })
}

// 获取资讯分页
export function newsPage(data) {
  return request({
    url: '/app-api/promotion/information/page',
    method: 'get',
		params: data
  })
}

// 资讯标记已读(单条资讯)
export function updateNewsRead(data) {
  return request({
    url: '/app-api/promotion/information/update/read',
    method: 'put',
		data
  })
}

// 资讯标记全读
export function updateInformationRead(data) {
  return request({
    url: '/app-api/promotion/information/update/allRead',
    method: 'put',
		data
  })
}

// 获取资讯详情
export function getNewsDetails(data) {
  return request({
    url: '/app-api/promotion/information/getDetails',
    method: 'get',
		params: data
  })
}

// 获取用户聊天列表
export function getUserChatList() {
  return request({
    url: '/app-api/infra/chat-message/chat-users',
    method: 'get'
  })
}

// 更新聊天消息为已读
export function chatMessageRead(fromId) {
  return request({
    url: `/app-api/infra/chat-message/read?fromId=${fromId}`,
    method: 'put'
  })
}

// 获取用户聊天消息分页
export function getUserChatPage(data) {
  return request({
    url: '/app-api/infra/chat-message/page',
    method: 'get',
		params: data
  })
}

// 获得组织机构列表
export function getOrganizationList(data) {
  return request({
    url: '/app-api/system/organization/list',
    method: 'get',
		params: data
  })
};

// 修改手机号
export function updateMobile(data) {
  return request({
    url: '/app-api/member/user/update-mobile',
    method: 'put',
		data
  })
};

// 获取搜索词组记录
export function getSearchPhrase(data) {
  return request({
    url: '/app-api/promotion/search-phrase/showSearchPhrase',
    method: 'get',
		params: data
  })
};

// 删除单个搜索词组记录
export function deleteHisOne(type,data) {
  return request({
    url: `/app-api/promotion/search-phrase/deleteHisOne/${type}`,
    method: 'delete',
		params: data
  })
};

// 删除全部搜索词组记录
export function deleteHisAll(type) {
  return request({
    url: `/app-api/promotion/search-phrase/deleteHisAll/${type}`,
    method: 'delete'
  })
};