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
exports.initWasmModule = void 0;
const path = require("path");
const loader_1 = require("@assemblyscript/loader");
const fs = require('fs');
const initWasmModule = () => __awaiter(void 0, void 0, void 0, function* () {
    const wasmBuffer = fs.readFileSync(path.join(__dirname, './yin-optimized.wasm'));
    let instance = yield (0, loader_1.instantiate)(wasmBuffer);
    return Object.assign(Object.assign({}, instance.exports), { getPitch: (arrayValues, setAcceptanceThreshold, sampleRate, probabilityThreshold) => {
            const pInput = instance.exports.__retain(instance.exports.__newArray(instance.exports.Float32AudioBuffer_ID, arrayValues));
            const pOutput = instance.exports.getPitch(pInput, setAcceptanceThreshold, sampleRate, probabilityThreshold, arrayValues.length);
            instance.exports.__release(pInput);
            return pOutput;
        } });
});
exports.initWasmModule = initWasmModule;
//# sourceMappingURL=wasm.js.map