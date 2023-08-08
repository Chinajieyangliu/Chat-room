<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image @tap="toUserMessage" :src="userMessages.imgurl"></image>
			</view>
			<view class="top-bar-center">
				<image src="../../static/images/index/火@2x.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/index/search@2x.png"></image>
				</view>
				<view class="add">
					<image src="../../static/images/index/add group@2x.png"></image>
				</view>
			</view>
		</view>
		<view class="main">
			
			<view class="refresh" v-if="refresh">
				<image src="../../static/images/index/refresh.png" mode=""></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<!-- 当没有好友时 -->
			<view class="noone" v-if="noBody">
				<image src="../../static/images/index/noone.png" mode="aspectFill"></image>
				<view class="no-title"></view>
				<view class="search-bt">发现好友</view>
			</view>
			<view class="friends" >
				<view class="friends-list positioning" @tap="toFriendRequest" >
					<view class="friends-list-l">
						<i class="tip">1</i>
						<view >
							<image src="../../static/logo.png" mode=""></image>
						</view>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">13:37</view>
						</view>
						<view class="mes">
							茫茫人海，找到便是缘分~~~
						</view>
					</view>
				</view>
				
				
				<view class="friends-list" @tap="toFriendMessage(item)" v-for="item,index in requestFriends">
					<view class="friends-list-l">
						<i class="tip">{{item.tip}}</i>
						<view >
							<image src="../../static/logo.png" mode=""></image>
						</view>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">13:37</view>
						</view>
						<view class="mes">
							{{item.message}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userMessages:{
					name:'',
					imgurl:'',
					token:'',
					uid:'',
				},
				// 数据库传来真实数据
				requestFriends:[],
				refresh:true,
				noBody:true,
				friendRequest:false
			}
		},
		onLoad() {
			this.getLocationData()
			this.getMyfriends()
			this.join()
			this.receiveSocketMessage()
		},
			onPullDownRefresh() {
				this.requestFriends=[]
				this.getLocationData()
				this.getMyfriends()
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
			},
		methods: {
			toSearch(){
				uni.navigateTo({
					url: `../search/search`
				});
			},
			toUserMessage(){
				uni.navigateTo({
					url: '../userMessage/userMessage?uid='+this.userMessages.uid
				});				
			},
			getLocationData(){
				try {
					const value = uni.getStorageSync('user_Msg');
					if (value) {
						this.userMessages.uid = value.id,
						this.userMessages.imgurl = this.$http+'/user/'+value.imgurl,
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
			// 获取好友
			getMyfriends(){
				uni.request({
					url:this.$http+'/index/getUsers',
					data:{
						uid:this.userMessages.uid,
						state:0
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							this.refresh=false
							let arr = res.data.result
							if(arr.length>0){
							for(let i=0;i<arr.length;i++){
								// 获取最新一次通话信息
								this.requestFriends.push(arr[i])
								this.getRequestFriendTest(arr[i],i)
								this.getUnReadMessagecount(arr[i])
							}
							this.requestFriends.sort((a,b)=>{
								return a.lastTime-b.lastTime<0
							})
							}else{
								this.noBody=true
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
			// 获取好有通话信息
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
							this.refresh=false 
							let result =res.data.result
							if(result.length>0){
								this.noBody=false
								if(result[0].types== 0){
									// 文字信息
								}else if(result[0].types==1){
									result[0].message = '[图片]'
								}else if(result[0].types == 2){
									result[0].message = '[音频]'
								}else if(result[0].types==3){
									result[0].message = '[位置]'
								}
								this.$set(arr,'message',result[0].message)
							}else{
								this.noBody=true
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
			// 获取未读消息数
			getUnReadMessagecount(arr){
				uni.request({
					url:this.$http+'/index/unreadMsg',
					data:{
						uid:this.userMessages.uid,
						fid:arr.id,
						state:1
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							let result =res.data.result
							this.$set(arr,'tip',result)
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
			// 去好友请求页面
			toFriendRequest(){
				uni.navigateTo({
					url: '/pages/friendRequest/friendRequest'
				})
			},
			toFriendMessage(item){
				uni.navigateTo({
					url: '/pages/chatRoom/chatRoom?id='+item.id+'&name='+item.name+'&img='+item.imgurl+'&type='+item.type
				})
			},
			// 开局获取聊天记录
			join(){
				this.socket.emit('login',this.userMessages.uid)
			},
			// 接收scoket的信息
			receiveSocketMessage(){
				let message =''
				this.socket.on('msg',(msg,fromId)=>{
					if(msg.types== 0){
						message = msg.message
					}else if(msg.types==1){
						message = '[图片]'
					}else if(msg.types == 2){
						message = '[音频]'
					}else if(msg.types==3){
						message = '[位置]'
					}
					for(let i=0;i<this.requestFriends.length;i++){
						if(this.requestFriends[i].id==fromId){
							let e = this.requestFriends[i]
							e.message = message
							e.tip++
							this.requestFriends.splice(i,1)
							this.requestFriends.push(e)
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/topBar.scss';
	.top-bar{
	background: rgba(244,244, 244,0.96);
	box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
		.top-bar-left{
			flex: 1;
			image{
				padding-top: 8rpx;
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}
		.top-bar-center{
			margin-top: 6rpx;
			flex: 1;
			text-align: center;
			image{
				width: 88rpx;
				height: 42rpx;
			}
		}
		.top-bar-right{
			margin-top: 6rpx;
			margin-left: 40rpx;
			flex: 1;
			display: flex;
			.search{
				flex: auto;
				image{
					width: 48rpx;
					height: 48rpx;
				}
			}
			.add{
				flex: auto;
				image{
					width: 48rpx;
					height: 48rpx;
				}
			}
				
		}
	}
	.main{
		.refresh{
			text-align: center;
			padding-top:480rpx;
			image{
				width: 32rpx;
				height: 32rpx;
			}
			.ref-title{
				padding-top: 10rpx;
				font-size:$uni-font-size-base;
				font-family:PingFangSC-Regular,PingFang SC;
				color:rgba(39,40,50,0.4);
				line-height: 40rpx;
			}
		}
		.noone{
			text-align: center;
			padding-top:400rpx;
			image{
				height: 250rpx;
				width: 158rpx;
			}
			.no-title{
				padding: 32rpx 0;
				font-size:$uni-font-size-base;
				font-family:PingFangSC-Regular,PingFang SC;
				color:rgba(39,40,50,0.4);
				line-height:40rpx;
			}
			.search-bt{
				display:inline-block;
				width:240rpx;
				height:96rpx;
				background:$uni-color-primary;
				box-shadow:0px 52rpx 36rpx -32rpx rgba(255,228,49,0.4);
				border-radius:48rpx;
				font-size:$uni-font-size-base;
				font-family:PingFangSC-Regular,PingFang SC;
				color:$uni-text-color;
				line-height:96rpx;
			}
		}
		.friends{
		padding-top:var(--status-bar-height);
		background-color: #fff;
	.friends-list{
			display: flex;
			width: 100%;
			margin: 28rpx 0;
				&:active{
					background-color: $uni-bg-color;
				}
			
			.friends-list-l{
			position: relative;
				image{
					margin: 0 32rpx;
					width: 96rpx;
					height: 96rpx;
					border-radius: 12px;
				}
				i{
					position: absolute;
					z-index: 10;
					top: -12rpx;
					left: 96rpx;
					min-width: 36rpx;
					height:36rpx ;
					border-radius: 50%;
					line-height: 36rpx;
					text-align: center;
					background-color: $uni-color-error;
					color: $uni-text-color-inverse;
					font-size: $uni-font-size-sm;
				}
			}
		}
		.friends-list-r{
			flex: auto;
			display: flex;
			flex-direction:column;
			justify-content: center;
			.top{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.name{
					
					font-size: 36rpx;
					font-weight: 400;
					margin-bottom: 4rpx;
				}
				.time{
					
					width: 46px;
					height: 17px;
					font-size: $uni-font-size-sm;
					color: rgba(39,40,50,0.40);
					letter-spacing: -0.41px;
					font-weight: 400;
				}

			}
			.mes{
				font-size: $uni-font-size-base;
				color: rgba(39,40,50,0.60);
				letter-spacing: -0.48px;
				font-weight: 400;
				width: 260px;
				white-space:nowrap;
				overflow:hidden; //溢出内容隐藏
				text-overflow:ellipsis;
			}
		}
	}		
}

</style>
