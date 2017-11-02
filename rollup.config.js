import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

const isDev = process.env.ENVIRONMENT === 'dev';
const format = process.env.FORMAT;
const name = format === 'umd' && 'NewRelicHostAppsBundle';
const fileName = isDev ? 'NewRelicHostApps.js' : 'NewRelicHostApps.min.js';

export default {
  input: 'src/index.js',
  name,
  output: {
    file: `dist/${format}/${fileName}`,
    format,
  },
  plugins: [
    eslint(),
    babel(),
    !isDev && uglify(),
  ],
};
