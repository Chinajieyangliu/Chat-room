export default{
	friends(){
		let friendArr = [
			{
				id:1,
				image:'one.png',
				tip:2234,
				name:'大华',
				email:'dahua@163.com',
				time:new Date,
				news:'vue+node.js 0到1实现即时通讯聊天室-前端篇10'
			},
			{
				id:2,
				image:'two.png',
				tip:2234,
				name:'大陈',
				email:'dachen@163.com',
				time:new Date,
				news:'vue+node.js 0到1实现即时通讯聊天室-前端篇'
			},
			{
				id:3,
				image:'three.png',
				tip:2234,
				name:'大真',
				email:'dazhen@163.com',
				time:new Date,
				news:'vue+node.js 0到1实现即时通讯聊天室-前端篇1'
			},
		]
		return friendArr
	},
	isFriends(){
		let friends=[
			{
				userid:1,
				friend:1
				
			},
			{
				userid:1,
				friend:2
				
			},
			{
				userid:1,
				friend:5
				
			}
		]
		return friends
	}
}