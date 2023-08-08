<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="isTalk" >
					<image src="../../static/images/submit/语音@2x.png" ></image>
				</view>
				<textarea @focus="focus" v-model="inputData" @input="inputFucn" class="chat-send btn" auto-height="true" v-if="isTalkoOrText"></textarea>
				<view class="record btn" v-else @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">按住说话</view>
				<view class="bt-img" @tap="isEmojiPlayFucn">
					<image src="../../static/images/submit/表情@2x.png" ></image>
				</view>
				<view class="bt-img" @tap="isMoreFucn">
					<image src="../../static/images/submit/添加@2x.png" ></image>
				</view>
			</view>
			<view  class="emoji" v-show="isEmojiPlay">
				<view class="emoji-send">
					<view class="emoji-send-det" @tap="delEmoji">
						<image src="../../static/images/submit/back.png" ></image>
					</view>
					<view class="emoji-send-bt"  @tap="sendEmoji">发送</view>
				</view>
				<emojies @initSendEmoji="emojiData"></emojies>
			</view>
			
			<!-- 点击拓展管理开始 -->
			<view  class="more" v-show="isMoreShowPlay">
				<view class="more-list">
					<image src="../../static/images/submit/pz.png" @tap="imageUpLoad('album')" ></image>
					<view class="more-list-title">照片</view>
				</view>
				
				<view class="more-list">
					<image src="../../static/images/submit/pz.png" @tap="imageUpLoad('picture')"></image>
					<view class="more-list-title">照片</view>
				</view>
				
				<view class="more-list">
					<image src="../../static/images/submit/dw.png" @tap="locationAddresss"></image>
					<view class="more-list-title">定位</view>
				</view>
				
				<view class="more-list">
					<image src="../../static/images/submit/pz.png" mode=""></image>
					<view class="more-list-title">照片</view>
				</view>
				
				<view class="more-list">
					<image src="../../static/images/submit/pz.png" mode=""></image>
					<view class="more-list-title">照片</view>
				</view>
			</view>
			<!-- 点击拓展管理结束 -->

		</view>
		<!-- 点击语音效果展示开始 -->
		<view class="voice-bg" v-show="isvoicePlay">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:timeOut/0.6+'%'}">
					{{timeOut}}
				</view>
			</view>
			<view class="voice-del"> 上划删除语音</view>
		</view>
		<!-- 点击语音效果展示结束 -->
	</view>
</template>

<script>
	import emojies from '../emoji/emoji.vue'
	const recorderManager = uni.getRecorderManager(); //录音相关组件
	export default {
		name:"submit",
		data() {
			return {
				isTalkoOrText:true,  	//判断人是否讲话从而弹出的是语音框
				isEmojiPlay:false,		//判断表情包是否弹出
				isMoreShowPlay:false,
				inputData:'',			//输入框的值双向绑定
				timer:0,
				timeOut:0,
				isvoicePlay:false,
				bottomToTopHeight:0
			};
		},
		components:{
			emojies
		},
		methods:{
			focus(){
				this.isEmojiPlay=false
				setTimeout(()=>{
					this.getChangeHeight()
				},100)
			},
			// 用户点击发送按钮时
			sendEmoji(){
				console.log(this.inputData)
				if(this.inputData.length>1){
					this.sendAllDatas(this.inputData,0)
				}
			},
			// 用户点击删除按钮时
			delEmoji(){
				if(this.inputData.length>0){
					this.inputData = this.inputData.substring(0,this.inputData.length-1)
				}
			},
			// 用户点击表情时候
			isEmojiPlayFucn(){
				this.isEmojiPlay=!this.isEmojiPlay,
				this.isTalkoOrText=true
				this.isMoreShowPlay=false
				this.$nextTick(()=>{
					this.getChangeHeight()
				})
			},
			getChangeHeight(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
				  this.$emit('InputFieldExpansion',data.height)
				}).exec();
			},
			// 实现组件向父组件传值
			inputFucn(e){
				let chatm = e.detail.value;
				let pos = chatm.indexOf('\n')
				if(pos!=-1 || chatm.lenght>1){
				this.sendAllDatas(this.inputData,0)
				}
			},
			emojiData(e){
				this.inputData = this.inputData+e
			},
			// 输入内容和types统一发送
			sendAllDatas(item,types){
				let datas={
					message:item,
					types:types
				}
				this.$emit('inputs',datas)
				this.$nextTick(()=>{
					this.inputData=''
				})
			},
			// 展示更多页面
			isMoreFucn(){
				this.isMoreShowPlay=!this.isMoreShowPlay
				this.isTalkoOrText=true
				this.isEmojiPlay=false
				this.$nextTick(()=>{
					this.getChangeHeight()
				})
			},
			// 语音的显示与否
			isTalk(){
				this.isTalkoOrText=!this.isTalkoOrText
				this.isEmojiPlay=false
				this.isMoreShowPlay=false
				this.$nextTick(()=>{
					this.getChangeHeight()
				})
			},
			// 图片显示上传
			imageUpLoad(e){
				let count = 9
				if(e=='album'){
					count=9
				}else{
					count=1
				}
				uni.chooseImage({
					count: count, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [e], //从相册选择
					success: (res)=> {
						const tempFilePaths = res.tempFilePaths
						for(let i=0;i<tempFilePaths.length;i++){
							this.sendAllDatas(tempFilePaths[i],1)
						}
					}
				})
			},
			touchStart(e){					//语音开始录制
				this.bottomToTopHeight=e.changedTouches[0].clientY
				let count=1
				this.isvoicePlay=true
				this.timer =setInterval(()=>{
					this.timeOut=count
					count++
					if(count>60){
						clearInterval(this.timer)
						this.touchEnd()
					}
				},1000)
				recorderManager.start();
			},

			touchEnd(){
				clearInterval(this.timer)		//结束录制语音
				this.isvoicePlay=false
				recorderManager.stop();
				recorderManager.onStop( (res)=> {
				let datas = {
					voice:JSON.stringify(res),
					time:this.timeOut
				}
				if(!this.isvoicePlay){
					this.sendAllDatas(datas,2)
				}
				 this.timeOut=0
				});
			}, //通过判断高度值来反应，上移是否删除录音
			touchMove(e){
				let moveHeight = this.bottomToTopHeight-e.changedTouches[0].clientY
				if(moveHeight>100){
					this.isvoicePlay=false
				}
			},
			//显示地图操作
			locationAddresss(){
			uni.chooseLocation({
				success:  (res)=> {
					let datas  = {
						name:res.name,
						address:res.address,
						latitude:res.latitude,
						longitude:res.longitude
					}
					let StringDatas = JSON.stringify(datas)
					this.sendAllDatas(StringDatas,3)
				}
			});
			}
			
		}
	}
