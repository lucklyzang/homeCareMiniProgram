import request from '@/api/request';
import Qs from 'qs'

// 获取首页配置
export function getHomePage(data) {
  return request({
    url: '/app-api/member/home-page/get',
    method: 'get',
		params: data
  })
};

// 获取首页配置列表
export function getHomePageList(data) {
  return request({
    url: '/app-api/member/home-page/list',
    method: 'get',
		params: data
  })
};

// 删除首页数据卡片
export function deleteHomePage(data) {
  return request({
    url: '/app-api/member/home-page/delete',
    method: 'delete',
		params: data
  })
};

// 创建首页数据卡片
export function createHomePage(data) {
  return request({
    url: '/app-api/member/home-page/create',
    method: 'post',
		data
  })
};

// 保存或更新首页数据卡片
export function saveOrUpdateHomePage(data) {
  return request({
    url: '/app-api/member/home-page/saveOrUpdate',
    method: 'put',
		data
  })
};

// 首页数据卡片绑定设备
export function homePageBindDevice(data) {
  return request({
    url: '/app-api/member/home-page/bind-device',
    method: 'put',
		data
  })
};