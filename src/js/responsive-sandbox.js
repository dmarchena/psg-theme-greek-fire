import iframify from './iframify';

const classNameBase = 'psg-ResponsiveSample';
const classNameStateSelected = 'is-selected';
const attrIframeResizedTo = 'data-resize-iframe-to';


export default function responsiveSandbox(elem, options) {
  const defaults = {
    breakpoints: ['480px', '768px', '1024px']
  };

  options = Object.assign({}, defaults, options);

  const sandbox = {
    tabs: [],
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

    let sandboxHeader = document.createElement('div');
    sandboxHeader.className = classNameBase + '-header';
    sandboxHeader = sandboxElem.appendChild(sandboxHeader);

    let sandboxBody = document.createElement('div');
    sandboxBody.className = classNameBase + '-body';
    sandboxBody = sandboxElem.appendChild(sandboxBody);

    sandboxElem = parent.insertBefore(sandboxElem, elem);
    sandboxBody.appendChild(elem);

    sandbox.iframe = wrapElement(elem);

    sandbox.tabs = sandbox.breakpoints.map(breakpoint => {
      return sandboxHeader.appendChild(createTabElementForBreakpoint(breakpoint));
    });

    switchToTab(sandbox.tabs
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
        updateTabsState(tab => {
          return tab.getAttribute(attrIframeResizedTo) === event.target.style.width;
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

  function createTabElementForBreakpoint(breakpoint) {
    let tab = document.createElement('a');
    tab.className = classNameBase + '-tab';
    tab.innerHTML = breakpoint.name;
    tab.setAttribute(attrIframeResizedTo, breakpoint.width);
    tab.addEventListener('click', e => {
      e.preventDefault();
      switchToTab(e.target, breakpoint);
    });
    return tab;
  }

  function switchToTab(tabElem, tabBreakpoint) {
    if (typeof tabBreakpoint === 'undefined') {
      tabBreakpoint = sandbox.breakpoints.reduce((acc, curr) => {
        return (curr.width === tabElem.getAttribute(attrIframeResizedTo)) ? curr : acc;
      });
    }
    resizeIframe(tabBreakpoint);
    updateTabsState(tab => {
      return tab.isEqualNode(tabElem);
    })
  }

  function updateTabsState(fnIsTabSelected) {
    sandbox.tabs
      .map(tab => {
        tab.classList.remove(classNameStateSelected);
        return tab;
      })
      .filter(fnIsTabSelected)
      .map(tab => {
        tab.classList.add(classNameStateSelected);
        return tab;
      });
  }

  render(elem);
}
