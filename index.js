'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const postcss = require('postcss');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssDiscardUnused = require('postcss-discard-unused');
const selectorParser = require('postcss-selector-parser');

const plugin = postcss.plugin('postcss-html-filter', options => {
  const query = cheerio.load(options.html);

  const transformSelector = selector => {
    selector.walkPseudos(pseudo => {
      // Keep all :root selectors.
      if (pseudo.value === 'root') {
        return;
      }
      pseudo.remove();
    });
  };

  const transformRule = rule => {
    let cleanedSelectors = [];

    // Keep all keyframe selectors.
    if (/keyframes/.test(_.get(rule, 'parent.name', ''))) return;

    rule.selectors.forEach(selector => {
      const pseudolessSelector = selectorParser(transformSelector).processSync(
        selector
      );

      if (!pseudolessSelector) {
        cleanedSelectors.push(selector);
        return;
      }
      let matchingElements;
      try {
        matchingElements = query(pseudolessSelector);
      } catch (cheerioError) {
        throw new Error(
          `Cheerio failed to interpret the following selector:\n  ${selector}`
        );
      }
      if (matchingElements.length !== 0) {
        cleanedSelectors.push(selector);
      }
    });

    // Remove the rule if it no longer has applicable selectors.
    if (cleanedSelectors.length === 0) {
      rule.remove();
    } else {
      rule.selector = cleanedSelectors.join(', ');
    }
  };

  return (root, result) => {
    root.walkRules(transformRule);

    // Discard any at-rules we've emptied of rules.
    postcssDiscardEmpty()(root, result);

    // Discard unused at-rules, e.g. counter-styles, keyframes, font-faces.
    postcssDiscardUnused()(root, result);

    return root;
  };
});

module.exports = plugin;
