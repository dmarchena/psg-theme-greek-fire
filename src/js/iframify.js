const styleCache = {};

function defaultOptions() {
  const metas = {
    charset: document.querySelector('meta[charset]')
  }
  return {
    charset: metas.charset && metas.charset.outerHTML || undefined
  }
}

function buildOptions(options) {
  const defaultOpts = defaultOptions();
  options['charset'] = options.charset || defaultOpts.charset;
  options['style'] = (typeof options.style === 'string') ? ('<style>' + options.style + '<\/style>') : '';
  options['styleSelector'] = options.styleSelector || 'style';
  return options;
}

function outerHeightWithMargin(el) {
  var height = el.offsetHeight;
  var style = window.getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height + 20;
}

export default function(elem, options) {
  options = buildOptions(options);

  if (typeof styleCache[options.styleSelector] === 'undefined') {
    styleCache[options.styleSelector] = [].map.call(
      document.querySelectorAll(options.styleSelector),
      (style) => {
        return style.outerHTML;
      });
  }

  let iframeContent =
    '<head>' +
      options.style +
      styleCache[options.styleSelector] +
    '<\/head>' +
    '<body>' +
      elem.innerHTML +
    '<\/body>';

  const iframe = document.createElement('iframe');
  iframe.height = outerHeightWithMargin(elem);
  iframe.width = '100%';
  iframe.id = elem.id;
  iframe.className = elem.className;

  elem.parentNode.replaceChild(iframe, elem);

  const iframeDocument = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(iframeContent);
  iframeDocument.close();

  return iframe;
}

