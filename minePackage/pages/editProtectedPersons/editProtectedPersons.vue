<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="编辑被护人" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="protected-persons-box">
			<view class="basic-information">
				<view class="basic-information-title">
					<text>基本信息</text>
				</view>
				<view class="basic-information-content">
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>被护人姓名</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入被护人姓名"
								inputAlign="right"
								border="none"
								v-model="protectedPersonsNameValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>身份证号</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入患者身份证证件号"
								@blur="idcardBlurEvent"
								inputAlign="right"
								type="idcard"
								border="none"
								v-model="idNumberValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>联系方式</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入联系方式"
								inputAlign="right"
								type="number"
								border="none"
								v-model="contactWayValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name protected-persons-name-other">
						<view class="protected-persons-name-left">
							<text>出生日期</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								disabled
								inputAlign="right"
								border="none"
								v-model="birthDateValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name protected-persons-name-other">
						<view class="protected-persons-name-left">
							<text>年龄</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
							  disabled
								inputAlign="right"
								border="none"
								v-model="ageValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name protected-persons-name-other">
						<view class="protected-persons-name-left">
							<text>性别</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								disabled
								inputAlign="right"
								border="none"
								v-model="sexValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>紧急联系人</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入联系方式"
								inputAlign="right"
								type="number"
								border="none"
								v-model="emergencyContactValue"
							></u--input>
						</view>
					</view>
				</view>
			</view>
			<view class="upload-attachment">
				<view class="upload-attachment-title">
					<text>上传相关附件</text>
				</view>
				<view class="upload-attachment-content">
					<view class="medicare-card-area">
						<view class="medicare-card-top">
							<text>医保卡正面</text>
						</view>
						<view class="medicare-card-bottom" v-if="medicareCardImgArr.length > 0">
							<view v-for="(item, index) in medicareCardImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'医保卡正面')"></u-icon>
							</view>
							<view v-if="medicareCardImgArr.length < 1">
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png" @click="getImg('医保卡正面')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="medicareCardImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('医保卡正面')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
					<view class="medicare-card-area">
						<view class="medicare-card-top">
							<text>医保卡反面</text>
						</view>
						<view class="medicare-card-bottom" v-if="reverseSideMedicareCardImgArr.length > 0">
							<view v-for="(item, index) in reverseSideMedicareCardImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'医保卡反面')"></u-icon>
							</view>
							<view v-if="reverseSideMedicareCardImgArr.length < 1">
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png" @click="getImg('医保卡反面')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="reverseSideMedicareCardImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('医保卡反面')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
					<view class="medical-record-data-area">
						<view class="medicare-card-top">
							<text>病历资料</text>
						</view>
						<view class="medicare-card-bottom" v-if="medicalRecordDataImgArr.length > 0">
							<view v-for="(item, index) in medicalRecordDataImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'病历资料')"></u-icon>
							</view>
							<view>
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('病历资料')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="medicalRecordDataImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('病历资料')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
					<view class="special-circumstances-area">
						<view class="medicare-card-top">
							<text>特殊情况</text>
						</view>
						<view class="medicare-card-bottom" v-if="specialCircumstancesImgArr.length > 0">
							<view v-for="(item, index) in specialCircumstancesImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'特殊情况')"></u-icon>
							</view>
							<view>
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('特殊情况')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="specialCircumstancesImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('特殊情况')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="saveProtectedPersonsEvent">保存被护人</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import store from '@/store'
	import _ from 'lodash'
	import {
		setCache,
		removeAllLocalStorage,
		IdCard
	} from '@/common/js/utils'
	import { updateServerPerson } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				noProtectedPersonsPng: require("@/static/img/no-protected-persons.png"),
				infoText: '编辑中···',
				personId: '',
				status: '',
				option: '',
				checkName: '',
				checkTime: '',
				realname: '',
				protectedPersonsNameValue: '',
				idNumberValue: '',
				contactWayValue: '',
				emergencyContactValue: '',
				birthDateValue: '',
				ageValue: '',
				sexValue: '',
				sureCancelShow: false,
				imgIndex: '',
				content: '',
				medicareCardFileList: [],
				reverseSideMedicareCardFileList: [],
				medicareCardRecordDataFileList: [],
				specialCircumstancesFileList: [],
				medicareCardImgArr: [],
				medicalRecordDataImgArr: [],
				reverseSideMedicareCardImgArr: [],
				specialCircumstancesImgArr: [],
				medicareCardOnlinePathArr: [],
				reverseSideMedicareCardOnlinePathArr: [],
				medicareCardRecordDataOnlinePathArr: [],
				specialCircumstancesOnlinePathArr: [],
				exitMedicareCardOnlinePathArr: [],
				exitReverseSideMedicareCardOnlinePathArr: [],
				exitMedicareCardRecordDataOnlinePathArr: [],
				exitSpecialCircumstancesOnlinePathArr: [],
				text: ''
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
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryMessage = JSON.parse(options.transmitData);
			// 回显被护人信息
			this.personId = temporaryMessage.id;
			this.status = temporaryMessage.status;
			this.option = temporaryMessage.option;
			this.checkName = temporaryMessage.checkName;
			this.checkTime = temporaryMessage.checkTime;
			this.realname = temporaryMessage.realname;
			this.protectedPersonsNameValue = temporaryMessage.name;
			this.idNumberValue = temporaryMessage.idCard;
			this.contactWayValue = temporaryMessage.mobile;
			this.birthDateValue = temporaryMessage.birthday;
			this.ageValue = temporaryMessage.age;
			this.sexValue = temporaryMessage.sex == 1 ? '男' : '女';
			this.emergencyContactValue = temporaryMessage.critical;
			this.medicareCardImgArr = !temporaryMessage.medicalCardFront ? [] : [temporaryMessage.medicalCardFront];
			this.reverseSideMedicareCardImgArr = !temporaryMessage.medicalCardBack ? [] : [temporaryMessage.medicalCardBack];
			this.medicalRecordDataImgArr = _.cloneDeep(temporaryMessage.medicalRecord);
			this.specialCircumstancesImgArr = _.cloneDeep(temporaryMessage.special);
			this.medicareCardFileList = !temporaryMessage.medicalCardFront ? [] : [temporaryMessage.medicalCardFront];
			this.reverseSideMedicareCardFileList = !temporaryMessage.medicalCardBack ? [] : [temporaryMessage.medicalCardBack];
			this.medicareCardRecordDataFileList = _.cloneDeep(temporaryMessage.medicalRecord);
			this.specialCircumstancesFileList = _.cloneDeep(temporaryMessage.special)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 身份证号输入框失去焦点事件
			idcardBlurEvent () {
				let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!regIdCard.test(this.idNumberValue)) {
					if (this.idNumberValue) {
						this.$refs.uToast.show({
							message: '身份证格式格式有误,请重新输入!',
							type: 'error',
							position: 'center'
						});
						this.birthDateValue = '';
						this.sexValue = '';
						this.ageValue = ''
					}  
				} else {
					this.birthDateValue = IdCard(this.idNumberValue,1);
					this.sexValue = IdCard(this.idNumberValue,2);
					this.ageValue = IdCard(this.idNumberValue,3)
				}
			},
			
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false
			},
			
			// 弹框确定按钮	
			sureCancel() {
				if (this.text == '医保卡正面') {
					this.medicareCardImgArr.splice(this.imgIndex, 1);
					this.medicareCardFileList.splice(this.imgIndex, 1);
				} else if (this.text == '医保卡反面') {
					this.reverseSideMedicareCardImgArr.splice(this.imgIndex, 1);
					this.reverseSideMedicareCardFileList.splice(this.imgIndex, 1);
				} else if (this.text == '病历资料') {
					this.medicalRecordDataImgArr.splice(this.imgIndex, 1);
					this.medicareCardRecordDataFileList.splice(this.imgIndex, 1);
				} else if (this.text == '特殊情况') {
					this.specialCircumstancesImgArr.splice(this.imgIndex, 1);
					this.specialCircumstancesFileList.splice(this.imgIndex, 1);
				};
				this.sureCancelShow = false
			},
			
			// 图片删除事件
			photoDelete(item, index, text) {
				this.text = text;
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 选择图片方法
			getImg(text) {
				let that = this;
				let temporaryCount = 0;
				if (text == '医保卡正面' || text == '医保卡反面') {
					temporaryCount = 1
				} else {
					temporaryCount = 3
				};
				uni.chooseImage({
					count: temporaryCount,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							if (text == '医保卡正面') {
								that.medicareCardFileList.push(res.tempFiles[imgI]['path']);
							} else if (text == '医保卡反面') {
								that.reverseSideMedicareCardFileList.push(res.tempFiles[imgI]['path']);
							} else if (text == '病历资料') {
								that.medicareCardRecordDataFileList.push(res.tempFiles[imgI]['path']);
							} else if (text == '特殊情况') {
								that.specialCircumstancesFileList.push(res.tempFiles[imgI]['path']);
							};
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									if (text == '医保卡正面') {
										that.medicareCardImgArr.push(base64);
									} else if (text == '医保卡反面') {
										that.reverseSideMedicareCardImgArr.push(base64);
									} else if (text == '病历资料') {
										that.medicalRecordDataImgArr.push(base64);
									} else if (text == '特殊情况') {
										that.specialCircumstancesImgArr.push(base64);
									}
								}
							})
						}
					}
				})
			},
			
			// 编辑被护人事件
			updateServerPersonEvent (data) {
				this.showLoadingHint = true;
				updateServerPerson(data).then((res) => {
					this.medicareCardOnlinePathArr = [];
					this.reverseSideMedicareCardOnlinePathArr = [];
					this.medicareCardRecordDataOnlinePathArr = [];
					this.specialCircumstancesOnlinePathArr = [];
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '编辑被护人成功',
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
					this.medicareCardOnlinePathArr = [];
					this.reverseSideMedicareCardOnlinePathArr = [];
					this.medicareCardRecordDataOnlinePathArr = [];
					this.specialCircumstancesOnlinePathArr = [];
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI,text) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				return new Promise((resolve, reject) => {
					uni.uploadFile({
					 url: 'https://dev.nurse.blinktech.cn/nurse/app-api/infra/file/upload',
					 filePath: imgI,
					 name: 'file',
					 header: {
						'content-type': 'multipart/form-data',
						'Authorization': `Bearer ${store.getters.token}`
					 },
					 success: (res) => {
						if (res.statusCode == 200) {
							let temporaryData = JSON.parse(res.data);
							if (text == '医保卡正面') {
								this.medicareCardOnlinePathArr.push(temporaryData.data);
							} else if (text == '医保卡反面') {
								this.reverseSideMedicareCardOnlinePathArr.push(temporaryData.data);
							} else if (text == '病历资料') {
								this.medicareCardRecordDataOnlinePathArr.push(temporaryData.data);
							} else if (text == '特殊情况') {
								this.specialCircumstancesOnlinePathArr.push(temporaryData.data);
							};
							resolve()
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '上传图片失败',
								type: 'error',
								position: 'center'
							});
							reject()
						}
					 },
					 fail: (err) => {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: err,
							type: 'error',
							position: 'center'
						});
						reject()
					 }
					})
				})
			},
			
			// 编辑被护人事件
			async saveProtectedPersonsEvent () {
				let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!this.protectedPersonsNameValue) {
					this.$refs.uToast.show({
						message: '被护人姓名不能为空',
						type: 'error',
						position: 'center'
					});
					return
				} else if (!this.idNumberValue) {
					this.$refs.uToast.show({
						message: '身份证号不能为空',
						type: 'error',
						position: 'center'
					});
					return
				} else if (!this.contactWayValue) {
					this.$refs.uToast.show({
						message: '联系方式不能为空',
						type: 'error',
						position: 'center'
					});
					return
				} else if (!this.emergencyContactValue) {
					this.$refs.uToast.show({
						message: '紧急联系人不能为空',
						type: 'error',
						position: 'center'
					});
					return
				} else if (!regIdCard.test(this.idNumberValue)) {
					if (this.idNumberValue) {
						this.$refs.uToast.show({
							message: '身份证格式格式有误,请重新输入!',
							type: 'error',
							position: 'center'
						});
						return
					}
				};
				// 上传图片文件流到服务端(医保卡正面)
				if (this.medicareCardFileList.length > 0) {
					// 已经上传过的文件不在上传
					let temporaryProblemPicturesList = this.medicareCardFileList.filter((item) => { return item.indexOf('https://') == -1});
					this.exitMedicareCardOnlinePathArr = this.medicareCardFileList.filter((item) => { return item.indexOf('https://') != -1});
					for (let imgI of temporaryProblemPicturesList) {
						await this.uploadFileEvent(imgI,'医保卡正面')
					}
				};
				// 上传图片文件流到服务端(医保卡反面面)
				if (this.reverseSideMedicareCardFileList.length > 0) {
					// 已经上传过的文件不在上传
					let temporaryProblemPicturesList = this.reverseSideMedicareCardFileList.filter((item) => { return item.indexOf('https://') == -1});
					this.exitReverseSideMedicareCardOnlinePathArr = this.reverseSideMedicareCardFileList.filter((item) => { return item.indexOf('https://') != -1});
					for (let imgI of temporaryProblemPicturesList) {
						await this.uploadFileEvent(imgI,'医保卡反面')
					}
				};
				// 上传图片文件流到服务端(病历资料)
				if (this.medicareCardRecordDataFileList.length > 0) {
					// 已经上传过的文件不在上传
					let temporaryProblemPicturesList = this.medicareCardRecordDataFileList.filter((item) => { return item.indexOf('https://') == -1});
					this.exitMedicareCardRecordDataOnlinePathArr = this.medicareCardRecordDataFileList.filter((item) => { return item.indexOf('https://') != -1});
					for (let imgI of temporaryProblemPicturesList) {
						await this.uploadFileEvent(imgI,'病历资料')
					}
				};
				// 上传图片文件流到服务端(特殊情况)
				if (this.specialCircumstancesFileList.length > 0) {
					// 已经上传过的文件不在上传
					let temporaryProblemPicturesList = this.specialCircumstancesFileList.filter((item) => { return item.indexOf('https://') == -1});
					this.exitSpecialCircumstancesOnlinePathArr = this.specialCircumstancesFileList.filter((item) => { return item.indexOf('https://') != -1});
					for (let imgI of temporaryProblemPicturesList) {
						await this.uploadFileEvent(imgI,'特殊情况')
					}
				};
				let data = {
					id: this.personId,
					name: this.protectedPersonsNameValue,
					idCard: this.idNumberValue,
					mobile: this.contactWayValue,
					birthday: this.birthDateValue,
					sex: this.sexValue == '男' ? 1 : 2,
					age: this.ageValue,
					critical: this.emergencyContactValue,
					realname: this.realname,
					medicalCardFront: !(this.medicareCardOnlinePathArr.concat(this.exitMedicareCardOnlinePathArr))[0] ? '' :  (this.medicareCardOnlinePathArr.concat(this.exitMedicareCardOnlinePathArr))[0],
					medicalCardBack: !(this.reverseSideMedicareCardOnlinePathArr.concat(this.exitReverseSideMedicareCardOnlinePathArr))[0] ? '' : (this.reverseSideMedicareCardOnlinePathArr.concat(this.exitReverseSideMedicareCardOnlinePathArr))[0],
					medicalRecord: this.medicareCardRecordDataOnlinePathArr.concat(this.exitMedicareCardRecordDataOnlinePathArr),
					special: this.specialCircumstancesOnlinePathArr.concat(this.exitSpecialCircumstancesOnlinePathArr),
					status: this.status,
					checkName: this.checkName,
					checkTime: this.checkTime,
					opinion: this.opinion
				};
				this.updateServerPersonEvent(data)
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
		::v-deep .u-popup {
			flex: none !important
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
		.protected-persons-box {
			flex: 1;
			overflow: auto;
			padding: 0 0 10px 0;
			box-sizing: border-box;
			.basic-information {
				.basic-information-title {
					height: 30px;
					line-height: 30px;
					padding-left: 14px;
					box-sizing: border-box;
					>text {
						font-size: 14px;
						color: #101010
					}
				};
				.basic-information-content {
					.protected-persons-name-other {
						.protected-persons-name-left {
							>text {
								&:nth-child(1) {
									padding-left: 10px !important;
									font-size: 14px;
									color: #101010 !important
								}
							}
						}	
					};
					.protected-persons-name {
						margin-bottom: 2px;
						padding: 0 4px;
						box-sizing: border-box;
						height: 43px;
						background: #fff;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.protected-persons-name-left {
							>text {
								&:nth-child(1) {
									color: red;
									margin-right: 2px
								};
								&:nth-child(2) {
									font-size: 14px;
									color: #101010
								};
							}
						};
						.protected-persons-name-input {
							flex: 1;
							margin-left: 10px;
						}
					}
				}
			};
			.upload-attachment {
				padding: 0 10px;
				box-sizing: border-box;
				.upload-attachment-title {
					height: 30px;
					line-height: 30px;
					>text {
						font-size: 14px;
						color: #101010
					}
				};
				.upload-attachment-content {
					>view {
						border-radius: 5px;
						background: #fff;
						margin-bottom: 10px;
						padding: 4px 6px;
						box-sizing: border-box;
						.medicare-card-top {
							>text {
								font-size: 12px;
								color: #101010
							}
						};
						.medicare-card-bottom {
							margin-top: 6px;
							width: 100%;
							font-size: 34px;
							>view {
								width: 32%;
								height: 100px;
								display: inline-block;
								vertical-align: top;
								margin-right: 2%;
								margin-top: 2%;
								position: relative;
								&:nth-child(1) {
									margin-top: 0;
								};
								&:nth-child(2) {
									margin-top: 0;
								};
								&:nth-child(3) {
									margin-top: 0;
								};
								&:nth-child(3n+3) {
									margin-right: 0;
								};
								::v-deep .u-icon__icon {
									position: absolute;
									top: -12px;
									right: 0
								};
								image {
									width: 100%;
									height: 100%
								}
							}
						};
						.medicare-cara-init {
							display: flex;
							justify-content: center;
							flex-direction: column;
							align-items: center;
							>image {
								width: 64px;
								height: 64px;
							};
							>text {
								margin-top: 4px;
								font-size: 12px;
								color: #101010
							}
						}
					};
					.medicare-card-area {
						.medicare-card-bottom {
							display: flex;
							justify-content: center;
							>view {
								width: 80% !important
							}
						}
					}
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
