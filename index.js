'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const postcss = require('postcss');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssDiscardUnused = require('postcss-discard-unused');

// These are the CSS 1 and 2 pseudo-elements that can be prefixed with
// just one colon.
const earlyPseudoElements = ['first-line', 'first-letter', 'before', 'after'];

// These are CSS pseudo classes listed at
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
// that are not supported by Cheerio (via css-select), as noted in
// https://github.com/fb55/css-select#supported-selectors
// These should be kept only if the selector applies without them.
const pseudoClassBlacklist = [
  'active',
  'any',
  'default',
  'dir',
  'first',
  'focus',
  'hover',
  'indeterminate',
  'in-range',
  'invalid',
  'lang',
  'left',
  'out-of-range',
  'read-only',
  'read-write',
  'right',
  'scope',
  'target',
  'valid',
  'visited',
  'fullscreen'
];

// Always keep selectors that include these pseudo-classes.
const pseudoClassesToAlwaysKeep = ['root'];

const removalRegExpFragments = [
  // Remove all vendor-prefixed pseudo selectors.
  '::?-[a-zA-Z-]+\\b',
  // Remove all pseudo-elements. Single colon works for early pseudo-elements.
  // Besides that, we can remove everything prefixed with two colons.
  '::[a-zA-Z-]+\\b',
  // Remove single-colon pseudo-elements and banished pseudo-classes.
  `:(${earlyPseudoElements.concat(pseudoClassBlacklist).join('|')})\\b`
];
const pseudoSelectorRemovalRegExp = new RegExp(
  `(${removalRegExpFragments.join('|')})`,
  'g'
);

const alwaysKeepRegExp = new RegExp(
  `:(${pseudoClassesToAlwaysKeep.join('|')})\b`
);

const plugin = postcss.plugin('postcss-html-filter', options => {
  const $ = cheerio.load(options.html);

  return (root, result) => {
    root.walkRules(rule => {
      let cleanedSelectors = [];

      // Skip keyframe selectors.
      if (/keyframes/.test(_.get(rule, 'parent.name', ''))) return;

      rule.selectors.forEach(selector => {
        if (alwaysKeepRegExp.test(selector)) return;

        // Pseudo-selectors are red herrings in Cheerio queries.
        const pseudoSafeSelector = selector.replace(
          pseudoSelectorRemovalRegExp,
          ''
        );

        if (!pseudoSafeSelector) {
          cleanedSelectors.push(selector);
          return;
        }
        let matchingElements;
        try {
          matchingElements = $(pseudoSafeSelector);
        } catch (cheerioError) {
          throw new Error(
            `Cheerio failed to interpret the following selector:\n  ${selector}`
          );
        }
        if (matchingElements.length !== 0) {
          cleanedSelectors.push(selector);
        }
      });

      // Remove the rule if it has no applicable selectors
      if (cleanedSelectors.length === 0) {
        rule.remove();
      } else {
        rule.selector = cleanedSelectors.join(', ');
      }
    });

    // Discard any at-rules we've emptied of rules.
    postcssDiscardEmpty()(root, result);

    // Discard unused at-rules, e.g. counter-styles, keyframes, font-faces.
    postcssDiscardUnused()(root, result);

    return root;
  };
});

module.exports = plugin;
