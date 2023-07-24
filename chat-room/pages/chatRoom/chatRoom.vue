<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<span @tap="backOne">返回</span>
			</view>
			<view class="top-bar-center ">
				<span class="title pice">{{chatMessage.name}}</span>
			</view>
			<view class="top-bar-right" >
				<image src="../../static/images/userMessage/two.webp"></image>
			</view>
		</view>
			<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="tagIndex" @scrolltoupper="onShowLoading">
				<view class="chat-main" :style="{paddingBottom:mainHeight+'px'}">
					<!-- 加载图片 -->
					<view class="loading" v-show="isShowLoadingImg">
						<image :animation="animationData" src="../../static/images/common/loading.png" class="loading-img"></image> 
					</view>
					<view class="chat-list" v-for="item,index in chatDatas" :key="index" :id="`msg${index}`">
						<view class="chat-time">2020.06.07</view>
						<view class="mes-m mesg-left" v-show="item.id !=userMessages.uid">
							<image class="user-img" src="../../static/images/userMessage/one.webp"></image>
							<view class="message" v-if="item.types==0">
								<view class="msg-text">{{ item.message }}</view>
								<!-- item.message -->
							</view>
							<view class="message"  v-else-if="item.types==1">
								<image class="msg-img" @tap="openAndFindImage(item.message)" :src="item.message" mode="widthFix"></image>
							</view>
							<view class="message" v-else-if="item.types==2" >
								<view class="msg-text voice" @tap="playVoice(item.message.voice)" :style="{width:item.message.time*4+'px'}">
									{{item.message.time}}
									<image  class="voice-img"  src="../../static/images/chatroom/yy.png"></image>
								</view>
							</view> 
							<view class="message" v-else-if="item.types==3">
								<view class="msg-map" @tap="openLocationMap(item.message)">
									<view class="map-name">{{item.message.name}}</view>
									<view class="map-address">{{item.message.address}}</view>
									<image class="map-img" src="../../static/images/chatroom/map.png" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						
						<view class="mes-m mesg-right" v-show="item.id ==userMessages.uid">
							<image class="user-img" :src="`../../static/images/userMessage/${item.imgurl}`"></image>
							<!-- 文字信息 -->
							<view class="message" v-if="item.types==0">
								<view class="msg-text">{{item.message}}</view>
							</view>
							<!-- 图片信息 -->
							<view class="message" v-else-if="item.types==1">
								<image @tap="openAndFindImage(item.message)"  class="msg-img"   :src="item.message" mode="widthFix"></image>
							</view>
							<!-- 音频信息 -->
							<view class="message" v-else-if="item.types==2">
								<view class="msg-text voice" @tap="playVoice(item.message.voice)" :style="{width:item.message.time*4+'px'}">
									{{item.message.time}}
									<image  class="voice-img"  src="../../static/images/chatroom/yy.png"></image>
								</view>
							</view>
							<view class="message" v-else-if="item.types==3">
								<view class="msg-map" @tap="openLocationMap(item.message)">
									<view class="map-name">{{item.message.name}}</view>
									<view class="map-address">{{item.message.address}}</view>
									<image class="map-img" src="../../static/images/chatroom/map.png" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						
					</view>

				</view>
				<view class="padb"></view>
			</scroll-view>
			<submit @InputFieldExpansion="getInputHeight" @inputs="getInputData"></submit>
	</view>
</template> 

