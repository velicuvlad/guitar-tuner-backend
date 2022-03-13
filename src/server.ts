import * as express from 'express';
import * as http from 'http';
import {initWebsocketServer} from "./websockets";

const app = express();


const initServer = async () => {
  const server = http.createServer(app);
  await initWebsocketServer(server);

  //start our server
  server.listen(3001, () => {
    console.log(`Server started on port 3001 :)`);
  });
}

initServer()



