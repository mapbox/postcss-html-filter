'use strict';

const postcss = require('postcss');
const postcssCssSieve = require('./postcss-css-sieve');

function sift(css, html) {
  return postcss()
    .use(postcssCssSieve({ html }))
    .process(css)
    .then(result => result.css);
}

module.exports = sift;
