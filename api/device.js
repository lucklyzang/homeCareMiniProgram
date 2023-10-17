import request from '@/api/request';
import Qs from 'qs'

// 获取设备通知
export function getDeviceInform() {
  return request({
    url: '/app-api/member/device-notice/get',
    method: 'get'
  })
};

// 获取设备通知列表
export function getDeviceInformList() {
  return request({
    url: '/app-api/member/device-notice/list',
    method: 'get'
  })
};

// 获取设备通知分页
export function getDeviceInforPage(data) {
  return request({
    url: '/app-api/member/device-notice/page',
    method: 'get',
		params: data
  })
};

// 删除设备通知
export function deleteDeviceInformList() {
  return request({
    url: '/app-api/member/device-notice/delete',
    method: 'delete'
  })
};

// 查询未读消息数量
export function getDeviceInformUnread(data) {
  return request({
    url: '/app-api/member/device-notice/unRead',
    method: 'get',
		params: data
  })
};

// 创建设备通知
export function createDeviceInform() {
  return request({
    url: '/app-api/member/device-notice/create',
    method: 'post'
  })
};

// 更新设备通知
export function updateDeviceInform() {
  return request({
    url: '/app-api/member/device-notice/update',
    method: 'put'
  })
};

// 更新设备通知为已读
export function updateDeviceInformRead(id) {
  return request({
    url: '/app-api/member/device-notice/read?id='+id,
    method: 'put'
  })
};

// 获得人体监测雷达设置
export function getDetectionAlarmSettings(data) {
  return request({
    url: '/app-api/member/detection-alarm-settings/get',
    method: 'get',
		params: data
  })
};

// 更新人体监测雷达设置
export function updateDetectionAlarmSettings(data) {
  return request({
    url: '/app-api/member/detection-alarm-settings/update',
    method: 'put',
		data
  })
};

// 删除人体监测雷达设置
export function deleteDetectionAlarmSettings(data) {
  return request({
    url: '/app-api/member/detection-alarm-settings/delete',
    method: 'delete',
		params: data
  })
};

// 获得人员存在感知雷达设置
export function getExistAlarmSettings(data) {
  return request({
    url: '/app-api/member/exist-alarm-settings/get',
    method: 'get',
		params: data
  })
};

// 更新人员存在感知雷达设置
export function updateExistAlarmSettings(data) {
  return request({
    url: '/app-api/member/exist-alarm-settings/update',
    method: 'put',
		data
  })
};

// 删除人员存在感知雷达设置
export function deleteExistAlarmSettings(data) {
  return request({
    url: '/app-api/member/exist-alarm-settings/delete',
    method: 'delete',
		params: data
  })
};

// 获得跌倒监测雷达设置
export function getFallAlarmSettings(data) {
  return request({
    url: '/app-api/member/fall-alarm-settings/get',
    method: 'get',
		params: data
  })
};

// 更新跌倒监测雷达设置
export function updateFallAlarmSettings(data) {
  return request({
    url: '/app-api/member/fall-alarm-settings/update',
    method: 'put',
		data
  })
};

// 删除跌倒监测雷达设置
export function deleteFallAlarmSettings(data) {
  return request({
    url: '/app-api/member/fall-alarm-settings/delete',
    method: 'delete',
		params: data
  })
};

// 获得体征检测雷达设置
export function getHealthAlarmSettings(data) {
  return request({
    url: '/app-api/member/health-alarm-settings/get',
    method: 'get',
		params: data
  })
};

// 更新体征检测雷达设置
export function updateHealthAlarmSettings(data) {
  return request({
    url: '/app-api/member/health-alarm-settings/update',
    method: 'put',
		data
  })
};

// 删除体征检测雷达设置
export function deleteHealthAlarmSettings(data) {
  return request({
    url: '/app-api/member/health-alarm-settings/delete',
    method: 'delete',
		params: data
  })
};

// 校验设备是否存在
export function checkDeviceIsExist(data) {
  return request({
    url: '/app-api/member/device-user/check-device',
    method: 'get',
		params: data
  })
};

// 获取睡眠统计记录(详情周月数据)
export function sleepStatisticsHome(data) {
  return request({
    url: '/app-api/radar/health-statistics/list',
    method: 'get',
		params: data
  })
};

// 获取体征统计数据(首页专用和详情的日数据调用)
export function sleepStatisticsDetails(data) {
  return request({
    url: '/app-api/radar/health-data/list',
    method: 'get',
		params: data
  })
};

// 获取离、回家数据(通用)
export function enterLeaveHomeDetails(data) {
  return request({
    url: '/app-api/radar/line-rule-data/enter-leave',
    method: 'get',
		params: data
  })
};

// 获取离、回家数据日志
export function getBodyDetectionRadar(data) {
  return request({
    url: '/app-api/radar/line-rule-data/page',
    method: 'get',
		params: data
  })
};

// 获取跌倒数据日志
export function getTumbleRadar(data) {
  return request({
    url: '/app-api/radar/line-rule-data/page',
    method: 'get',
		params: data
  })
};

// 获取入厕数据日志
export function getExistPerceptionRadar(data) {
  return request({
    url: '/app-api/radar/line-rule-data/page',
    method: 'get',
		params: data
  })
};

// 获取心率、呼吸数据日志
export function getsignMonitorRadar(data) {
  return request({
    url: '/app-api/radar/health-data/log',
    method: 'get',
		params: data
  })
};

// 获取离、回家数据详情
export function getBodyDetectionRadarDetails(data) {
  return request({
    url: '/app-api/radar/line-rule-data/enter-leave-detail',
    method: 'get',
		params: data
  })
};