import iframify from './iframify';
const classNameBase = 'psg-ResponsiveSample';
const classNameStateSelected = 'is-selected';
const attrIframeResizedTo = 'data-resize-iframe-to';

export default class ResponsiveSandbox {
  constructor(elem, breakpoints, styles = 'body { margin: 0; padding: 0; }') {
    const self = this;
    this.firstTab;
    this.selectedTab;
    this.breakpoints = ResponsiveSandbox.parseBreakpointsToMap(breakpoints);
    this.styles = styles;

    this.wrapBaseElement(elem);
    this.iframe = iframify(elem, { styles: styles });
    this.iframe.className = classNameBase + '-iframe';

    // iframe is resizable, so it must not be any transition when resizing
    this.iframe.addEventListener('mousedown', function (e) {
      e.target.style.transition = 'none';
    });

    ['mouseup', 'mouseout', 'mousemove'].forEach(e => this.iframe.addEventListener(e,
      function onIframeCSSResize(e) {
        let tab = self.firstTab;
        do {
          if (tab.getAttribute(attrIframeResizedTo) === e.target.style.width) {
            tab.classList.add(classNameStateSelected);
            self.selectedTab = tab;
          } else {
            tab.classList.remove(classNameStateSelected);
          }
        } while (tab = tab.nextSibling);
      }
    ));
  }

  static parseBreakpointsToMap(breakpoints) {
    const resultantMap = new Map();
    breakpoints.forEach(brk => {
      if (Object.prototype.toString.call(brk) === '[object Object]') {
        if (!brk.width) return;
        brk['name'] = brk.name || brk.width;
        brk['height'] = brk.height || '';
        if (brk.height.startsWith('x')) {
          let multiple = brk.height.substr(1);
          brk.height = `calc(${brk.width} * ${multiple})`;
        }
        resultantMap.set(brk.width, brk);
      } else {
        resultantMap.set(brk, {
          name: brk,
          width: brk,
          height: ''
        });
      }
    });
    return resultantMap;
  }

  resizeIframe() {
    const resizeIframeToBreakpoint = this.selectedTab.getAttribute(attrIframeResizedTo);

    this.iframe.style.width = resizeIframeToBreakpoint;
    this.iframe.style.height = this.breakpoints.get(resizeIframeToBreakpoint).height;

    // Recover transition
    this.iframe.style.transition = '';
  }

  switchToTab(tabElem) {
    this.selectedTab = tabElem;
    this.resizeIframe();

    let tab = this.selectedTab.parentNode.firstChild;
    do {
      if (this.selectedTab.isEqualNode(tab)) {
        tab.classList.add(classNameStateSelected);
      } else {
        tab.classList.remove(classNameStateSelected);
      }
    } while (tab = tab.nextSibling);
  }

  wrapBaseElement(elem) {
    const alreadyWrapped = (typeof this.iframe !== 'undefined')
    if (alreadyWrapped) return;

    const self = this;
    const parent = elem.parentNode;

    let sandboxBody = document.createElement('div');
    sandboxBody.className = classNameBase + '-body';

    let sandboxHeader = document.createElement('div');
    sandboxHeader.className = classNameBase + '-header';

    let firstTab;
    let lastTab;
    this.breakpoints.forEach((value, key) => {
      let tab = document.createElement('a');
      tab.className = classNameBase + '-tab';
      tab.innerHTML = value.name;
      tab.setAttribute(attrIframeResizedTo, key);
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        self.switchToTab.call(self, e.target);
      });
      sandboxHeader.appendChild(tab);

      firstTab = firstTab || tab;
      lastTab = tab;
    });
    this.firstTab = firstTab;
    this.selectedTab = lastTab;
    this.selectedTab.classList.add(classNameStateSelected);

    sandboxBody = parent.insertBefore(sandboxBody, elem);
    sandboxHeader = parent.insertBefore(sandboxHeader, sandboxBody);

    sandboxBody.appendChild(elem);
  }
}
