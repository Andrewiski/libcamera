'use strict';
var util = require('util');
const { libcamera } = require('../dist/index.js');

const { Stream } = require("stream");

    var incomingTransStream = null;
    //var incomingTransStreamChunkCounter = 0;
    incomingTransStream = new Stream.Transform();
    incomingTransStream._transform = function (chunk, encoding, done) {
        try {
            this.push(chunk);
            return done();
        } catch (ex) {
            console.log("error", ex);
        }
    };
    var chunkCounter = 0;
    var chunkShow = 0;
    // Start incomingMonitor Stream 
    // Read from the source stream, to keeps it alive and flowing
    var incomingMonitorStream = new Stream.Writable({});
    // Consume the stream
    incomingMonitorStream._write = (chunk, encoding, next) => {
        
        chunkCounter++;
        //commonData.streamStats.chunkCounter++; //remove after new Management Server
        if (chunkCounter >= chunkShow) {
            console.log("incomingMonitorStream", "chunks processed: ", chunkCounter);
            chunkShow = chunkShow + 50;
            
        }

        next();
    };

    incomingTransStream.pipe(incomingMonitorStream);

    libcamera
    .vid({ config: { output: 'test.h264' } })
    .then(result => console.log(result))
    .catch(err => console.log(err));