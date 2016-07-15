export default function (fn) {
  if (!document.attachEvent) {
    // Modern browsers
    // Using attachEvent to detect browser instead of addEventListener in order to avoid errors caused by 'addEventListener' polyfill.
    if (document.readyState !== 'loading') fn();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', fn);
  } else { // IE <= 8
    // Execute callback only with 'complete'. 'interactive' can cause some malfunctions.
    if (document.readyState === 'complete') fn();
    else document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') fn();
    });
  }
}
