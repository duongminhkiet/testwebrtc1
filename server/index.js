var io = require('socket.io')(3000);

const arrUserInfo = [];

io.on('connection', socket => {
	socket.on('NGUOI_DUNG_DANG_KY',user => {
		const isExist = arrUserInfo.some(e => e.ten === user.ten);
		socket.peerId = user.peerId;
		if(isExist){
			return socket.emit('DANG_KY_THAT_BAI');
		}
		arrUserInfo.push(user);
		socket.emit('DANH_SACH_ONLINE', arrUserInfo);//just send to sender
		//io.emit('CO_NGUOI_MOI', user);//send to every body
		socket.broadcast.emit('CO_NGUOI_MOI', user);//send to everybody except sender
		//console.log(username);
	});
	socket.on('disconnect', () => {
		const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
		arrUserInfo.splice(index, 1);
		io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
	});
});