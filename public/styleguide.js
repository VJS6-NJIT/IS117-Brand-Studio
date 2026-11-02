"use strict";

// Read shared CSS values instead of maintaining a second palette or spacing list.
(() => {
  const tokens = getComputedStyle(document.body);
  document.querySelectorAll("[data-color-token]").forEach((label) => {
    label.textContent = tokens
      .getPropertyValue(label.dataset.colorToken)
      .trim()
      .toUpperCase();
  });
  document.querySelectorAll("[data-space-token]").forEach((label) => {
    label.textContent = tokens
      .getPropertyValue(label.dataset.spaceToken)
      .trim();
  });
  document.querySelectorAll("[data-css-value]").forEach((label) => {
    label.textContent = tokens.getPropertyValue(label.dataset.cssValue).trim();
  });
})();
