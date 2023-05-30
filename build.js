import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/breakpoint-helper.js',
  bundle: true,
  sourcemap: true,
  platform: 'neutral', // for ESM
  format: 'esm',
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
