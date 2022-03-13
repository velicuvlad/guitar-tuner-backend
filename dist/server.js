"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const wasm_1 = require("./wasm/wasm");
const websockets_1 = require("./websockets");
const app = express();
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = http.createServer(app);
    const wasmModule = yield (0, wasm_1.initWasmModule)();
    yield (0, websockets_1.initWebsocketServer)(server, wasmModule);
    //start our server
    server.listen(3001, () => {
        console.log(`Server started on port 3001 :)`);
    });
});
initServer();
//# sourceMappingURL=server.js.map