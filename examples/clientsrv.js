function runSRV(PORT){
	var HOST = '192.168.1.2';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

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

var client2 = stun.connect(port, host);
client2.on('error', onError);

// Client1: STUN Response event handler
client1.on('response', function(packet){
    console.log('Received STUN packet 1:', packet);

    // Save NAT Address
    if (packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]) {
        peer.push(packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]);
    } else {
        peer.push(packet.attrs[stun.attribute.MAPPED_ADDRESS]);
    }

    // Sending STUN Packet
    client2.request(onRequest);
});

// Client2: STUN Response event handler
client2.on('response', function(packet){
    console.log('Received STUN packet 2:', packet);

    // Save NAT Address
    if (packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]) {
        peer.push(packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]);
    } else {
        peer.push(packet.attrs[stun.attribute.MAPPED_ADDRESS]);
    }

    // Sending UDP message
    var msg = new Buffer("Hello!");
	var msg1 = new Buffer("Hello 22!");
	console.log('address1: ',peer[1].address.toString());
	console.log('port1:',peer[1].port.toString());
	console.log('address0: ',peer[0].address.toString());
	console.log('port0:',peer[0].port.toString());
	runSRV(peer[0].port);
	runSRV(peer[1].port);
	var interval=setInterval(function(){
		
    var packet1 = new Packet(Packet.BINDING_CLASS, Packet.METHOD.INDICATION, {});
    var message = packet1.encode();
    client1.send(message, 0, message.length, peer[1].port, peer[1].address);
    client2.send(message, 0, message.length, peer[0].port, peer[0].address);
		
		client1.send(msg, 0, msg.length, 9648, '109.253.199.128');
/*		client2.send(msg, 0, msg.length, 39800, '109.253.199.128');*/
        client1.send(msg, 0, msg.length, peer[1].port, peer[1].address);
        client2.send(msg1, 0, msg1.length, peer[0].port, peer[0].address);
	},2000);
/*    for (var i=0; i<20; i++) {
        client1.send(msg, 0, msg.length, peer[1].port, peer[1].address);
        client2.send(msg1, 0, msg1.length, peer[0].port, peer[0].address);
    }*/

    // Client close after 310sec
    setTimeout(function(){
		clearInterval(interval);
        client1.close();
        client2.close();
        console.log('done');
    }, 310000);
});

// Client1: UDP Message event handler
client1.on('message', function(msg, rinfo){
    console.log('Received UDP message:', msg.toString());
});

// Client2: UDP Message event handler
client2.on('message', function(msg1, rinfo){
    console.log('Received UDP message:', msg1.toString());
});

// Sending STUN request
client1.request(onRequest);
