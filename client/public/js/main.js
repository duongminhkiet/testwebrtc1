const socket = io('http://localhost:3000');
$('#divChat').hide();
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
	$('#divChat').show();
	$('#divDangky').hide();
	//console.log(arrUserInfo);
	arrUserInfo.forEach(user => {
		const {ten, peerId} = user;
		$("#ulUser").append('<li id="'+peerId+'">'+ten+'</li>');
	});

	socket.on('CO_NGUOI_MOI', user => {
		const {ten, peerId} = user;
		$("#ulUser").append('<li id="'+peerId+'">'+ten+'</li>');
	});
	socket.on('AI_DO_NGAT_KET_NOI', peerId => {
		$('#'+peerId).remove();
	});
});
socket.on('DANG_KY_THAT_BAI', () => alert('Ten nay da ton tai! Vui long chon ten khac'));

function openStream(){
	const config = {audio: true, video:true};
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}
// openStream()
// .then(stream => playStream('localStream',stream));

//var peer = new Peer({key: 'c6mdij1squn2ke29'});
var peer = new Peer({key: 'peerjs', host: 'testrtc1.herokuapp.com',secure: true, port: 443});

peer.on('open', id => {
	$('#my-peer').append(id);
	$('#btnSignup').click(() => {
		const username = $('#txtUsername').val();
		socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id});
	});
});
//I call someone
$('#btnCall').click(()=>{
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const  call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

//someone call to me
peer.on('call', call => {
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream',stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

$('#ulUser').on('click','li',function(){
	//console.log($(this).attr('id'));
	const id  = $(this).attr('id');
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const  call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});
