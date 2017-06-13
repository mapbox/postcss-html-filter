# css-sieve

[![Build Status](https://travis-ci.org/mapbox/css-sieve.svg?branch=master)](https://travis-ci.org/mapbox/css-sieve)

Sift CSS through HTML.

Parses HTML with [Cheerio](https://github.com/cheeriojs/cheerio) — using its jQuery-like selector queries — to determine which selectors in the CSS correspond to actual elements on the page.
Removes selectors that have no corresponding elements, rules that have no corresponding selectors, at-rules containing no corresponding rules, etc.

Also, for good measure, runs the CSS through [postcss-discard-unused](https://github.com/ben-eb/postcss-discard-unused), which removes unused `@counter-style`, `@keyframes`, and `@font-face` at-rules.

## API

### sift

**`cssSieve.sift(css: string, html: string): Promise<string>`**

Returns a Promise that resolves with the fragment of `css` that has corresponding elements in the provided `html`.

### postcssPlugin

**`cssSieve.plugin({ html: string })`**

Returns a [PostCSS](http://api.postcss.org/) plugin function that you can use wherever you run PostCSS.

For more details about how to use PostCSS plugins, read [the PostCSS documentation](https://github.com/postcss/postcss#usage).

## Development

The tests are very simple.
In fact, there's just one [Jest](https://facebook.github.io/jest/) snapshot test at the moment, which provides 100% code coverage.
We can add more to the CSS and HTML fixtures, as needed, to test other scenarios and code changes; and Jest handles the comparison and offers a nice legible read-out of what went wrong.

## Is this like [UnCSS](https://github.com/giakki/uncss)?

Yes. This is essentially a simplified version of what UnCSS does.
Instead of using PhantomJS or jsdom to load the page, try to size things, download resources, etc., this module address the core problem of filtering out CSS that is not used in some HTML.
This is a low-level module that could be used within other, higher-level projects (e.g. ones that download resources).

Another project that uses Cheerio to filter out unused CSS is [css-razor](https://github.com/tscanlin/css-razor).
