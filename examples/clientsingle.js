var server;
var msg_count=0;
var dgram = require('dgram');
function runSRV(PORT){
	var HOST = '192.168.1.2';

server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
	msg_count++;
	server.send("got your message",remote.port, remote.address,function(err,bytes){
		if(err)throw err;
		console.log('UDP message sent to <' +remote.port +'><' + remote.address +'>');
	});
	if(msg_count > 3){
		server.close(function(){console.log('server closed :)');});
	}
});
server.bind(PORT, HOST);
}
var Packet = require('./packet');
var dgram = require('dgram'),
    stun  = require('../lib');

var peer = [];

// STUN Server (by Google)
var port = 19302;
var host = 'stun.l.google.com';

// Event Handler
var onRequest = function(){
    console.log('Sending STUN packet');
};

var onError = function(){
    console.log('Error: some error');
};

// Create STUN Client
var client1 = stun.connect(port, host);
client1.on('error', onError);


// Client1: STUN Response event handler
client1.on('response', function(packet){
    console.log('Received STUN packet 1:', packet);

    // Save NAT Address
    if (packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]) {
        peer.push(packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]);
    } else {
        peer.push(packet.attrs[stun.attribute.MAPPED_ADDRESS]);
    }
var msg = new Buffer("Hello XYUJIO (_-_)");
	console.log('address0: ',peer[0].address.toString());
	console.log('port0:',peer[0].port.toString());
	runSRV(peer[0].port);
		var interval=setInterval(function(){
		
    var packet1 = new Packet(Packet.BINDING_CLASS, Packet.METHOD.INDICATION, {});
    var message = packet1.encode();
    client1.send(message, 0, message.length, peer[0].port, peer[0].address);
		
		client1.send(msg, 0, msg.length, 40294, '109.253.199.128');

        client1.send(msg, 0, msg.length, peer[0].port, peer[0].address);

	},1000);


    // Client close after 310sec
    setTimeout(function(){
		clearInterval(interval);
        client1.close();
        console.log('done');
    }, 500000);
});

// Client1: UDP Message event handler
client1.on('message', function(msg, rinfo){
	
    console.log('Received UDP message:' + msg.toString());
	
});

// Sending STUN request
client1.request(onRequest);
