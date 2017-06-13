'use strict';

const fs = require('fs');
const path = require('path');
const cssSieve = require('..');

test('produces expected output', () => {
  const css = fs.readFileSync(path.join(__dirname, './fixtures/fixture.css'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, './fixtures/fixture.html'), 'utf8');
  return cssSieve.sift(css, html).then(output => {
    expect(output).toMatchSnapshot();
  });
});
