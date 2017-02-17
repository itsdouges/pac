import jsdom from 'jsdom';

global.document = jsdom.jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

function noop() {
  return {};
}

require.extensions['.css'] = noop;
require.extensions['.png'] = noop;

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = require('chai').expect;
global.AssertionError = require('chai').AssertionError;

global.chai.should();
global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-enzyme')());
