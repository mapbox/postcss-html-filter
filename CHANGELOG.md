# Changelog

## Head

- Strip all pseudo-elements and -classes from selectors before checking them.
  The resultant increase in CSS size should be minor (e.g. you might keep that `.foo:nth-child(8)` selector that isn't really used); but the potential for bugs in this library much, much lower.

## 1.0.0

- Release v1, because it's time.

## 0.3.1

- [Fix] More improvements to handling of pseudo selectors.

## 0.3.0

- [Breaking fix] Revamp handling of pseudo selectors.
  Pseudo-elements are stripped while checking, but pseudo-classes are passed to Cheerio, which interprets them accurately.

## 0.2.0

- Start this log.
