var fs = require('fs');
var path = require('path');
var test = require('tape');
var postcss = require('postcss');
var cssnextOpts = {
  features: {
    customProperties: {
      preserve: true
    }
  }
};

test('exists template.ejs', function (t) {
    var actual = fs.existsSync('template.ejs')

    t.same(actual, true)
    t.end()
})

test('exists style.css', function (t) {
    var actual = fs.existsSync('style.css')

    t.same(actual, true)
    t.end()
})

test('integration test: exists an output', function (t) {
  var cwd = process.cwd();
  var src = 'test/index.css';
  var dest = 'test/output.html';
  var css = fs.readFileSync( path.resolve(cwd, src), 'utf-8' );
  
  t.plan(1);
  postcss([
      require('postcss-import')(),
      require('postcss-cssnext')({
        features: {
          customProperties: {
            preserve: true
          }
        }
      }),
      require('postcss-style-guide')({
        project: 'Greek Fire!',
        dest: dest,
        themePath: cwd
      })
    ])
    .process(css, {
      from: src
    })
    .then(function () {
      var actual = fs.existsSync(path.resolve(cwd, dest));
      var expected = true;
      t.same(actual, expected);
      t.end();
    })
    .catch(function (err) {
      t.error(err);
      t.end();
    });
});

