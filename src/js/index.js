import 'babel-polyfill';
import ready from './ready';
import responsiveSandbox from './responsive-sandbox';

// const breakpoints = ['480px', '768px', '1024px'];
const options = {
  breakpoints: [
    {
      'name': 'mobile',
      'width': '375px',
      'height': '667px'
    },
    {
      'name': 'mobile (landscape)',
      'width': '667px',
      'height': '375px'
    },
    {
      'name': 'tablet',
      'width': '768px',
      'height': '1024px'
    },
    {
      'name': 'tablet (landscape)',
      'width': '1024px',
      'height': '768px'
    },
    {
      'name': '1200px',
      'width': '1200px',
      'height': '514px'
    },
    {
      'name': '1440px',
      'width': '1440px',
      'height': '617px'
    },
    {
      'name': 'auto',
      'width': '100%'
    }
  ],
  style: 'html, body { margin: 0; padding: 0; }',
  styleSelector: '#processedcss',
}
ready(() => {
  [].slice.call(document.querySelectorAll('.psg-device-test')).map(sample => {
    let opts = options;
    if (sample.getAttribute('data-style') !== null) {
      opts = Object.assign({}, opts, { style: sample.getAttribute('data-style') });
    }
    return responsiveSandbox(sample, opts);
  });
});
