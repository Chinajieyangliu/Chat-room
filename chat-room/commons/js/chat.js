export default {
getChatData(){
let msgs = [
	{
		id:'b', 	//用户id
		imgurl: 'two.webp',
		message:{
			name:'天安',
			address:'健身房空间奥斯卡接口',
			latitude:'39.90212',
			longitude:'56.545454'
		},
		types: 3,//内容类型 (0文字，1图片链接，2音频链接.··
		time: new Date()-1000*380,  	//发送时间
		tip:10
	},
	{
		id:'a', 	//用户id
		imgurl: 'one.webp',
		message:{
			name:'天安',
			address:'健身房空间奥斯卡接口',
			latitude:'39.90212',
			longitude:'56.545454'
		},
		types: 3,//内容类型 (0文字，1图片链接，2音频链接.··
		time: new Date()-1000*380,  	//发送时间
		tip:9
	},
	{
		id:'a', 	//用户id
		imgurl: 'two.webp',
		message:{
			voice:'b',
			time:2
		},
		types: 2,//内容类型 (0文字，1图片链接，2音频链接.··
		time: new Date()-1000*380,  	//发送时间
		tip:8
	},
	{
		id:'b', 	//用户id
		imgurl: 'two.webp',
		message:{
			voice:'a',
			time:30
		},
		types: 2,//内容类型 (0文字，1图片链接，2音频链接.··
		time: new Date()-1000*380,  	//发送时间
		tip:7
	},
	{
	id:"a",	//用户id
	imgurl: 'one.webp',
	message:'到文章标题列表布局排版题列表布局排版题列表布局排版时候有的标题比较长显示不完,这个时候',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接...)
	time: new Date()-1000,	//发送时间
	tip:0
	},
	{
	id:'a', 	//用户id
	imgurl: 'one.webp',
	message:'到文章标题列表布局排版题列表布局排版题列表布局排版时候有的标题比较长显示不完,这个时候',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*16, 	//发送时间
	tip:1
	},
	{
	id:'b', 	//用户id
	imgurl: 'two.webp',
	message:'到文章标题列表布局排版题列表布局排版题列表布局排版时候有的标题比较长显示不完,这个时候',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*60,  	//发送时间
	tip:2
	},
	{
	id:"a",	//用户id
	imgurl: 'one.webp',
	message:'只到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行只',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接...)
	time: new Date()-1000*120,	//发送时间
	tip:3
	},
	{
	id:'b', 	//用户id
	imgurl: 'two.webp',
	message:'two.webp',
	types: 1,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*160, 	//发送时间
	tip:4
	},
	{
	id:'b', 	//用户id
	imgurl: 'two.webp',
	message:'到文章标题列表布局排版题列表布局排版题列表布局排版时候有的标题比较长显示不完,这个时候',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*260,  	//发送时间
	tip:5
	},
	{
	id:'a', 	//用户id
	imgurl: 'two.webp',
	message:'two.webp',
	types: 1,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*280,  	//发送时间
	tip:6
	},
	
	{
	id:"a",	//用户id
	imgurl: 'one.webp',
	message:'只到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行只',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接...)
	time: new Date()-1000*120,	//发送时间
	tip:11
	},
	{
	id:'b', 	//用户id
	imgurl: 'two.webp',
	message:'two.webp',
	types: 1,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*160, 	//发送时间
	tip:12
	},
	{
	id:'b', 	//用户id
	imgurl: 'two.webp',
	message:'到文章标题列表布局排版题列表布局排版题列表布局排版时候有的标题比较长显示不完,这个时候',
	types: 0,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*260,  	//发送时间
	tip:14
	},
	{
	id:'a', 	//用户id
	imgurl: 'two.webp',
	message:'two.webp',
	types: 1,//内容类型 (0文字，1图片链接，2音频链接.··
	time: new Date()-1000*280,  	//发送时间
	tip:13
	},

]
return msgs
}
}