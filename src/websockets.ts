import * as WebSocket from "ws";
import * as http from "http";
import {get_pitch} from "./pkg";

// Initialize a websocket server with some custom config
// Add an event listener to the server which will run the pitch detection algorithm every time the server receives a message
export const initWebsocketServer = (server: http.Server) => {
  const wss = new WebSocket.Server({ server  });
  wss.on('connection', (ws: WebSocket) => {
    // Set binary type to arraybuffer to receive audio data as ArrayBuffer
    ws.binaryType = "arraybuffer";

    ws.on('message', (message: any) => {
      // Parse message as Float32Array
      let array = new Float32Array(message)
      // Run pitch detection algorithm

      let pitch = Math.round(get_pitch(array, 0.2, 44100, 0.3));
      ws.send(pitch);
    });
  });
}
