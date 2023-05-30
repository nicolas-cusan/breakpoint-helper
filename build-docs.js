import { marked } from 'marked';
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { Parcel } from '@parcel/core';

import { markedHighlight } from 'marked-highlight';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { mangle } from 'marked-mangle';
import hljs from 'highlight.js';

async function build() {
  // const dist = path.join(__dirname, 'docs-dist');
  const src = './docs';

  // fs.rm(dist, { recursive: true }, (err) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     console.log('Remove existing dir');
  //   }
  // });

  marked.use(mangle());
  marked.use(gfmHeadingId());
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const md = fs.readFileSync('./README.md', 'utf-8', () => {});
  const index = fs.readFileSync(`${src}/index.html`, 'utf-8', () => {});
  const parsed = marked.parse(md.toString('utf-8'));

  const $ = cheerio.load(index);
  const $content = $('#content');
  $content.html('').append(parsed);
  $content.find('h2').eq(1).prevAll().remove();

  let $prevList = null;
  let $prevItem = null;
  const $toc = $('<ul class="list"></ul>');

  $content.find('h2, h3').each((idx, el) => {
    const $el = $(el);
    const $html = $el
      .html()
      .toString()
      .replace(/ *\([^)]*\) */g, '');
    const $li = $(`<li><a href="#${$el.attr('id')}">${$html}</a></li>`);

    if ($el.is('h2')) {
      $prevList = $('<ul></ul>');
      $prevItem = $li;
      $prevItem.append($prevList);
      $prevItem.appendTo($toc);
    } else {
      $li.find('a').addClass('sub-item');
      $prevList.append($li);
    }
  });

  $('#toc').html('').html($toc);

  fs.writeFileSync(`${src}/index.html`, $.html());

  (async function () {
    if (process.env.NODE_ENV === 'production') {
      const bundler = new Parcel({
        entries: [`${src}/index.html`],
        sourceMaps: false,
        targets: {
          default: {
            distDir: './docs-dist',
            publicUrl: 'https://nicolas-cusan.github.io/breakpoint-helper/',
          },
        },
      });

      try {
        let { bundleGraph, buildTime } = await bundler.run();
        let bundles = bundleGraph.getBundles();
        console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
      } catch (err) {
        console.log(err.diagnostics);
      }
    } else {
      const bundler = new Parcel({
        entries: [`${src}/index.html`],
        serveOptions: {
          port: 3000,
          distDir: './docs-dist',
        },
        hmrOptions: {
          port: 3000,
        },
        targets: {
          default: {
            distDir: './docs-dist',
          },
        },
      });

      await bundler.watch();
    }
  })();
}

build().catch(console.error);
