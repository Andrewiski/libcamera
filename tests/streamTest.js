'use strict';
var util = require('util');
const { libcamera } = require('../dist/index.js');

const { Stream, Readable, Writable, ReadableOptions, Duplex } = require("stream");
const { WriteStream, ReadStream } = require('fs');
const fs = require('fs');
    //var myStream = new Duplex(); // fs.openSync('./out.log', 'a'); //new WriteStream({path:"temp.txt"})

    var incomingTransStream = null;
    var incomingTransStreamChunkCounter = 0;
    incomingTransStream = new Stream.Transform();
    incomingTransStream._transform = function (chunk, encoding, done) {
        try {
            incomingTransStreamChunkCounter++;
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
            console.log("incomingMonitorStream", "chunks processed: ", chunkCounter, chunk.length);
            chunkShow = chunkShow + 10;
        }
        next();
    };
    incomingMonitorStream._final = ()=>{
        console.log("incomingMonitorStream", "final");
    }

    incomingTransStream.pipe(incomingMonitorStream);
    console.log("Starting libcamera")
    
    let results = libcamera.vid({ config: { "libcamaraPath": "C:\\Users\\adevries\\Source\\repos\\andrewiski\\libcamera\\windows", "libcamaraPathExt" : ".cmd", "width": "1080", "height": "768", "autofocus-mode": "manual", "inline":true, "nopreview":1, timeout:100000, "output": incomingMonitorStream } });
    results.then(executeResult => {
        console.log("Got Results");
        executeResult.on("error",(ex) => {
            console.log("error", ex);
        });
        executeResult.on("exit",() => {
            console.log("exit");
        });
        executeResult.stderr.on("data",(data) => console.log(data.toString()))
        //executeResult.stdout.on("data",(data) => console.log(data.toString()))
        //executeResult.stdout.pipe( incomingMonitorStream);
    });
    results.catch(executeResult => {
        console.log(executeResult.message)
    });
    