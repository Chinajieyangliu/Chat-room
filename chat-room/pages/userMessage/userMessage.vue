<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<span @tap="reBack">返回</span>
			</view>
			<view class="top-bar-right"  >
				<image @tap="toUserMessages"  src="../../static/images/userMessage/more@2x.png"></image>
			</view>
		</view>
		
		<view class="bg">
			<view class="bg-bai"></view>
			<image class="bg-img" src="../../static/images/userMessage/one.webp" mode="aspectFill"></image>
		</view>
		
		<view class="main">
			<view class="user-header">
				<image :animation="animationData1"  class="userImg" src="../../static/images/userMessage/one.webp"></image>
				<view class="sex" :animation="animationData2"  :style="{background:sexBg}">
					<image src="../../static/images/userMessage/女@2x.png"></image>
				</view>
			</view>
			<!-- 个人信息介绍 -->
			<view class="user-imf" >
				<view class="name">姓名：{{user.name}}</view>
				<view class="nick">昵称：{{user.markname}}</view>
				<view class="intr">个人简介：{{user.explain}}</view>
			</view>
		</view>
		
		<view class="bottom-bar" v-show="userMessages.uid!=uid && !isMyFriend">
			<view @click="addFriends" class="bottom-btn bt1">加为好友</view>
		</view>
		<view class="add-misg" :style="{height:bgheight+'px',bottom:-bgheight+'px'}" :animation="animationData" >
			<view class="name">{{user.name}}</view>
			<textarea  :value="`${userMessages.name} 请求添加好友`"  maxlength="120px"  class="add-admin" ></textarea>
			
		</view>
		<view class="bom-bt" :style="{bottom:-180+'px'}"   :animation="animationData" >
			<view class="close bt1" @tap="addFriendAnimat">关闭</view>
			<view class="send bt1" @tap="addFriend">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexBg:'rgba(255,93,91,1)',
				bgheight:'',
				isMyFriend:false,
				animationData: {},		//动画效果实现隐藏和显示 
				animationData1: {},		//动画效果实现隐藏和显示
				animationData2: {},		//动画效果实现隐藏和显示
				isClose:true,
				uid:'',
				index:'',
				userMessages:{
					uid:'',
					name:'',
					token:''
				},
				user:''
			}
		},
		onReady(){
		this.getChangeData()
		},
		onLoad(e){
			this.uid=e.uid
			this.getStorages()
			this.userMessageIsMe(e.uid)
			this.userMessageIsFriend(e.uid)
			this.isUserFriend()
		},

		methods: {
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
			// 封装方法
			getUserMessage(uid){
				uni.request({
					url: 'http://localhost:3000/user/detail', //仅为示例，并非真实接口地址。
					data: {
						id: uid,
						// token:this.userMessages.token
					},
					method:'POST',
					success: (res)=> {
						let status = res.data.status
						if(status==200){
							let result = res.data.result
							// result.imgurl = this.$http+'/data/user'+result.imgurl
							if(typeof(result.explain)){
								result.explain="金枝玉露，一相逢便胜人间无数"
							}
							if(typeof(result.markname)){
								result.markname="一叶知秋"
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
			},
			// 当是自己访问个人信息时
			 userMessageIsMe(fid){
				if(this.userMessages.uid==fid){
					 this.getUserMessage(this.userMessages.uid)
				}
			},
			// 当查看好友信息时
			 userMessageIsFriend(fid){
				if(this.userMessages.uid!=fid){
					 this.getUserMessage(fid)
				}
			},
			// 判断个人性别时
			sexJudge(sex){
				if(sex=='female'){
					this.index = 1
				}else if(sex=='male'){
					this.index = 0
				}else{
					this.index=2
				}
			},
			
			getChangeData(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
				  this.bgheight = data.height-186
				}).exec();
			},
			 addFriendAnimat(){
				 this.isClose=!this.isClose
			    var animation = uni.createAnimation({
			      duration: 1000,
			        timingFunction: 'ease',
			    })
				var animation1 = uni.createAnimation({
				  duration: 1000,
				    timingFunction: 'ease',
				})
				var animation2 = uni.createAnimation({
				  duration: 100,
				  timingFunction: 'ease',
				})
				if(!this.isClose){
					animation.bottom(-this.bgheight).step()
					animation1.width(160).height(160).step()
					animation2.opacity(1).step()
				}else{
					animation.bottom(0).step()
					animation1.width(120).height(120).step()
					animation2.opacity(0).step()
				}
			    this.animationData = animation.export()
				this.animationData1=animation1.export()
				this.animationData2 = animation2.export()
			},
			addFriends(){
				this.addFriendAnimat()
			},
			reBack(){
				uni.navigateBack({
					delta: 1
				});
			},
			// 去个人详情页
			toUserMessages(){
				uni.navigateTo({
					url: '../userdetials/userdetials?uid='+this.uid
				});
			},
			addFriend(){
				uni.request({
					url:this.$http+'/friend/applyFriend',
					data:{
						uid:this.userMessages.uid,
						fid:this.uid,
						msg:this.data
						// token:this.userMessages.token
					},
					method:'POST',
					success:(data)=>{
						this.addFriendAnimat()
						let status = data.data.status
						if(status == 200){
							uni.showToast({
								title: '申请好友成功！',
								duration: 2000
							});
						}else if(status == 300){
							// 用户匹配失败
							uni.navigateTo({
								url:'/pages/login/login'
							});
				
						}else if(status==500){
							uni.showToast({
								title: '访问服务器出错',
								duration: 2000
							});
						}
					}
				})
				
			},
			// 判断搜索点击的是否是要添加的好友
			isUserFriend(){
				if(this.userMessages.uid!=this.uid){
					uni.request({
						url:this.$http+'/search/isfriend',
						data:{
							uid:this.userMessages.uid,
							fid:this.uid,
							// token:this.userMessages.token
						},
						method:'POST',
						success:(res)=>{
							this.addFriendAnimat()
							let status = res.data.status
							if(status == 200){
								this.isMyFriend = true
							}else if(status == 400){
							// 不是好友
							}else if(status==500){
								uni.showToast({
									title: '访问服务器出错',
									duration: 2000
								});
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
@import '../../commons/css/topBar.scss';
.content{
	width: 100%;
	height: 100%;
	.top-bar{
		box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
		.top-bar-left{
			span{
				padding: 24rpx;
			}
			
		}
	.top-bar-right{
		image{
			margin-right: 24rpx;
			width: 52rpx;
			height: 12rpx;
				}

			}
		}
		
 .bg{
	position: fixed;
	z-index: 5;
	top:0;
	left: 0;
	width: 100%;
	height: 100%;
	.bg-bai{
		width: 100%;
		height: 100%;
	}
	.bg-img{
		position: fixed;
		z-index: 6;
		opacity: 0.4;
		position: absolute;
		left: -10rpx;
		top: -20rpx;
		width: 110%;
		height: 110%;
		filter: blur(32rpx);
	}
}
		.main{
		.user-header{
			z-index: 11;
			position: relative;
			text-align: center;
			.sex{
				position: absolute;
				right: 31%;
				bottom: 8%;
				width: 64rpx;
				height: 64rpx;
				border-radius: 56rpx;
				image{	
					padding: 16rpx;
					width: 16px;
					height: 16px;
				}
			}
			.userImg{
				margin-top: 120rpx;
				width: 160px;
				height: 160px;
				margin-top: 120rpx;
				border: 6rpx solid #FFFFFF;
				border-radius: 48rpx;
			}
		}
		.user-imf{
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.name{
				font-size: 52rpx;
				font-weight: 400;
			}
			.nick{
				margin: 20rpx 0;
				font-size: 28rpx;
				font-weight: 400;
			}
			.intr{
				width: 276px;
				height: 170rpx;
				font-size: 28rpx;
				line-height: 48rpx;
				font-weight: 200;
			}
		}
   }
}
		.bt1{
			background-color: $uni-color-primary;
		}	
		.add-misg{
			z-index: 10;
			position: fixed;
			bottom: 0;
			width:100%;
			box-sizing: border-box;
			padding: 0 56rpx;//height:1252rpx;
			background: rgba(255, 255, 255,1);
			border-radius:40rpx 40rpx 0px Opx;
			.name{
				padding: 168rpx 0 40rpx;
				font-size:52rpx;
				color: $uni-text-color;
				line-height:74rpx;
			}
			.add-admin{
			padding: 18rpx 22rpx;
			box-sizing: border-box;
			width:100%;
			height:420rpx;
			background:$uni-bg-color-grey;
			border-radius:$uni-border-radius-base;
			font-size:$uni-font-size-lg;
			color: $uni-text-color;
			line-height:44rpx;
			}

		}
		.bom-bt{
			z-index: 20;
			display: flex;
			position: fixed;
			width: 100%;
			height: 104rpx;
			bottom: 0;
			.send{
				flex: auto;
				margin-right: 32rpx;
				background-color: $uni-color-primary;
				border-radius: $uni-border-radius-base;
			}
			.close{
				margin-left: 34rpx;
				margin-right: 32rpx;
				width: 172rpx;
				background-color: $uni-text-color-grey;
				border-radius: $uni-border-radius-base;
			}
			
		
}
</style>
