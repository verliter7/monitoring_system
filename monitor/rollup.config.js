import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const footer = `
if(typeof window !== 'undefined') {
  window._WebSdk_VERSION_ = '${pkg.version}'
}`;

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      footer,
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'WebSdk',
      footer,
    },
  ],
  plugins: [typescript(), commonjs(), nodeResolve(), cleanup(), terser()],
};
