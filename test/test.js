'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const plugin = require('..');

test('produces expected output', () => {
  const css = fs.readFileSync(
    path.join(__dirname, './fixtures/fixture.css'),
    'utf8'
  );
  const html = fs.readFileSync(
    path.join(__dirname, './fixtures/fixture.html'),
    'utf8'
  );
  return postcss().use(plugin({ html })).process(css).then(result => {
    expect(result.css).toMatchSnapshot();
  });
});
