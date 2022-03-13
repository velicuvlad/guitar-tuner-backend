"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebsocketServer = void 0;
const WebSocket = require("ws");
const initWebsocketServer = (server, wasmModule) => {
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        // Set binary type to arraybuffer to receive audio data as ArrayBuffer
        ws.binaryType = "arraybuffer";
        ws.on('message', (message) => {
            // Parse message as Float32Array
            let array = new Float32Array(message);
            // Run pitch detection algorithm
            let pitch = Math.round(wasmModule.getPitch(array, 0.2, 44100, 0.3));
            if (pitch !== -1) {
                console.log(pitch);
            }
            ws.send(pitch);
        });
    });
};
exports.initWebsocketServer = initWebsocketServer;
//# sourceMappingURL=websockets.js.map