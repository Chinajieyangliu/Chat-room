<template>
	<view class="content">
		<!--  -->
		<view class="top-bar">
			<view class="top-bar-right">
				<span @tap="toLogin">返回</span>
				<image src="../../static/images/loginup/关闭@2x.png" mode=""></image>
			</view>
		</view>
			<view class="mainStyle">
				<view class="logo">
					<image src="../../static/images/login/火@2x.png"></image>
				</view>
						<view class="main">
							<view class="title">
								注册
							</view>
							<view class="inputs">
								<view class="inputs-div">
									<input v-model="model.name" @blur="verifyAccount" class="name" type="text" placeholder="请输入新的用户" placeholder-style="color:#bbb;font-weight:400;">
									<view class="employ common" v-show="isEmploy">该用户名已被占用</view>
									<image class="ok common" src="../../static/images/loginup/Group 3@2x.png" v-show="isUser"></image>
								</view>
								<view class="inputs-div">
									<input v-model="model.email" @blur="verifyEmail" class="email" type="text" placeholder="请输入邮箱" placeholder-style="color:#bbb;font-weight:400;">
									<view class="employ common" v-show="isEmailUser">该邮箱已被占用</view>
									<view class="invalid common" v-show="isinvalid">邮箱无效</view>
									<image class="ok common" src="../../static/images/loginup/Group 3@2x.png" v-show="isEmail"></image>
								</view>
								<view class="inputs-div" >
									<input  @input="getPassword" class="password"  :type="inputType" placeholder="请输入密码" placeholder-style="color:#bbb;font-weight:400;">
									<image class="eayLook common" :src="eayUrl"  @tap="changePasswordPlay"></image>
								</view>
							</view>
						</view>
						<view :class="[{submit:isok},{submit1:!isok}]" @tap="toLogin">
							<span>登录</span>
						</view>
					</view>
		</view>
	
</template>

<script>
	export default {
		data() {
			return {
				inputType:'password',  //改变input框的类型
 	 			isUser:false,			//判断用户名成功显示图片
				isEmploy:false,			//判断用户名是否被占用
				isEmailUser:false,		//判断邮箱名是否存在
				isinvalid:false,		//判断邮箱是否有用
				isEmail:false,		    //邮箱显示图片
				islook:true,			//改变密码显示状态
				password:'',			//用户输入密码密码
				eayUrl:'../../static/images/loginup/查看@2x.png',
				isok:'',
				model:{
					name:'',
					email:'',
				}	
			}
		},
		computed:{
			Pisok(){
				if(this.isEmail&&this.isUser&&this.password.length>5){
					this.isok=true
				}else{
					this.isok=false
				}
				return this.isok
			}
		},
		methods: {
		// 点击返回注册页面
		toLogin(){
			uni.navigateBack({
			data:1
		})
		 },
		 // 点击将密码显示或密码显示关闭
		 changePasswordPlay(){
		 	this.islook=!this.islook
			this.eayUrl='../../static/images/loginup/查看@2x.png'
			if(!this.islook){
				this.inputType = 'text'
			}else{
				this.inputType ='password'
			}
		 },
		 // 邮箱的检验方式
		verifyEmail(){
			let reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
			if(this.model.email.length>0){
				if(reg.test(this.model.email)){
						uni.request({
							url: 'http://localhost:3000/signup/jduge', //仅为示例，并非真实接口地址。
							data: {
						        data: this.model.email,
						        type: 'email'
							},
							method:'POST',
							success: (res)=> {
								let status = res.data.status
								if(status==200){
									let count = res.data.result
									if(count>0){
										this.isEmailUser = true
										this.isEmail = false
										this.Pisok
									}else{
										this.isEmail = true
										this.isEmailUser = false
										this.Pisok
									}
								}else{
									console.log("服务器出错了")
								}
							}
						});
					this.isinvalid=false
				}else{
					this.isEmail = false
					this.isEmailUser = false
					this.isinvalid=true
					this.Pisok
				}
			}else{
				this.isinvalid=false
				this.isEmail=false
				this.isEmailUser=false
				this.Pisok
			}
		},
		// 對賬號進行驗證並請求服務器
		verifyAccount(e){
			if(this.model.name.length>0){
				uni.request({
					url: 'http://localhost:3000/signup/jduge', //仅为示例，并非真实接口地址。
					data: {
				        data: this.model.name,
				        type: 'name'
					},
					method:'POST',
					success: (res)=> {
						let status = res.data.status
						if(status==200){
							let count = res.data.result
							if(count>0){
								this.isEmploy = true
								this.isUser = false
								this.Pisok
							}else{
								this.isUser = true
								this.isEmploy = false
								this.Pisok
							}
							
						}else{
							console.log("服务器出错了")
						}
					}
				});
			}else{
				this.isUser = false
				this.isEmploy = false
				alert('请输入账户名')
			}
			
		},
		getPassword(e){
			this.password = e.detail.value
			this.Pisok
		},
		toLogin(){
			if(this.Pisok) {
				uni.request({
					url: 'http://localhost:3000/signup/add', //仅为示例，并非真实接口地址。
					data: {
						name: this.model.name,
						mail: this.model.email,
						pwd:this.password
					},
					method:'POST',
					success: (res)=> {
						console.log(res)
						if(res.data.status==200){
							console.log('执行啊')
							uni.navigateTo({
								url: '../login/login?user='+this.model.name
							});
						}else if(res.data.status == 500){
							uni.showToast({
								title: '服务器出错了',
								duration: 2000
							});
						}
					}
				});
					
			}
		}
	}
}	
</script>

<style lang="scss">

	.top-bar{
		z-index: 66;
		background: rgba(244,244, 244,0.96);
		box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
		margin-top: var(--status-bar-height);
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		.top-bar-right{
			display: flex;
			align-items: center;
			justify-content:space-around;
			height: 88rpx;
			border: 1px solid $uni-border-color;
			box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
			image{
			margin-right: 56rpx;
			width: 48rpx;
			height: 48rpx;
		} 
			span{
				margin-left: 56rpx;
				width: 88rpx;
				height: 88rpx;
				line-height: 88rpx;
				flex: 1;
			}
		}
	}	
		.mainStyle{
			padding: 0 56rpx;
			padding-top: var(--status-bar-height);
			margin-top: 90rpx;
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
				.inputs{
					.inputs-div{
						position: relative;
						input{
						padding-top: 40rpx;
						height: 88rpx;
						font-size:$uni-font-size-lg;
						line-height: 88rpx;
						border-bottom: 1px solid #eeeeef;
						}
						.common{
							position: absolute;
							right: 0;
							top: 62rpx;
						}
						.employ{

							font-size: $uni-font-size-base;
							color: $uni-color-error;
							font-weight: 500;
						}
						.eayLook{
							width: 40rpx;
							height: 40rpx;
						}
						.ok{
							width: 21px;
							height: 16px;
						}
						.invalid{
							font-size: $uni-font-size-base;
							color: $uni-color-error;
							font-weight: 500;
						}
						
					}
					
				}
		 }
		 .submit1{
			 margin: 120rpx auto;
			 text-align: center;
			 width: 520rpx;
			 height: 96rpx;
			 line-height: 96rpx;
			 background: rgba(39, 40, 50, 0.2);
			 color: $uni-text-color-inverse;
			 border-radius: 24px;
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
