import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

const format = process.env.FORMAT;
const isIife = format === 'iife';
const name = isIife && 'NewRelicHostApplicationsBundle';
const path = isIife ? 'umd' : 'cjs';

export default {
  input: 'src/index.js',
  name,
  output: {
    file: `dist/${path}/NewRelicHostApplications.min.js`,
    format,
  },
  plugins: [
    eslint(),
    babel(),
    uglify(),
  ],
};
