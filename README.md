## Note: This repository is no longer active. 
As of April 2024 this archive is no longer used as core infrastructure for Mapbox docs has moved to a [docusaurus based](https://github.com/mapbox/docusaurus-packages) website builder.

# @mapbox/postcss-html-filter

[![Build Status](https://travis-ci.com/mapbox/postcss-html-filter.svg?branch=main)](https://travis-ci.com/mapbox/postcss-html-filter)

Filter CSS through HTML, removing selectors that do not apply to that HTML.

Parses HTML with [Cheerio](https://github.com/cheeriojs/cheerio) — using its jQuery-like selector queries — to determine which selectors in the CSS correspond to actual elements on the page.
Removes selectors that have no corresponding elements, rules that have no corresponding selectors, at-rules containing no corresponding rules, etc.

Also, for good measure, runs the CSS through [postcss-discard-unused](https://github.com/ben-eb/postcss-discard-unused), which removes unused `@counter-style`, `@keyframes`, and `@font-face` at-rules.

## Installation

```
npm install @mapbox/postcss-html-filter
```

## Usage

Follow the instructions for [your PostCSS runner](https://github.com/postcss/postcss#usage).

This example uses PostCSS's Node API:

```js
const postcss = require('postcss');
const postcssHtmlFilter = require('@mapbox/postcss-html-filter');
const fs = require('fs');

const myHtml = fs.readFileSync('path/to/some.html', 'utf8');
postcss()
  .use(postcssHtmlFilter({ html: myHtml })
  .then(result => { /* ... */ });
```

## Options

### html

Type: `string`.
**Required**.

The HTML that you will use to filter your CSS.

## Details

- Before checking if a selector applies to the HTML [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) are stripped (e.g. `::before`, `::first-line`).
  If the selector applies *without* them, we can assume that it also applies *with* them, and the selector should be kept.
  [Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) (e.g. `:first-child`, `:not(a)`, `:nth-child(3)`) are passed to Cheerio when Cheerio can interpret them (using [css-select](https://github.com/fb55/css-select)).
  If the pseudo-class cannot be interpreted by Cheerio, it is stripped before the selector is checked.

## Caveats

- This does not resolve nested selectors (e.g. for SCSS and Less).
  If you want to give that a shot, feel free to try a PR.
  Maybe try [postcss-resolve-nested-selector](https://github.com/davidtheclark/postcss-resolve-nested-selector).

## Is this like [UnCSS](https://github.com/giakki/uncss)?

Kind of. This is essentially a simplified version of what UnCSS does.
Instead of using PhantomJS or jsdom to load the page, size things, download resources, etc., this module only addresse the core problem of filtering out CSS that is not used in some HTML.
This is a low-level module that could be used within other, higher-level projects (e.g. ones that download resources).

## Similar projects

- Another project that uses Cheerio to filter out unused CSS is [css-razor](https://github.com/tscanlin/css-razor).
- Another PostCSS plugin with similar aims is [usedcss](https://github.com/komachi/usedcss).

## Development

The tests are very simple.
In fact, there's just one [Jest](https://facebook.github.io/jest/) snapshot test at the moment, which provides 100% code coverage.
We can add more to the CSS and HTML fixtures, as needed, to test other scenarios and code changes; and Jest handles the comparison and offers a nice legible read-out of what went wrong.
