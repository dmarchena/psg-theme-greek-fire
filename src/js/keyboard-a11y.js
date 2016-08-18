function focusin(elem) {
  elem.focus();
  elem.setAttribute("tabindex", 0);
  elem.classList.add('focus--keyboard');
}
function focusout(elem) {
  elem.setAttribute("tabindex", -1);
  elem.classList.remove('focus--keyboard');
}

function handleKeyboardNavigationBetweenElementFromCollection(collection, options) {
  options = Object.assign({
    direction: 'vertical', // or horizontal
    onfocus: function dumb(newFocus, oldFocus) {}
  }, options);

  const KEY_ENTER = 13;
  const KEY_SPACE = 32;
  const KEY_LEFT  = 37;
  const KEY_UP    = 38;
  const KEY_RIGHT = 39;
  const KEY_DOWN  = 40;
  const KEY_NEXT = (options.direction === 'horizontal') ? KEY_RIGHT : KEY_DOWN;
  const KEY_PREV = (options.direction === 'horizontal') ? KEY_LEFT : KEY_UP;

  collection = [].slice.call(collection);
  collection.map((item, itemIndex) => {
    var previousSibling = collection.reduce((acc, curr, index) => {
      if (itemIndex === 0) {
        return curr;
      } else {
        return (index < itemIndex) ? curr : acc;
      }
    }, null);
    var nextSibling = collection.reduce((acc, curr, index) => {
      const isLastItem = (itemIndex === collection.length - 1);
      if (index === 0 && isLastItem) {
        return curr;
      } else {
        return (itemIndex === index - 1) ? curr : acc;
      }
    }, null);
    item.addEventListener('keydown', e => {
      const key = window.event ? e.keyCode : e.which;
      let sibling = null;

      switch (key) {
        case KEY_PREV:
          focusout(item);
          focusin(previousSibling);
          options.onfocus(previousSibling, item);
          e.preventDefault();
          break;
        case KEY_NEXT:
          focusout(item);
          focusin(nextSibling);
          options.onfocus(nextSibling, item);
          e.preventDefault();
          break;
        case KEY_ENTER:
        case KEY_SPACE:
          focusout(item);
          item.click('click');
          e.preventDefault();
      }
    })
  });
}

export { focusin, focusout, handleKeyboardNavigationBetweenElementFromCollection };