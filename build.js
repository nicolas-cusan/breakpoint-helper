const { build } = require('esbuild');
const { copy } = require('esbuild-plugin-copy');

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/breakpoint-helper.js',
  bundle: true,
  sourcemap: true,
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: ['./src/*.scss'],
        to: ['./dist'],
      },
    }),
  ],
}).catch(() => process.exit(1));
