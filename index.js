'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const postcss = require('postcss');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssDiscardUnused = require('postcss-discard-unused');
const selectorParser = require('postcss-selector-parser');

const htmlFilterPlugin = (options) => {
  const query = cheerio.load(options.html);

  const transformSelector = (selector) => {
    selector.walkPseudos((pseudo) => {
      // Keep all :root selectors.
      if (pseudo.value === 'root') {
        return;
      }
      pseudo.remove();
    });
  };

  const transformRule = (rule) => {
    let cleanedSelectors = [];

    // Keep all keyframe selectors.
    if (/keyframes/.test(_.get(rule, 'parent.name', ''))) return;

    rule.selectors.forEach((selector) => {
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

  return {
    postcssPlugin: 'postcss-html-filter',
    Once: (root) => {
      root.walkRules(transformRule);
      return root;
    }
  }
};

const combinedPlugin = (options) => {
  return postcss([
    htmlFilterPlugin(options),
    postcssDiscardEmpty, // Discard any at-rules we've emptied of rules.
    postcssDiscardUnused // Discard unused at-rules, e.g. counter-styles, keyframes, font-faces.
  ])
}

combinedPlugin.postcss = true

module.exports = combinedPlugin;
