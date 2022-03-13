import * as path from "path";
import {instantiate} from "@assemblyscript/loader";
import {ASModule} from "../types";

const fs = require('fs')
export const initWasmModule = async () => {
  const wasmBuffer = fs.readFileSync(path.join(__dirname, './yin-optimized.wasm'));
  let instance = await instantiate<typeof ASModule>(
    wasmBuffer
  );

  return {
    ...instance.exports,
    getPitch: (
      arrayValues: Float32Array,
      setAcceptanceThreshold: number,
      sampleRate: number,
      probabilityThreshold: number
    ) => {
      const pInput = instance.exports.__retain(
        instance.exports.__newArray(instance.exports.Float32AudioBuffer_ID, arrayValues)
      );
      const pOutput = instance.exports.getPitch(
        pInput,
        setAcceptanceThreshold,
        sampleRate,
        probabilityThreshold,
        arrayValues.length
      );
      instance.exports.__release(pInput);
      return pOutput;
    },
  }

}
