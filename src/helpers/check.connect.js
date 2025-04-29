'use strict';
const mongoose = require('mongoose');
const os = require('os');
const proess = require('process');
const _SECOND = 5000; // 5 second

// count connect to mongodb
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

// check over load
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example number of connections based on number asf cores
        const maxConnections = numCores * 5; 

        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        
        if(numConnection > maxConnections) {
            console.log(`Connection overload detected: ${numConnection} connections, max: ${maxConnections}`);
        }
    }, 5000); // Monitor every 5 seconds
}


module.exports = {
    countConnect,
    checkOverLoad
};
