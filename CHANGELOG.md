# Changelog

## 3.0.0

- update dependencies, eslint rules, and travis config.

## 2.0.0

- Update dependencies and require Node version >=10.

## 1.0.1

- Strip all pseudo-elements and -classes from selectors before checking them.
  The resultant increase in CSS size should be minor (e.g. you might keep that `.foo:nth-child(8)` selector that isn't really used); but the potential for bugs in this library much, much lower.
  **This should not be a breaking change.**
  It fixes some possible bugs; and the only downside is it could possibly add some weight to your inlined CSS, if your CSS uses a *lot* of pseudo selectors.

## 1.0.0

- Release v1, because it's time.

## 0.3.1

- [Fix] More improvements to handling of pseudo selectors.

## 0.3.0

- [Breaking fix] Revamp handling of pseudo selectors.
  Pseudo-elements are stripped while checking, but pseudo-classes are passed to Cheerio, which interprets them accurately.

## 0.2.0

- Start this log.
