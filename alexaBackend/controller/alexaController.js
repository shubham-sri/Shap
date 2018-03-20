var io = require('socket.io-client');
var socket = io.connect(process.env.SOCKETURI || 'url off socket');


//Module for maneging the data which recived on socket
module.exports.getSocketData = function(callback){
	socket.on('message',function(data){
		callback(data);
	});
}


// module to send "ON" request to device
module.exports.onDevice = (req, res, next)=>{
	socket.emit('message','allt1');
	if (req.deviceSts == "off") {
		req.toSpeek = 'Device is on'
		next();
	}
	else{
		req.toSpeek = 'Device is allready on'
		next();
	}
}
// module to send "OFF" request to device
module.exports.offDevice = (req, res, next)=>{
	socket.emit('message','allt0');
	if (req.deviceSts == "on") {
		req.toSpeek = 'Device is off'
		next();
	}
	else{
		req.toSpeek = 'Device is allready off'
		next();
	}
	
}

