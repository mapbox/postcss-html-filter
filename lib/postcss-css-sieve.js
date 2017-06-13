'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const postcss = require('postcss');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssDiscardUnused = require('postcss-discard-unused');

const removePseudos = selector => {
  return selector.replace(/:not\([^\)]*?\)|::?[-a-zA-Z]+/g, '');
};

function postcssCssSieve(options) {
  const $ = cheerio.load(options.html);

  return (root, result) => {
    root.walkRules(rule => {
      let cleanedSelectors = [];

      // Skip keyframe selectors.
      if (/keyframes/.test(_.get(rule, 'parent.name', ''))) return;

      rule.selectors.forEach(selector => {
        // Pseudo-selectors are red herrings in Cheerio queries.
        const pseudolessSelector = removePseudos(selector);
        if (!pseudolessSelector) {
          cleanedSelectors.push(selector);
          return;
        }
        const matchingElements = $(pseudolessSelector);
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
}

const plugin = postcss.plugin('css-sieve', postcssCssSieve);

module.exports = plugin;