<script>
	import chatData from '../../commons/js/chat.js';
	import submit from '../../components/submit/submit.vue'
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				chatDatas:[],
				sendImgMessage:[],
				tagIndex:'',
				mainHeight:60,
				animationData: {},
				isShowLoadingImg:false,
				newPages:0,
				pageSize:10,
				IntervalId:0,
				userMessages:{
					uid:'',
					imgurl:'',
					name:'',
					token:''
				},
				chatMessage:{
					uid:'',
					img:'',
					name:'',
					type:""
				}
			};
		},
		onReady(){
		},
		onLoad(e){
			this.getLocationData()
			this.chatMessage.uid = e.id
			this.chatMessage.img = e.img
			this.chatMessage.name = e.name
			this.chatMessage.type = e.type
			this.initData();
		},
		components:{
			submit
		},
		methods:{
			// 获取本地信息
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
			initData(){
				uni.request({
					url:this.$http+'/chat/msg',
					data:{
						uid:this.userMessages.uid,
						fid:this.chatMessage.uid,
						newPage:this.newPages,
						pageSize:this.pageSize,
						state:1,
					},
					method:'POST',
					success:(res)=>{
						let status = res.data.status
						if(status == 200){
							let arr = res.data.result
							let count = 0
							let page = 0
							let maxpages=arr.length
							if(arr.length>(page+1)*5){
								maxpages=(page+1)*5
								this.newPages++
							}else{
								this.newPages=-1
							}
							for(let i=page*5;i<maxpages; i++){
								if(arr[i].types==1){
									this.sendImgMessage.unshift(`../../static/images/userMessage/${arr[i].message}`)
									arr[i].message = `../../static/images/userMessage/${arr[i].message}`
								}
								
								this.chatDatas.unshift(arr[i])
								count++
							}
							this.tagIndex=`msg${count-1}`
							clearInterval(this.IntervalId)
							this.isShowLoadingImg=false
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
			// 图片放大方法
			openAndFindImage(e){
				uni.previewImage({
					current:this.sendImgMessage.indexOf(e),
					urls:this.sendImgMessage,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			getInputData(e){
				let data = {
					id:'a', 	//用户id
					imgurl: 'two.webp',
					message:e.message,
					types: e.types,//内容类型 (0文字，1图片链接，2音频链接.··
					time: new Date()-1000*280,  	//发送时间
					tip:6
				}
				this.chatDatas.push(data)
				if(e.types == 1){
					this.sendImgMessage.push(e.message)
				}
				this.scroolBottom()
			},
			getInputHeight(e){
				this.mainHeight=e
				this.scroolBottom()
			},
			scroolBottom(){
				this.tagIndex=''
				this.$nextTick(()=>{
					let len = this.chatDatas.length-1
					this.tagIndex=`msg${len-1}`
				})
			},
			//播放录音功能
			playVoice(e){
				innerAudioContext.src = e;
				innerAudioContext.Play();
			},
			//地图位置显示功能
			covers(e){
				let map=[
					{
						latitude:e.latitude,
						longitude:e.longitude,
						iconPath:'/static/images/submit/adw.png'
					}
				]
				return (map);
			},
			openLocationMap(e){
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name:e.name,
					address:e.address,
					success: function () {
						console.log('success');
					}
				});
			},
			// 开局加载聊天数据
			onShowLoading(){
				clearInterval(this.IntervalId)
				if(this.newPages>0){
					this.isShowLoadingImg=true
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})
					let i=1
					this.IntervalId = setInterval(function(){
					  animation.rotate(i*30).step()
					  this.animationData = animation.export()
					  i++
					  if(i>20){
						 this.initData(this.newPages)
					  }
					}.bind(this), 200)
				}else{
				}

			},
			backOne(){
				uni.navigateBack({
					delta: 1
				});
			}

		}
	}
</script>

<style lang="scss">
@import '../../commons/css/topBar.scss';
page{
	height: 100%;
}
.content{
	height: 100%;
	background:rgba(244,244, 244, 1);
.top-bar{
	background: rgba(244,244, 244,0.96);
	box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
.top-bar-left{}
.top-bar-center{}
.top-bar-right{
	image{
		margin-top: 4rpx;
		margin-right: 24rpx;
	}
	}
}
.chat{
	height: 100%;
	.padbt{
		height:var(--status-bar-height);
		width: 100%;
	}
	.chat-main{
		text-align: center;
		padding-left: $uni-spacing-col-base;
		padding-right: $uni-spacing-col-base;
		padding-top:100rpx;
		display:flex;
		flex-direction: column;
		.loading{
			text-align: center;
				.loading-img{
					width: 60rpx;
					height: 60rpx;
			}
		}
		.chat-list{
			.chat-time{
				font-size:$uni-font-size-sm;
				color:rgba(39,40,50,0.3);
				line-height:34rpx;
				padding: 20rpx 0;
				text-align: center;
			}
			.mes-m{
					display: flex;
					padding: 20rpx 0;
					.user-img{
						width:$uni-img-size-sm;
						height:$uni-img-size-sm;
						border-radius:$uni-border-radius-base;
					}
				.message{
					max-width: 480rpx;
					.msg-text{
						flex: auto;
						font-size:$uni-font-size-lg;
						color:$uni-text-color;
						line-height:44rpx;
						padding: 18rpx 24rpx;
					}
					.msg-img{
						max-width: 400rpx;
						border-radius: $uni-border-radius-base
					}
					.voice{
						min-width: 80px;
						max-width: 400px;
					}
					.msg-map{
						background: #fff;
						width: 464rpx;
						height: 284rpx;
						overflow: hidden;
		
							.map-name{
								font-size:$uni-font-size-lg;
								color:$uni-text-color;
								line-height:44rpx;
								padding: 18rpx 24rpx 0 24rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}
							.map-address{
								font-size:$uni-font-size-sm;
								color:$uni-text-color-disable;
								padding: 0rpx 24rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}
							.map-img{
								padding-top: 8rpx;
								width: 480rpx;
								height: 180rpx;
							}
					}
				}
			}
			.mesg-left{
				flex-direction: row;
				.msg-text{
					margin-left: 16rpx;
					background-color: #fff;
					border-radius :0px 20rpx 20rpx 20rpx;
				};
				.msg-img{
					margin-right: 16rpx;
				}
				.msg-map{
					margin-left:16rpx;
					border-radius :0rpx 20px 20rpx 20rpx;
				}
			.voice{
				text-align: right;
				.voice-img{
					float: left;
					transform: rotate(180deg);
					padding-bottom: 4rpx;
					width:28rpx;
					height: 36rpx;
				}
			}
		}
			.mesg-right{
				flex-direction: row-reverse;
				.msg-text{
					margin-right: 16rpx;
					background-color: #fff260;
					border-radius :20rpx 0rpx 20rpx 20rpx;
				}
				.msg-img{
					margin-right: 16rpx;
				}
				.msg-map{
					margin-right:16rpx;
					border-radius :20rpx 0px 20rpx 20rpx;
				}
				.voice{
					text-align: left;
					.voice-img{
						float: right;
						width:28rpx;
						height: 36rpx;
					}
				}
				
			}
			
		}
	}
	}
}
</style>
