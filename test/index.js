const fs = require('fs');
const path = require('path');
const test = require('tape');
const postcss = require('postcss');
const postcssPlugins = {
  cssnext: require('postcss-import'),
  import: require('postcss-import'),
  styleGuide: require('postcss-style-guide')
};
const cssnextOpts = {
  features: {
    customProperties: {
      preserve: true
    }
  }
};

test('exists template.ejs', function (t) {
    const actual = fs.existsSync('template.ejs')

    t.same(actual, true)
    t.end()
})

test('exists style.css', function (t) {
    const actual = fs.existsSync('style.css')

    t.same(actual, true)
    t.end()
})

test('integration test: exists an output', function (t) {
  const cwd = process.cwd();
  const src = 'test/index.css';
  const dest = 'test/output.html';
  const css = fs.readFileSync( path.resolve(cwd, src), 'utf-8' );
  const styleGuideOpts = {
    project: 'Default theme',
    src: src,
    dest: dest,
    themePath: cwd
  };
  
  t.plan(1);
  postcss([
      postcssPlugins.import(),
      postcssPlugins.cssnext(cssnextOpts),
      postcssPlugins.styleGuide(styleGuideOpts)
    ])
    .process(css)
    .then(function () {
      const actual = fs.existsSync(path.resolve(cwd, dest));
      const expected = true;
      t.same(actual, expected);
      t.end();
    })
    .catch(function (err) {
      t.error(err);
      t.end();
    });
});

