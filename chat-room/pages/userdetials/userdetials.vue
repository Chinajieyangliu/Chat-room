<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @click="backone">
				<span style="font-size: 30rpx;">返回</span>
			</view>
			<view class="top-bar-center ">
				<span class="title">详情</span>
			</view>
			<view class="top-bar-right pice"></view>
		</view>
		
		<!-- 主题开始 -->
		<view class="main">
			<view class="column">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head">
						<image class="user-img" src="../../static/images/userMessage/two.webp" ></image>
					</view>
					<view class="more"  v-if="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
					
				</view>
				
				<view class="row" @tap="addFriendAnimat(false)">
					<view class="title">签名</view>
					<view class="user-head">
						<view class="user-message">{{user.explain}}</view>
					</view>

					<view class="more" v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">时间</view>
					<view class="user-head">
						<view class="user-message">{{user.time}}</view>
					</view>
					<view class="more"  v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">昵称</view>
					<view class="user-head">
						<view class="user-message">{{user.name}}</view>
					</view>
					<view class="more" v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">性别</view>
					<view class="user-head">
						<view class="user-message">
							
									<view class="uni-title uni-common-pl"></view>
									<view class="uni-list">
										<view class="uni-list-cell">
											<view class="uni-list-cell-left">
											</view>
											<view class="uni-list-cell-db">
												<picker @change="bindPickerChange" :value="index" :range="array">
													<view class="uni-input">{{array[index]}}</view>
												</picker>
											</view>
										</view>
									</view>
							
						</view>
					</view>
					<view class="more" v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">生日</view>
					<view class="user-head">
						<view class="user-message">
											<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
												<view class="uni-input">{{date}}</view>
											</picker>
							
						</view>
					</view>
					<view class="more" v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">电话</view>
					<view class="user-head">
						<view class="user-message">{{user.phone}}</view>
					</view>
					<view class="more" v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">邮箱</view>
					<view class="user-head">
						<view class="user-message">{{user.email}}</view>
					</view>
					<view class="more" v-show="userMessages.uid==fid">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
				<view class="row" v-show="userMessages.uid==fid">
					<view class="title">密码</view>
					<view class="user-head">
						<view class="user-message">4545645646454</view>
					</view>
					<view class="more">
						<image src="../../static/images/userdetials/左去@2x.png" mode="aspectFill"></image>
					</view>
				</view>
				
			</view>
			<view class="bt2" v-show="userMessages.uid==fid">
				退出登录
			</view>
		</view>
		<view class="modify" :style="{bottom:-bgheight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="changeUserMes">取消</view>
				<view class="title">签名</view>
				<view class="define" @tap="changeUserMes">确定</view>
			</view>
			<view class="modify-main">
				<input class="modify-pwd" type="text" v-model="pwd" placeholder="请输入密码" placeholder-style="color:#bbb;font-weight:400;" v-show="isDisplay">
				<textarea v-model="changeMyDatas" class="modify-content"> 我是一个纯路人</textarea>
			</view>
		</view>
		<!-- 主体结束 -->
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return {
				user:'',
				uid:'',
				array: ['男', '女', '未知'],
				index:0,
				date: currentDate,
				changeMyDatas:'美好的一天开始了',
				markname:'',
				pwd:'',
				bgheight:'1000',
				animationData:{},
				isClose:false,
				isDisplay:null,
				fid:'',
				userMessages:{
					uid:'',
					name:'',
					token:''
				},
			};
		},
		computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
			onReady(){
				this.getChangeData()
			},
			onLoad(e){
				this.fid = e.uid
				this.getStorages()
				this.getUserMessages()
				this.getMarkName()
			},
		methods:{
		// 获取缓存信息
		getStorages(){
			try {
				const value = uni.getStorageSync('user_Msg');
				if (value) {
					this.userMessages.uid = value.id,
					this.userMessages.name = value.name,
					this.userMessages.token = value.token
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			} catch (e) {
				// error
			}
		},
		// 获取用户信息
		getUserMessages(){
			if(this.userMessages.uid==this.fid){
				uni.request({
					url: 'http://localhost:3000/user/detail', //仅为示例，并非真实接口地址。
					data: {
						id: this.userMessages.uid,
						// token:this.userMessages.token
					},
					method:'POST',
					success: (res)=> {
						let status = res.data.status
						if(status==200){
							let result = res.data.result
							result.imgurl = this.$http+'/data/user'+result.imgurl
							if(typeof(result.explain)){
								result.explain="这个人很懒，什么都没有留下~",
								result.phone ='未知'
							}
							if(this.markname.length==0){
								this.markname=result.name
							}
							this.sexJudge(result.sex)
							this.user = result
						}else if(status == 500){
							uni.showToast({
								title: '服务器出错了',
								duration: 2000
							});
						}else if(status ==300){
							// 没有获得token，需要重回注册页面
						}
					}
				});
			}	
		},
		// 判断性别信息
		sexJudge(e){
			if(e=='female'){
				this.index = 1
			}else if(e=='male'){
				this.index = 0
			}else{
				this.index=2
			}
		},
		// 获取好友昵称信息
		getMarkName(){
			if(this.userMessages.uid!=this.fid){
				uni.request({
					url: 'http://localhost:3000/user/detail', //仅为示例，并非真实接口地址。
					data: {
						id: this.fid,
						// token:this.userMessages.token
					},
					method:'POST',
			success: (res)=> {
				let status = res.data.status
				if(status==200){
					let result = res.data.result
					result.imgurl = this.$http+'/data/user'+result.imgurl
					if(typeof(result.explain)){
						result.explain="这个人很懒，什么都没有留下~",
						result.phone ='未知' 
					}
					if(this.markname.length==0){
						this.markname=result.name
					}
					this.sexJudge(result.sex)
					this.user = result
				}else if(status == 500){
					uni.showToast({
						title: '服务器出错了',
						duration: 2000
					});
				}else if(status ==300){
					// 没有获得token，需要重回注册页面
				}
			}
				});
				}
			},
			addFriendAnimat(x){
				this.isClose=!this.isClose
				this.isDisplay = x
				var animation = uni.createAnimation({
				  duration: 500,
					timingFunction: 'ease',
				})
				if(this.isClose){
					animation.bottom(-this.bgheight).step()
				}else{
					animation.bottom(0).step()
				}
				this.animationData = animation.export()
			},
			getChangeData(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  this.bgheight = data.height
				}).exec();
			},
			backone(){
				uni.navigateBack({
					delta:1
				})
			},
			getDate(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			        },
				 bindPickerChange: function(e) {
					            console.log('picker发送选择改变，携带值为', e.detail.value)
					            this.index = e.detail.value
					    },
				  bindDateChange: function(e) {
				            this.date = e.detail.value
				        },
				changeUserMes(){
					this.addFriendAnimat()
				},
				// 
				
	}
}			

