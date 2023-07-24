<template>
	<view>
		<!--  -->
		<view class="top-bar">
			<view class="top-bar-right" >
				<view class="text" @tap="toLoginUp" >注册</view>
			</view>
		</view>
			<view class="mainStyle">
				<view class="logo">
							<image src="../../static/images/login/火@2x.png"></image>
						</view>
						<view class="main">
							<view class="title">
								登录
							</view>
							<view class="slogin">
								欢迎来到聊天室
							</view>
							<view class="inputs">
							<input type="text" v-model="model.email" placeholder="请输入账号名/邮箱" placeholder-style="color:#bbb;font-weight:400;">				
							<input type="password" v-model="model.password" placeholder="请输入密码" placeholder-style="color:#bbb;font-weight:400;">				
							</view>
							<view class="tips" v-show="ishide">
								账号名或密码错误
							</view>
						</view>
						<view class="submit" @tap="login">
							<span>登录</span>
						</view>
					</view>
			</view>
	
</template>

<script>
	export default {
		data() {
			return {
				model:{
					email:'',
					password:''
				},
				ishide: false
			}
		},
		onLoad:function(e){
			if(e.user){
				this.model.email = e.user
				uni.showToast({
					title:'注册成功，请登录',
					icon:'none',
					duration:1500,
				})
			}
		},
		methods: {
			toLoginUp(){
				uni.navigateTo({
					url:'../signup/signup'
				})
			},
			login(){
				uni.request({
					url:'http://localhost:3000/signin/match',
					data:{
						data:this.model.email,
						pwd:this.model.password,
					},
					method:'POST',
					success:(data)=>{
						let status = data.data.status
						console.log(data)
						if(status == 200){
							let res = data.data.back
							try {
								uni.setStorageSync('user_Msg', {'id':res.id,'name':res.name,'imgurl':res.imgurl,'token':res.token});
							} catch (e) {
								// error
								console.log('数据库存储出错')
							}
							uni.navigateTo({
								url: '../index/index?user='+this.model.email
							})
							
						}else if(status == 400){
							// 用户匹配失败
								this.ishide=true
								this.model.password = ''
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
</script>

<style lang="scss">
	.top-bar{
		margin-top: var(--status-bar-height);
		.top-bar-right{
			display: flex;
			align-items: center;
			justify-content: flex-end;
			height: 88rpx;
			border: 1px solid $uni-border-color;
			background: rgba(244,244, 244,0.96);
			box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
			.text{
			margin-right: 56rpx;
			font-size: 36rpx;
			color: #333333;
			letter-spacing: 0;
			font-weight: 500;
			
				} 
		}
		}
		.mainStyle{
			padding: 0 56rpx;

			.logo{
				display:flex;
			    align-items: center;
				justify-content: center;
				height: 226rpx;
				width: 100%;
				image{
					width: 198rpx;
					height: 90rpx;
				}
			}
			.main{
				.title{
					margin: 30rpx 0;
					font-family: PingFangSC-Medium;
					font-size: 56rpx;
					letter-spacing: 0;
					font-weight: 500;
				}
				.slogin{
					font-family: PingFangSC-Regular;
					font-size: 40rpx;
					color: rgba(39,40,50,0.50);
					letter-spacing: 0;
					font-weight: 400;
				}
				.inputs{
					input{
						padding-top: 40rpx;
						height: 88rpx;
						font-size:$uni-font-size-lg;
						line-height: 88rpx;
						border-bottom: 1px solid #eeeeef;
					}
					
				}
				.tips{
					font-size: $uni-font-size-sm;
					color: $uni-color-error;
				}
		 }
			.submit{
			margin: 120rpx auto;
			text-align: center;
			width: 520rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: $uni-color-primary;
			box-shadow: 0px 25px 16px -18px rgba(255,228,49,0.4);
			border-radius: 24px;
			 span{
			display: inline-block;
			font-size: 32rpx;
			letter-spacing: 0;
			font-weight: 500;
			}
		}
		}	

</style>
