<template>
	<view class="content">
		<!-- 头部导航栏开始 -->
		<view class="top-bar">
			<view class="top-bar-left">
				<span @tap="reBack">返回</span>
			</view>
			<view class="top-bar-center"  >
				<view class="title">好友请求</view>
			</view>
			<view class="top-bar-right"  >
			<view class="pice"></view>
			</view>
		</view>
		<!-- 头部导航栏结束 -->
		
		<!-- 中间主题栏开始 -->
		<view class="main">
			
				<view class="requester" v-for="item,index in requestFriends" :key="index">
					<view class="requester-top">
						<view class="reject btn" @tap='deleteFriend(item.id)'>拒绝</view>
						<view class="header-img">
							<image src="../../static/images/userMessage/two.webp" ></image>
						</view>
						<view class="aggree btn" @tap='applyFriend(item.id)'>同意</view>
					</view>
					<view class="requester-center"  >
						<view class="title">{{item.name}}</view>
						<view class="time">2020-05-01</view>
					</view>
					<view class="notic" >
						<text>留言：</text>
						{{item.message}}
					</view>
				</view>
				
		
		</view>
		<!-- 中间主题栏结束 -->
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userMessages:{
					uid:'',
					name:'',
					token:''
				},
				requestFriends:[]       //用户发来请求数组
			}
		},
		onReady(){
			
		},
		onLoad(){
			this.getLocationData()
			this.sendToMeMessage()
		},
		methods:{
			// 获取本机用户用户存储
			getLocationData(){
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
			// 获取向我请求好友的数据
			sendToMeMessage(){
				uni.request({
					url:this.$http+'/index/getUsers',
					data:{
						uid:this.userMessages.uid,
						state:2
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							let arr = res.data.result
							for(let i=0;i<arr.length;i++){
								this.getRequestFriendTest(arr[i],i)
								this.requestFriends.unshift( arr[i] )
							}
							
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
			// 获取好友发来的请求语
			getRequestFriendTest(arr,i){
				uni.request({
					url:this.$http+'/index/getOneMsg',
					data:{
						uid:this.userMessages.uid,
						fid:arr.id
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							let result =res.data.result
							this.$set(arr,'message',result[0].message) 
							
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
			// 拒绝添加好友
			deleteFriend(id){
				
				uni.request({
					url:this.$http+'/friend/deletestate',
					data:{
						uid:this.userMessages.uid,
						fid:id
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							for(let i=0;i<this.requestFriends.length;i++){
								if(this.requestFriends[i].id==id){
									this.requestFriends.splice(i,1)
								}
							}
						
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
			// 允许添加好友
			applyFriend(id){
				uni.request({
					url:this.$http+'/friend/updatestate',
					data:{
						uid:this.userMessages.uid,
						fid:id
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							for(let i=0;i<this.requestFriends.length;i<i++){
								if(this.requestFriends[i].id==id){
									this.requestFriends.splice(i,1)
								}
							}
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
			reBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/topBar.scss';
	.top-bar{
		background: rgba(244,244, 244,0.96);
		box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
	}
	.main{
		margin-top: 100rpx;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
		padding: 108rpx $uni-spacing-col-base;
		.requester{

			margin: 108rpx 0 200rpx 0;
			background:rgba(255,255, 255,1);
			box-shadow:0px 24rpx 64rpx -8rpx rgba(0,0,0,0.1);
			border-radius:$uni-border-radius-base;
			.requester-top{
				display: flex;
				flex-direction: row;
				.btn{
					flex: none;
					text-align: center;
					width:160rpx;
					height:64rpx;
					background:rgba(255,93,91,0.1);
					border-radius:40rpx;
					font-size:$uni-font-size-lg;
					line-height:64rpx;
				}
				.header-img{
					flex: auto;
					text-align: center;
					image{
						margin-top: -104rpx;
						width:144rpx;
						height:144rpx;
						border-radius: 50%;
						background-color: $uni-color-primary;
					}
				}
				.reject{
					color: $uni-color-warning;
					background-color:rgba(255,93,91,0.1)
				}
				.aggree{
					color : $uni-text-color;
					background-color: $uni-color-primary
				}
			}
			.requester-center{
				text-align:center;
				padding-top:20rpx;
				.title{
					font-size:36rpx;
					font-weight:500;
					color:$uni-text-color;
					line-height:50rpx;
				}
				.time{
					padding: 10rpx 0;
					font-size:$uni-font-size-sm;
					color:$uni-text-color-disable;
					line-height:34rpx;
				}
			}
			.notic{
				padding: $uni-spacing-row-sm $uni-spacing-col-base;
				border-radius: $uni-border-radius-base;
				background-color: $uni-bg-color-grey;
				font-size:$uni-font-size-base;
				color:$uni-text-color;
				line-height:40rpx;
				text{}
			}
		}
	}

</style>
