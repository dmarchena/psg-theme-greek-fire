import { handleKeyboardNavigationBetweenElementFromCollection } from './keyboard-a11y';
import iframify from './iframify';

const classNameBase = 'gf-ResponsiveSample';
const classNameStatePressed = 'is-pressed';
const attrIframeResizedTo = 'data-resize-iframe-to';


export default function responsiveSandbox(elem, options) {
  const defaults = {
    breakpoints: ['480px', '768px', '1024px']
  };

  options = Object.assign({}, defaults, options);

  const sandbox = {
    controls: [],
    iframe: undefined,
    breakpoints: getFormattedBreakpointArray(options.breakpoints)
  }

  function getFormattedBreakpointArray(breakpointArr) {
    return breakpointArr.map(currentBreakpoint => {
      let entry;
      if (Object.prototype.toString.call(currentBreakpoint) === '[object Object]') {
        if (!currentBreakpoint.width) return;

        entry = Object.assign({}, currentBreakpoint)
        entry['name'] = entry.name || entry.width;
        entry['height'] = entry.height || '';

        const isHeightRelativeToWidth = entry.height.startsWith('x')
        if (isHeightRelativeToWidth) {
          let multiple = entry.height.substr(1);
          entry.height = `calc(${entry.width} * ${multiple})`;
        }
      } else {
        entry = {
          name: currentBreakpoint,
          width: currentBreakpoint,
          height: ''
        };
      }
      return entry;
    });
  }

  function render(elem) {
    const parent = elem.parentNode;

    const alreadyWrapped = (typeof sandbox.iframe !== 'undefined')
    if (alreadyWrapped) return;

    let sandboxElem = document.createElement('div');
    sandboxElem.className = classNameBase;

    let sandboxHeader = document.createElement('ul');
    sandboxHeader.className = classNameBase + '-toolbar';
    sandboxHeader.setAttribute('role', 'toolbar');
    sandboxHeader = sandboxElem.appendChild(sandboxHeader);

    let sandboxBody = document.createElement('div');
    sandboxBody.className = classNameBase + '-body';
    sandboxBody = sandboxElem.appendChild(sandboxBody);

    sandboxElem = parent.insertBefore(sandboxElem, elem);
    sandboxBody.appendChild(elem);

    sandbox.iframe = wrapElement(elem);

    sandbox.controls = sandbox.breakpoints.map(breakpoint => {
      return sandboxHeader.appendChild(createControlForBreakpoint(breakpoint));
    });
    handleKeyboardNavigationBetweenElementFromCollection(sandboxHeader.children, { direction: 'horizontal' });

    pressControl(sandbox.controls
      .reduce((acc, curr) => {
        return curr;
      }));
  }

  function wrapElement(elem) {
    let iframe = iframify(elem, options);
    iframe.className = classNameBase + '-iframe';
    // iframe is resizable, so it must not be any transition when resizing
    iframe.addEventListener('mousedown', event => {
      event.target.style.transition = 'none';
    });
    ['mouseup', 'mouseout', 'mousemove'].forEach(eventName => iframe.addEventListener(eventName,
      function onIframeCSSResize(event) {
        updateControlsState(control => {
          return control.getAttribute(attrIframeResizedTo) === event.target.style.width;
        });
      }
    ));
    return iframe;
  }

  function resizeIframe(toBreakpoint) {
    sandbox.iframe.style.width = toBreakpoint.width;
    sandbox.iframe.style.height = toBreakpoint.height;
    sandbox.iframe.className = classNameBase + '-iframe ' + classNameBase + '-iframe--' + toBreakpoint.name;
    // Recover transition
    sandbox.iframe.style.transition = '';
  }

  function createControlForBreakpoint(breakpoint) {
    let control = document.createElement('li');
    control.className = classNameBase + '-control';
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '-1');
    control.innerHTML = breakpoint.name;
    control.setAttribute(attrIframeResizedTo, breakpoint.width);
    control.addEventListener('click', e => {
      e.preventDefault();
      pressControl(e.target, breakpoint);
    });
    return control;
  }

  function pressControl(controlElem, controlBreakpoint) {
    if (typeof controlBreakpoint === 'undefined') {
      controlBreakpoint = sandbox.breakpoints.reduce((acc, curr) => {
        return (curr.width === controlElem.getAttribute(attrIframeResizedTo)) ? curr : acc;
      });
    }
    resizeIframe(controlBreakpoint);
    updateControlsState(control => {
      return control.isEqualNode(controlElem);
    });
  }

  function updateControlsState(fnIsControlPressed) {
    sandbox.controls
      .map(control => {
        control.classList.remove(classNameStatePressed);
        control.setAttribute('aria-pressed', 'false');
        control.setAttribute('tabindex', '-1');
        return control;
      })
      .filter(fnIsControlPressed)
      .map(control => {
        control.classList.add(classNameStatePressed);
        control.setAttribute('aria-pressed', 'true');
        control.setAttribute('tabindex', '0');
        return control;
      });
  }

  render(elem);
}
