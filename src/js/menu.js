import { focusin, focusout, handleKeyboardNavigationBetweenElementFromCollection } from './keyboard-a11y';
import ready from './ready';

ready(() => {
  const checkboxIsMenuHidden = document.getElementById('gf-IsMenuHidden');
  const menuButton = document.querySelector('.gf-MenuButton');
  const menu = document.getElementsByClassName('gf-Menu');
  const menuItems = [].slice.call(document.querySelectorAll('.gf-Menu-link'));
  const firstMenuItem = menuItems.reduce((acc, curr, index) => {
    return (index === 0) ? curr : acc;
  });

  let focusedElementBeforeOpeningMenu = undefined;
  let focusedMenuItem = undefined;

  menuButton.addEventListener('keydown', e => {
    const key = window.event ? e.keyCode : e.which;
    const KEY_ENTER = 13;
    const KEY_SPACE = 32;
    const KEY_DOWN  = 40;

    switch (key) {
      case KEY_DOWN:
        focusin(firstMenuItem);
      case KEY_ENTER:
      case KEY_SPACE:
        menuButton.click();
        e.preventDefault();
    }
  });

  document.body.addEventListener('keydown', e => {
    const key = window.event ? e.keyCode : e.which;
    const KEY_F10 = 121;
    const KEY_ESC = 27;
    switch (key) {
      case KEY_ESC:
        if (!checkboxIsMenuHidden.checked) {
          if (focusedMenuItem) focusout(focusedMenuItem);
          if (focusedElementBeforeOpeningMenu) { 
            focusedElementBeforeOpeningMenu.focus();
          } else {
            menuButton.focus();
          }
          menuButton.click();
          e.preventDefault();
        }
      case KEY_F10:
        if (e.shiftKey) {
          focusedElementBeforeOpeningMenu = document.querySelector(':focus');
          focusin(firstMenuItem);
          menuButton.click();
          e.preventDefault();
        }
    }
  });

  handleKeyboardNavigationBetweenElementFromCollection(menuItems, {
    onfocus: function onfocus(newFocus, oldFocus) {
      focusedMenuItem = newFocus;
    }
  });
});