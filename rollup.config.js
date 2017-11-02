import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

const format = process.env.FORMAT;
const name = format === 'umd' && 'NewRelicHostAppsBundle';

export default {
  input: 'src/index.js',
  name,
  output: {
    file: `dist/${format}/NewRelicHostApps.min.js`,
    format,
  },
  plugins: [
    eslint(),
    babel(),
    uglify(),
  ],
};
