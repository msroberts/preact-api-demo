import tsc from 'typescript'
import typescript from 'rollup-plugin-typescript'
import nodeResolve from 'rollup-plugin-node-resolve'
import {uglify} from 'rollup-plugin-uglify'

export default {  
  input: 'src/index.tsx',
  output: {
    file: 'bundle.js',
    format: 'iife', // Wraps output in a function to avoid globals
    sourcemap: true,
  },
  plugins: [
    nodeResolve(), // Must call node resolve before all other plugins
    typescript({
      typescript: tsc, // Use latest version of TypeScript
    }),
    uglify(), // Minify output JS
  ],
}
