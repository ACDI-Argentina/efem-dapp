"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * https://gajus.medium.com/making-the-anchor-links-work-in-spa-applications-618ba2c6954a
 */
var _default = function _default(history) {
  let timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  let mainSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'right-side';
  let observer;
  let timeoutId;

  if (!window.MutationObserver) {
    return;
  }

  const reset = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (observer) {
      observer.disconnect();
    }
  };

  const createScrollToElement = id => {
    return () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView();
        reset();
        return true;
      }

      return false;
    };
  };

  function scroll(location) {
    if (typeof location.hash !== 'string') {
      return;
    }

    const elementId = location.hash.slice(1);

    if (!elementId) {
      const contentArea = document.getElementById(mainSelector);

      if (contentArea) {
        contentArea.scrollTop = 0;
      }

      return;
    }

    const scrollToElement = createScrollToElement(elementId);
    setTimeout(() => {
      if (scrollToElement()) {
        return;
      }

      observer = new MutationObserver(scrollToElement);
      observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true
      });
      timeoutId = setTimeout(reset, timeout);
    });
  }

  history.listen((location, action) => {
    if (timeoutId) {
      reset();
    }

    if (action !== 'PUSH') {
      return;
    }

    scroll(location);
  });
  requestAnimationFrame(() => {
    scroll(window.location);
  });
};

exports.default = _default;