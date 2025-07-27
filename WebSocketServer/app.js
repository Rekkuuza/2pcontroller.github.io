'use strict';


const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null);
const robot = require("robotjs");


const { WebSocketServer } = require('ws');
const port = 8080;

const wss = new WebSocketServer({ port });

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {

        console.log('received: %s', message);

        //   https://github.com/octalmage/robotjs
        robot.keyTap(message);


        // Echo message back to the client
        //  ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});


for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log(`WebSocket server started on ${results["en0"][0]} port ${port}`);


//node app.js