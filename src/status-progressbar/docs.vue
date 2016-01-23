<template lang="jade">
h1 Status Progressbar

h2 使用方式
h3 加载远端 JSON
pre.am-pre-scrollable {{ byurl }}
h3 加载给定 JSON
pre.am-pre-scrollable {{ byjson }}

h2 更多用例
h3 Underway
.am-g
  .am-u-md-9.am-u-sm-centered
    ul#status-progressbar-underway
  .am-u-sm-12
    pre {{ underway | json }}
h3 Failed
.am-g
  .am-u-md-6.am-u-sm-centered
    ul#status-progressbar-failed
  .am-u-sm-12
    pre {{ failed | json }}
h3 Success
.am-g
  .am-u-md-9.am-u-sm-centered
    ul#status-progressbar-success
  .am-u-sm-12
    pre {{ success | json }}
</template>

<script>
require('./');
export default {
  data: function() {
    return {
      byurl:
`<ul id="status-progressbar"></ul>

<script>
$('ul#status-progressbar').StatusProgressbar({ dataUrl: JSON_URL });
<\/script>`,
      byjson:
`<ul id="status-progressbar"></ul>

<script>
$('ul#status-progressbar').StatusProgressbar({ dataJson: JSON_STR });
<\/script>`,
      underway: require('json!./json/underway.json'),
      failed: require('json!./json/failed.json'),
      success: require('json!./json/success.json')
    };
  },
  attached: function() {
    $('ul#status-progressbar-underway').StatusProgressbar({ dataJson: this.underway });
    $('ul#status-progressbar-failed').StatusProgressbar({ dataJson: this.failed });
    $('ul#status-progressbar-success').StatusProgressbar({ dataJson: this.success });
  }
}
</script>
