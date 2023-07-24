<template>
	<view>
		<h3 @tap="upload">点击上传</h3>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			upload(){
				uni.chooseImage({
					count:9,
					sizeType:['original','compressed'],
					sourceType:['album','camera'],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: 'http://localhost:3000/files/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								url:'test' ,
								name:new Date().getTime()+"liuyi"
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
							}
						});
				
						uploadTask.onProgressUpdate((res) => {
							console.log('上传进度' + res.progress);
							console.log('已经上传的数据长度' + res.totalBytesSent);
							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
