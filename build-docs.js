const marked = require('marked');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { highlight, highlightAuto } = require('highlight.js');
const Bundler = require('parcel');

async function build() {
  const dist = path.join(__dirname, 'docs-dist');
  const src = path.join(__dirname, 'docs');

  fs.rmdirSync(dist, { recursive: true }, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Remove existing dir');
    }
  });

  const md = fs.readFileSync(path.join(__dirname, 'README.md'));
  const index = fs.readFileSync(`${src}/index.html`, 'utf-8', () => {});
  const parsed = marked(md.toString('utf-8'), {
    highlight: (code, lang) => {
      if (!lang) {
        return highlightAuto(code).value;
      }
      return highlight(lang, code).value;
    },
  });

  const $ = cheerio.load(index);
  const $content = $('#content');
  $content.html('').append(parsed);
  $content.find('h2').eq(1).prevAll().remove();

  let menu = '';
  $content.find('h2').each((idx, el) => {
    const $el = $(el);
    menu += `<li><a href="#${$el.attr('id')}">${$el.text()}</a></li>`;
  });

  $('#toc').html('').html(menu);

  fs.writeFileSync(`${src}/index.html`, $.html());

  (async function () {
    if (process.env.NODE_ENV === 'production') {
      const bundler = new Bundler([`${src}/index.html`], {
        publicUrl: '/breakpoint-helper/',
        sourceMaps: false,
        outDir: './docs-dist',
      });

      bundler.bundle();
    } else {
      const bundler = new Bundler([`${src}/index.html`], {
        outDir: './docs-dist',
      });
      bundler.serve();
    }
  })();
}

build().catch(console.error);