</script>

<style lang="scss">
@import '../../commons/css/topBar.scss';
.content{
.top-bar{
		background: rgba(244,244, 244,0.96);
		box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
		.top-bar-center{
			width: 31px;
			height: 22px;
			padding-left: 138rpx;
			font-size: 16px;
			letter-spacing: -0.55px;
			font-weight: 400;
		
		}
		.top-bar-right{
			flex: 1;
		}
	}

.column{
	display: flex;
	flex-direction: column;
	margin-top: var(--status-bar-height);
	padding-top: 44rpx;
	.head{
		
	}
	.row{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 60px;
		.title{
			width: 31px;
			height: 22px;
			font-size: 16px;
			letter-spacing: -0.55px;
			font-weight: 400;
			margin:0 32rpx;
		}
		.user-head{
			flex: auto;
			.user-img{
				z-index: -6;
				width: 54px;
				height: 54px;
				border-radius: 10px;
			}
			.user-message{
				width: 280px; 
				white-space: nowrap;
				text-overflow: ellipsis; 
				overflow: hidden;
				
			}
		}
		.more{
			image{
				background: #cdcdcf;
				margin-right: 13px;
				width: 14px;
				height: 14px;
				transform: rotate(-180deg);
			}
		}
	}
}
.bt2{
	margin-top: 15px;
	text-align: center;
	font-size:20px;
	font-weight:400;
	color:rgba(255,93,91,1);
	line-height:26px;
}
.modify{
	position: fixed;
	z-index: 666;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: #fff;
	.modify-header{
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom:1px solid $uni-border-color ;
		.close{
			padding-left: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44px;
		}
		.title{
			flex: auto;
			text-align: center;
			font-size:40rpx;
			color:$uni-text-color;
			linetheight:88rpx;
		}
		.define{
			padding-right:$uni-spacing-col-base;
			font-size:$uni-font-size-lg;
			color:$uni-color-success;
			line-height:44rpx;
		}
	}
	.modify-main{
		display: flex;
		flex-direction: column;
		padding: $uni-spacing-col-base;
		.modify-pwd{
			margin-bottom: $uni-spacing-col-base;
			padding: 0 20rpx;
			box-sizing: border-box;
			flex: auto;
			width: 100%;
			flex: auto;
			height: 88rpx;
			background:$uni-bg-color-grey;
			border-radius:$uni-border-radius-base;
			font-size:$uni-font-size-lg;
			color:$uni-text-color;
			line-height:88rpx;
		}
		.modify-content{
			padding: 16rpx 20rpx;
			box-sizing: border-box;
			flex: auto; 
			width: 100%;
			height:386rpx;
			background:$uni-bg-color-grey;
			border-radius:$uni-border-radius-base;
			font-size:$uni-font-size-lg;
			color:$uni-text-color;
			line-height:44rpx;
		}
	}
	}
}
</style>
