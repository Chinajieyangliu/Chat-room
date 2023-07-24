<template>
	<view class="eomjies">
		<view class="eomji-line" v-for="(line,i) in emojiGroup" :key="i">
			<view @tap="initSendEmoji(item)" class="eomji-line-item" v-for="item,index in line" :key="index"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emojiGroup:[
							['😁','😁','😂','🤣','😅','😋'],
							['😀','😁','😂','🤣','😅','😋'],
							['😀','😁','😂','🤣','😅','😋'],
							['😀','😁','😂','🤣','😅','😋'],
							
						],
			};
		},
		methods:{
			initSendEmoji(e){
				this.$emit('initSendEmoji',e)
			}
		}
	
	}
</script>

<style lang="scss">
.eomjies{
	width: 100%;
	height: 460rpx;
	padding: 16rpx 10rpx 188rpx 10rpx;
	box-sizing: border-box;
	overflow: hidden;
	overflow-y: auto;
	background-color: skyblue;
	.eomji-line{
		display: flex;
		background-color: black;
		.eomji-line-item{
			flex: 1;
			background-color: pink;
			width: 30rpx;
			height: 60rpx;
			text-align: center;
			font-size: 40rpx;
			line-height:72rpx;
		}
	}
	
}
</style>