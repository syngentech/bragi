import $ from 'jquery'
import d3 from 'd3'

if (window) {
  window.$ = $
  window.d3 = d3

  window.$.AMUI = require('./amazeui')
  window.$.AMUI.VERSION = require('../vendor/amazeui/package.json').version
}

import './plasmid'
import './status-progressbar'
// import './sunburst'
