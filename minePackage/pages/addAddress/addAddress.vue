<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<Winglau14-lotusAddress ref="lotusAddress" v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></Winglau14-lotusAddress>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="地址管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="address-list-box">
			<view class="site-box">
				<view class="site-left">
					<text>省市地址</text>
				</view>
				<view class="site-center" @click="openPicker">
					<text>{{ region }}</text>
				</view>
				<view class="site-right" @click="mapChooseSiteEvent">
					<text>定位</text>
					<image :src="addressBlackIconPng"></image>
				</view>
			</view>
			<view class="details-site-box">
				<text>详细地址</text>
				<u--textarea  maxlength="50" height="120" ref="textarea" autoHeight v-model="detailSiteValue" :count="true" placeholder="请输入详细地址" ></u--textarea>
			</view>
			<view class="default-site-radio-box">
				<text>默认地址</text>
				<u-checkbox-group 
						v-model="checked"
						 @change="checkboxChange"
						shape="circle">
					<u-checkbox activeColor="#F16C8C" size="24" iconSize="20" name="默认地址"></u-checkbox>
				</u-checkbox-group>
			</view>
		</view>
		<view class="add-btn">
			<text @click="sureSaveEvent">确认保存</text>
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { createAddress } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				areaId: '',
				addressBlackIconPng: require("@/static/img/address-black-icon.png"),
				lotusAddressData:{
					visible: false,
					provinceName:'',
					cityName:'',
					townName:''
				},
				region: '点击选择所在地址',
				infoText: '加载中',
				detailSiteValue: '',
				checked: ["默认地址"]
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
		},
		onReady() {
			this.$refs.textarea.setFormatter(this.formatter)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 详细地址内容过滤空格函数
			formatter(value) {
				return value.replace(/^\s+|\s+$/g, '')
			},
			
			checkboxChange (n) {
				console.log('change', n);
			},
			
			// 打开地址选择弹框
			openPicker () {
				this.lotusAddressData.visible = true
			},
			
			//回传已选的省市区的值
			choseValue (res) {
				this.areaId = res.townCode;
				if (res.province === '海外' || res.province === '台湾省' || res.province === '香港特别行政区' || res.province === '澳门特别行政区') {
					this.areaId = res.provinceCode;
				};
				//res数据源包括已选省市区与省市区code
				this.lotusAddressData.visible = res.visible; //visible为显示与关闭组件标识true显示false隐藏
				//res.isChose = 1省市区已选 res.isChose = 0;未选
				if (res.isChose || res.province == '海外') {
					this.lotusAddressData.provinceName = res.province; //省
					this.lotusAddressData.cityName = res.city; //市
					this.lotusAddressData.townName = res.town; //区
					this.region = `${res.province} ${res.city} ${res.town}`; //region为已选的省市区的值
				}
			},
			
			// 地图选址地点后的回调函数
			prevDateFun (object) {
				if(object){
					// this.$refs['lotusAddress'].initFn();
					let temporaryAddress = object;
					let reg = /.+?(省|市|自治区|自治州|特别行政区|县|区|盟|旗)/g;
					let regOther = /((.+?(省|市|自治区|自治州|特别行政区|县|区|盟|旗))+?|.+)/g;
					let cutoutAddressArray = temporaryAddress['address'].match(reg);
					let cutoutAddressDetails = temporaryAddress['address'].replace(/.+?(省|市|自治区|自治州|特别行政区|县|区|盟|旗)/g,'');
					if (cutoutAddressArray[0] == '北京市' || cutoutAddressArray[0] == '重庆市' || cutoutAddressArray[0] == '上海市' || cutoutAddressArray[0] == '天津市') {
						if (cutoutAddressArray[0] == '北京市') {
							cutoutAddressArray.unshift('北京')
						} else if (cutoutAddressArray[0] == '重庆市') {
							cutoutAddressArray.unshift('重庆')
						} else if (cutoutAddressArray[0] == '上海市') {
							cutoutAddressArray.unshift('上海')
						} else if (cutoutAddressArray[0] == '天津市') {
							cutoutAddressArray.unshift('天津')
						}
					};
					if (cutoutAddressArray.length > 3) {
						cutoutAddressArray.splice(3)
					};
					if (cutoutAddressArray.length == 3) {
						this.lotusAddressData.provinceName = cutoutAddressArray[0]; //省
						this.lotusAddressData.cityName = cutoutAddressArray[1]; //市
						this.lotusAddressData.townName = cutoutAddressArray[2]; //区/县
					} else if (cutoutAddressArray.length == 2) {
						this.lotusAddressData.provinceName = cutoutAddressArray[0]; //省
						this.lotusAddressData.cityName = cutoutAddressArray[1]; //市
						this.lotusAddressData.townName = ''; //区/县
					} else if (cutoutAddressArray.length == 1) {
						this.lotusAddressData.provinceName = cutoutAddressArray[0]; //省
						this.lotusAddressData.cityName = ''; //市
						this.lotusAddressData.townName = ''; //区/县
					};
					this.region = cutoutAddressArray.join(" ");
					this.detailSiteValue = `${cutoutAddressDetails}${temporaryAddress.name}`;
					this.openPicker()
				} else {
					return
				}
			},


			// 地图选择地址事件
			mapChooseSiteEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/mapChooseAddress/mapChooseAddress'
				})
			},
			
			// 创建用户收获地址
			createUserAddress (data) {
				this.showLoadingHint = true;
				createAddress(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '地址创建成功',
							type: 'success',
							position: 'center'
						});
						uni.navigateBack()
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 确认保存事件
			sureSaveEvent () {
				if (this.region == '点击选择所在地址') {
					this.$refs.uToast.show({
						message: '省市区/县不能为空',
						type: 'error',
						position: 'center'
					});
					return
				} else if (!this.detailSiteValue) {
					this.$refs.uToast.show({
						message: '详细地址不能为空',
						type: 'error',
						position: 'center'
					});
					return
				};
				let data = {
					userId: this.userInfo.userId,
					areaId: this.areaId,
					address: this.region.replaceAll(" ",""),
					detailAddress: this.detailSiteValue,
					defaultStatus: JSON.stringify(this.checked) == '["默认地址"]' ? true : false,
					coordinate: ""
				};
				this.createUserAddress(data)
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
		background: #f1f1f1;
		position: relative;
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 20000;
		};
		.top-area-box {
			position: relative;
			background: #F8F8F8;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #F8F8F8;
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
		.address-list-box {
			flex: 1;
			overflow: auto;
			padding: 0 0 10px 0;
			box-sizing: border-box;
			.site-box {
				height: 100px;
				background: #fff;
				display: flex;
				align-items: center;
				padding: 0 6px;
				box-sizing: border-box;
				margin-bottom: 2px;
				.site-left {
					font-size: 14px;
					color: #333838
				};
				.site-center {
					flex: 1;
					margin: 0 10px;
					height: 40px;
					display: flex;
					align-items: center;
					padding-left: 14px;
					box-sizing: border-box;
					background: #E3E3E3;
					border-radius: 4px;
					@include no-wrap;
					>text {
						width: 100%;
						font-size: 14px;
						color: #020202;
						@include no-wrap;
					}
				};
				.site-right {
					font-size: 14px;
					color: #686868;
					>image {
						width: 26px;
						height: 33px;
						vertical-align: middle;
						margin-left: 2px;
					}
				}
			};
			.details-site-box {
				min-height: 120px;
				background: #fff;
				display: flex;
				padding: 8px 6px;
				box-sizing: border-box;
				>text {
					padding-top: 10px;
					box-sizing: border-box;
					margin-right: 20px;
					font-size: 14px;
					color: #333838
				};
				::v-deep .u-textarea {
					border: none !important;
					background: #F8F8F8 !important;
					padding: 10px !important;
					border-radius: 4px !important;
					.u-textarea__count {
						background: #F8F8F8 !important;
					}
				}
			};
			.default-site-radio-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 6px;
				box-sizing: border-box;
				background: #fff;
				height: 40px;
				margin-top: 10px;
				>text {
					font-size: 14px;
					color: #333838
				}
			}
		};
		.add-btn {
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			>text {
				width: 94%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				font-size: 18px;
				color: #FFFFFF;
				background: #F16C8C;
				border-radius: 10px;
			}
		}
	}
</style>
