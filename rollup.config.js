import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const { PRODUCTION } = process.env;

const plugins = ({ module, noMinify }) => {
  return [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    PRODUCTION &&
      !noMinify &&
      terser({
        module,
        mangle: true,
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      }),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ];
};

const configs = [
  {
    input: 'sources/js/script.js',
    output: {
      format: 'iife',
      file: pkg.main,
      name: 'Autocomplete',
      sourcemap: !PRODUCTION,
    },
    plugins: plugins({ module: false }),
  },
  {
    input: 'sources/js/script.js',
    watch: false,
    output: {
      format: 'umd',
      file: pkg.browser,
      name: 'Autocomplete',
    },
    plugins: plugins({ module: true }),
  },
  {
    input: 'sources/js/script.js',
    output: {
      format: 'iife',
      file: 'docs/js/autocomplete.js',
      name: 'Autocomplete',
    },
    plugins: plugins({ noMinify: true }),
  },
  {
    input: 'sources/js/polyfill.js',
    watch: false,
    output: {
      format: 'esm',
      file: 'docs/js/polyfill.js',
    },
    plugins: plugins({ module: false }),
  },
];

export default configs;
