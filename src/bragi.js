/*
  Bragi Bundle
*/

if (window) {
  window.$ = window.jQuery = require('jquery')
  window.d3 = require('d3')

  window.$.AMUI = require('./amazeui')
  window.$.AMUI.VERSION = require('../vendor/amazeui/package.json').version
}

require('./plasmid')
require('./status-progressbar')
// require('./sunburst');
