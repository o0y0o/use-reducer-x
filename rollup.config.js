import path from 'path'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const external = [pkg.dependencies, pkg.peerDependencies]
  .filter(Boolean)
  .flatMap(dep => Object.keys(dep))
  .map(pkg => new RegExp(`^${pkg.replace(/\//g, '/')}`))

export default {
  input: path.join(__dirname, pkg.src),
  external,
  plugins: [babel({ exclude: 'node_modules/**', babelHelpers: 'runtime' })],
  output: [
    {
      file: path.join(__dirname, pkg.main),
      format: 'cjs',
      exports: 'default'
    },
    {
      file: path.join(__dirname, pkg.module),
      format: 'es'
    }
  ]
}
