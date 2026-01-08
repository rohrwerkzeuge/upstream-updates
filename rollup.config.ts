// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import esmShim from '@rollup/plugin-esm-shim'
import { copyFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

// Custom plugin to copy the 1Password SDK wasm file to dist
function copyWasm() {
  return {
    name: 'copy-wasm',
    writeBundle() {
      const src = 'node_modules/@1password/sdk-core/nodejs/core_bg.wasm'
      const dest = 'dist/core_bg.wasm'

      // Ensure dist directory exists
      mkdirSync(dirname(dest), { recursive: true })

      // Copy the wasm file
      copyFileSync(src, dest)
      console.log('Copied core_bg.wasm to dist/')
    }
  }
}

const config = {
  input: 'src/index.ts',
  output: {
    esModule: true,
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    esmShim(),
    copyWasm()
  ]
}

export default config
