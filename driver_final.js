var net = require('net');
var fs = require('fs');
var dgram = require('dgram');

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: 8100});

var HOST = '192.168.1.20';
var PORT = 21100

var HOST2 = '192.168.1.10';
var PORT2 = 25000;

var HOST3 = '192.168.1.30';
var PORT3 = 6000;

var i = 0;

console.log('Server listening on ' + HOST + ':' + PORT);

wss.on('connection', function (ws) {
    var last_known_port_pic;

    var udpClient = dgram.createSocket('udp4');
    console.log("Starting Websocket Service : please launch Test Bench interface...");


    net.createServer(function (sock) {

        console.log('CONNECTED GW : ' + sock.remoteAddress + ':' + sock.remotePort);

        sock.on("data", function (data) {
            var canStr = data.toString('hex');
            var nbFrame = canStr.length / 72;

            for (i = 0; i < nbFrame; i++) {
                var mult = i * 72;
                mult = parseInt(mult);
                var dlc = canStr.substring(42 + mult, 44 + mult);
                var canId = canStr.substring(48 + mult, 56 + mult);
                var canData = canStr.substring(56 + mult, 72 + mult);
                canData = canData.substring(0, 2 * dlc);

                if (canStr.substring(48 + mult, 49 + mult) == 9) {
                    canId = 1 + canStr.substring(49 + mult, 56 + mult);
                } else if (canStr.substring(48 + mult, 49 + mult) == 8) {
                    canId = 0 + canStr.substring(49 + mult, 56 + mult);
                }

                var jsonData = '{"type":"from_GW","canId":"' + canId + '", "canData":"' + canData + '"}';
                ws.send(jsonData);

            }

        });

        //	envoi du soft vers l'ip
        ws.on('message', function incoming(data) {
            var message = JSON.parse(data);

            if (message.type == "signal") {
                var msgBuff = new Buffer(message.msg, 'hex');

                udpClient.send(msgBuff, 0, 36, PORT2, HOST2);
                console.log(message.msg);
            }

        });

    }).listen(PORT);

    // Communication with the pic 

    net.createServer(function (soc) {

        // We have a connection - a socket object is assigned to the connection automatically
        console.log('CONNECTED PIC : ' + soc.remoteAddress + ':' + soc.remotePort);
        last_known_port_pic = soc.remotePort;

        // Add a 'data' event handler to this instance of socket
        soc.on('data', function (data) {
            console.log('DATA ' + soc.remoteAddress + ': ' + data);
            var dataStr = data.toString();

            var typeMsg = dataStr.substring(0, 1);

            if (typeMsg == "E") {
                var slf = dataStr.substring(1, 5);
                var enf = dataStr.substring(5, 9);
                var slv = dataStr.substring(9, 11);
                var env = dataStr.substring(11, 13);
                var srtl = dataStr.substring(13, 15);
                var globv = dataStr.substring(15, 17);
                var tsuiv = dataStr.substring(17, 19);
                var hasSRTL = dataStr.substring(19, 20);

                var jsonData = '{"type":"from_pic", "typeMsg":"' + typeMsg + '", "slf":"' + slf + '", "enf":"' + enf + '", "slv":"' + slv + '", "env":"' + env + '", "srtl":"' + srtl + '","globv":"' + globv + '", "tsuiv":"' + tsuiv + '", "has_srtl":"' + hasSRTL + '"}';

            } else if (typeMsg == "T") {
                var latSwitch = dataStr.substring(1, 3);
                var autoposDR = dataStr.substring(3, 5);
                var globGantry = dataStr.substring(5, 7);
                var sciFRTL = dataStr.substring(7, 9);
                var sciLAT = dataStr.substring(9, 11);
				var outCtStop = dataStr.substring(11, 13);
				var tsuiv = dataStr.substring(13, 15);
				
                var jsonData = '{"type":"from_pic", "typeMsg":"' + typeMsg + '", "latSwitch":"' + latSwitch + '", "autoposDR":"' + autoposDR + '", "globGantry":"' + globGantry + '", "sciFRTL":"' + sciFRTL + '", "sciLAT":"' + sciLAT + '", "outCtStop":"' + outCtStop + '", "tsuiV":"' + tsuiv + '"}';

            } else if (typeMsg == "S") {
                var longEnable = dataStr.substring(1, 3);
                var TBLtopPan = dataStr.substring(3, 5);
                var sc1LatDR = dataStr.substring(5, 7);
                var TBLtopUpDown = dataStr.substring(7, 9);
                var globGantry2 = dataStr.substring(9, 11);
                var globTable = dataStr.substring(11, 13);
                var FRTLlatGantry = dataStr.substring(13, 15);
                var latSwitch2 = dataStr.substring(15, 17);
				var tsuiv = dataStr.substring(17, 19);

                var jsonData = '{"type":"from_pic", "typeMsg":"' + typeMsg + '", "longEnable":"' + longEnable + '", "TBLtopPan":"' + TBLtopPan + '", "sc1LatDR":"' + sc1LatDR + '", "TBLtopUpDown":"' + TBLtopUpDown + '", "globGantry2":"' + globGantry2 + '","globTable":"' + globTable + '", "FRTLlatGantry":"' + FRTLlatGantry + '", "latSwitch2":"' + latSwitch2 + '", "tsuiV":"' + tsuiv + '"}';
            }

            console.log(jsonData);

            ws.send(jsonData);
        });

        ws.on('message', function incoming(data) {
            var message = JSON.parse(data);
            console.log(message.type);

            if (message.type == "signal_pic") {
                soc.write(message.msg);
                console.log(message.msg);
            }else{
				console.log('msg : ' + message.msg);
			}
        });

    }).listen(PORT3);

});


