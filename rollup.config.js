import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import nodeResolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'

export default {
  input: './index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      interop: false
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: ['@babel/transform-runtime'],
      presets: [['@babel/env', { modules: false }]],
      runtimeHelpers: true
    }),
    nodeResolve(),
    commonjs()
  ]
}
