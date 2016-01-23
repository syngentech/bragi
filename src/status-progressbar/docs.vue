<template lang="jade">
h1 Status Progressbar

h2 自动加载远端 JSON
section.am-g
  .am-u-md-9.am-u-sm-centered {{{ underway }}}
  .am-u-sm-12
    pre.am-pre-scrollable {{ underway }}

h2 手动加载远端 JSON
section.am-g
  .am-u-md-6.am-u-sm-centered
    ul#status-progressbar-failed
  .am-u-sm-12
    pre.am-pre-scrollable {{ failed }}

h2 手动加载给定 JSON
section.am-g
  .am-u-md-9.am-u-sm-centered
    ul#status-progressbar-success
  .am-u-sm-12
    pre.am-pre-scrollable {{ success }}
</template>

<script>
require('./');
export default {
  data: function() {
    return {
      underway: '<ul data-am-status-progressbar=\'' + JSON.stringify({ 'dataUrl': require('file!./json/underway.json') }) +'\'></ul>',
      failed:
`<ul id="status-progressbar-failed"></ul>

<script>
$('ul#status-progressbar-failed').StatusProgressbar({ dataUrl: require('file!./json/failed.json') });
<\/script>`,
      success:
`<ul id="status-progressbar-success"></ul>

<script>
$('ul#status-progressbar-success').StatusProgressbar({ dataJson:`+ JSON.stringify(require('json!./json/success.json'), null, 2) + `});
<\/script>`
    };
  },
  attached: function() {
    $('ul#status-progressbar-failed').StatusProgressbar({ dataUrl: require('file!./json/failed.json') });
    $('ul#status-progressbar-success').StatusProgressbar({ dataJson: require('json!./json/success.json') });
  }
}
</script>
