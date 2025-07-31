// server.js

'use strict';


const os = require('os');
const nets = os.networkInterfaces();
const myIp = [];

const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 31000;
const robot = require("robotjs");



for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;

        if (net.family === familyV4Value && !net.internal) {
            myIp.push(net.address);
        }
    }
}

// 產生SSL
// https://github.com/FiloSottile/mkcert
const options = {
    key: fs.readFileSync('./localhost+2-key.pem'),
    cert: fs.readFileSync('./localhost+2.pem')
};

https.createServer(options, app).listen(port, () => {
    console.log('Started!');
});

app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Handle POST request
app.post('/api/data', (req, res) => {
    console.log('Received data:', req.body);

    //   https://github.com/octalmage/robotjs
    robot.keyTap(req.body.key);


    res.json({ code: 200 });
});

app.listen(port, () => {
    console.log(`Server listening at ${myIp.join(', ')}:${port}`);
});

// node server.js