</script>

<style lang="scss" >
.submit{
	width: 100%;
	position: fixed;
	bottom: 0;
	background:rgba(244,244,244,0.96);
	border-top:1px solid $uni-bg-color-grey;
	z-index: 566;
	padding-bottom:env(safe-area-inset-bottom);
	.submit-chat{
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;
		.bt-img{
			image{

			width: 60rpx;
			height: 60rpx;
			margin: 0 10rpx;
			flex: auto;
			}
		}
		.btn{
			flex:auto;
			background-color: #fff;
			border-radius:10rpx;
			padding: 20rpx;
			max-height: 160rpx;
			margin: 0 20rpx;
		}
		.chat-send{
			line-height: 38rpx;
		}
		.record{
			line-height: 38rpx;
			text-align: center;
			font-size: $uni-font-size-base;
			color:$uni-text-color-grey;
		}
	}
	.emoji{
		width:100%;
		height:460rpx;
		background:rgba(236, 237, 238,1);
		box-shadow:0px -1rpx 0px 0px rgba(0,0,0,0.1);
		.emoji-send{
			width: 300rpx;
			height: 104rpx;
			padding-top: 24rpx;
			position: fixed;
			bottom: env(safe-area-inset-bottom);
			right: 0;
			display: flex;
			.emoji-send-det{
				flex: 1;
				margin-left: 24rpx;
				height:76rpx;
				background:#fff;
				font-size:32rpx;
				text-align: center;
				line-height: 80rpx;
				padding-top: 4rpx;
				border-radius:12rpx;
				image{
					width: 42rpx;
					height: 32rpx;
				}
			}
			.emoji-send-bt{
				flex: 1;
				margin: 0 32rpx 0 20rpx;
				height:80rpx;
				background: rgba(255, 228, 49, 1);
				font-size: 32rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius:12rpx;
			}
		}
	}
	.more{
		width:100%;
		height:460rpx;
		background:rgba(236, 237, 238,1);
		box-shadow:0px -1rpx 0px 0px rgba(0,0,0,0.1);
		bottom: env(safe-area-inset-bottom);
		padding: 8rpx 20rpx;
		box-sizing: border-box;
		.more-list{
			width: 25%;
			text-align:center;
			float:left;
			padding-top: 32rpx;
			image{
			width: 72rpx;
			height: 72rpx;
			padding: 24rpx;
			background: rgba(255,255,255,1);
			border-radius:24rpx;
			}
			.more-list-title{
			font-size:24rpx;
			color:rgba(39,40,50,0.5);
			line-height:34rpx;
			}
		}

	}

}
	.voice-bg{
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 200;
		.voice-bg-len{
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.2);
			border-radius:42rpx;
			text-align: center;
			.voice-bg-time{
				display: inline-block;
				min-width: 120rpx;
				width: 120rpx;
				line-height: 84rpx;
				background-color: $uni-color-primary;
				border-radius: 42rpx;
			}
		}
		.voice-del{
			position: absolute;
			bottom: 148rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: $uni-font-size-base;
		}
	}
</style>