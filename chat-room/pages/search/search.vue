<template>
	<view class="content">
		<!-- 头部导航栏开始 -->
		<view class="top-bar">
			<view class="search-div">
				<input @input="searchData" confirm-type="search" placeholder="输入搜索内容" placeholder-style="">
				<image src="../../static/images/search/search@2x.png" ></image>
			</view>
			<view class="top-bar-right" @tap="backIndex">
				<span>取消</span>
			</view>
		</view>
		<!-- 头部导航栏结束 -->
		<!-- 内容栏开始 -->
		<view class="main">
			<!-- 用护栏开始 -->
			<view class="search-user result"  v-if="inputValue.length>0">
				<view class="title" >用户</view>
				<view class="search-user-style" v-for="item in userData" :key="item.id">
				<view @tap="goFriendMessage(item._id)"><image src="../../static/logo.png" ></image></view> 
					<view class="messageUser">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right_bt" v-if="item.tip==1" >发信息</view>
					<view class="right_bt send" v-if="item.tip==0" @tap="changeUserMes(item._id)">加好友</view>
				</view>
				
			</view>
			<!-- 用户栏结束 -->
		</view>
		<!-- 内容栏结束 -->
		<!-- 好友添加信息开始 -->
		<view class="modify" :style="{bottom:-bgheight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="changeUserMes">取消</view>
				<view class="title">添加好友</view>
				<view class="define" @tap="addFriend">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="data" class="modify-content"> </textarea>
			</view>
		</view>
		<!-- 好友添加信息结束· -->
	</view>
	
</template>

<script>
	import antiShake from '../../commons/js/anti_shake.js';
	import seachData from '../../commons/js/searchData.js';
	export default {
		data() {
			return {
				userData:[],
				inputValue:'',
				userMessages:{
					uid : '',
					imgurl:'',
					name:'',
					token :'',
				},
				bgheight:0,
				isClose:false,
				animationData:{},
				data:'',
			};
		},
		onLoad(){
			this.getLocationData()
			this.data=`${this.userMessages.name}请求添加你为好友~`
	
		},
		onReady(){
			this.getChangeData()

		},
		// 初始化完成做的事情

		methods:{
			// 访问本地储存获取token
			getLocationData(){
				try {
					const value = uni.getStorageSync('user_Msg');
					if (value) {
						this.userMessages.uid = value.id,
						this.userMessages.imgurl = value.imgurl,
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
			searchData:antiShake.Debounce(function(e){
					this.userData=[]
					this.inputValue = e.detail.value
					if(this.inputValue.length>0){
						this.getUserData(this.inputValue)
					}
				},500),
				// 
			// 该方法时通过搜索框的v-model双向绑定获取搜索数据和用户进行匹配
			getUserData(item){
					uni.request({
						url:this.$http+'/search/user',
						data:{
							data:item,
							// token:this.userMessages.token
						},
						method:'POST',
						success:(data)=>{
							let status = data.data.status
							let arr = data.data.result
							if(status == 200){
								for(let i=0;i<arr.length;i++){
									// if(arr[i].name.search(item) !=-1 || arr[i].email.search(item) !=-1){
										this.ifFriends(arr[i],item)
									// }
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
			ifFriends(arr,item){
				// 判断搜索的人是否是自己的好友
				let tip = 0
				let exp = eval("/"+item+"/g")
				if( this.userMessages.uid== arr._id){
					tip = 2
					arr.tip =tip
				}
				uni.request({
					url:this.$http+'/search/isfriend',
					data:{
						fid:arr._id,
						uid:this.userMessages.uid
					},
					method:'POST',
					success:(data)=>{
						let status = data.data.status
						if(status == 200){
							tip = 1
							arr.tip = tip
						}else if(status == 400){
							// 不是好友
							arr.tip = tip
				
						}else if(status==500){
							uni.showToast({
								title: '访问服务器出错',
								duration: 2000
							});
						}
						arr.name = arr.name.replace(exp,"<span style = 'color:#4AAAFF;'>"+item+"</span>")
						arr.email = arr.email.replace(exp,"<span style = 'color:#4AAAFF;'>"+item+"</span>")
						this.userData.push(arr)
					}
				})
			},
			backIndex(){
				uni.navigateBack({
					delta: 1
				});
			},
			// 动画样式开始
			changeUserMes(id){
				this.addFriendAnimat()
				this.fid=id
			},
			addFriendAnimat(){
				this.isClose=!this.isClose
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
			// 添加好友
			addFriend(){
				uni.request({
					url:this.$http+'/friend/applyFriend',
					data:{
						uid:this.userMessages.uid,
						fid:this.fid,
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
			// 动画样式结束
			goFriendMessage(fid){
				uni.navigateTo({
					url:'/pages/userMessage/userMessage?uid='+fid
				});
			}
			
		}
	}
</script>

<style lang="scss">
@import "../../commons/css/topBar.scss";
.top-bar{
	background: rgba(244,244, 244,0.96);
	box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
	.search-div{
			input{
				margin-left: 32rpx;
				position: relative;
				width: 600rpx;
				height: 60rpx;
				background: #F3F4F6;
				border-radius: 10rpx;
			}
			image{
				position: absolute;
				padding-top: 6rpx;
				left: 572rpx;
				top: 20rpx;
				background-color: #F3F4F6;
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
			}
		}
	.top-bar-right{
		span{
			margin-right: 32rpx;
			width: 56rpx;
			height: 40rpx;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #272832;
			font-weight: 400;
		}
	}
}

.main{
	.search-user{
		.title{
			margin-top: 34rpx;
			padding-left: 10px;
			width: 86rpx;
			height: 60rpx;
			font-family: PingFangSC-Semibold;
			font-size: 44rpx;
			letter-spacing: -0.75px;
			font-weight: 600;
			
		}
		.search-user-style{
			display: flex;
			justify-content: space-between;
			padding: 10px;
			
			image{
				margin-right: 32rpx;
				width: 80rpx;
				height: 80rpx;
				border-radius: 10px;
			}
			.messageUser{
				flex: 1;
				margin: auto 0;
				.name{
					font-size: $uni-font-size-lg;
					letter-spacing: -0.62px;
					font-weight: 400;
				}
				.email{
					padding-top: 2rpx;
					font-size: $uni-font-size-sm;
					letter-spacing: -0.62px;
					font-weight: 400;
					color: $uni-text-color-disable;
				}
			}
			.right_bt{
				margin: auto 0;
				width: 120rpx;
				height: 48rpx;
				background: #FFE431;
				text-align: center;
				border-radius: 12px;
				font-size: 12px;
				line-height: 48rpx;
				color: #272832;
				letter-spacing: -0.41px;
				font-weight: 500;
			}
			.send{
				color: $uni-color-success;
				background: rgba(74,170,255,0.10);
			}
		}	
	}
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
</style>
