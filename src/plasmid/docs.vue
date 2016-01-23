<template lang="jade">
h1 Plasmid

.am-g
  .am-u-sm-12
    h3 选择文件
    select(v-model= "selected")
      option(v-for="(k, v) in gbff", :value="v") {{ k }}
.am-g.am-margin-top
  .am-u-sm-6
    h3 绘制图谱
    span#plasmid.plasmid
  .am-u-sm-6
    h3 解析结果
    pre.am-pre-scrollable {{ pre.parser }}
    pre.am-pre-scrollable {{ parsed | json }}
</template>

<script>
require('./');

export default {
  data: function() {
    return {
      gbff: {
        pB002: require('file!./gbff/pB002.gb'),
        pB039_F: require('file!./gbff/pB039_F.gb'),
        pB039: require('file!./gbff/pB039.gb'),
        pHCKanP: require('file!./gbff/pHCKanP.gb'),
        pY001: require('file!./gbff/pY001.gb'),
        pY108: require('file!./gbff/pY108.gb'),
        pY122: require('file!./gbff/pY122.gb'),
        pY157: require('file!./gbff/pY157.gb'),
        pY178: require('file!./gbff/pY178.gb'),
        pYB006: require('file!./gbff/pYB006.gb'),
        pZ531: require('file!./gbff/pZ531.gb')
      },
      selected: null,
      selected_data: null,
      pre: {
        parser:
`$.ajax({ url: GBFF_URL }).done(function(data) { console.log($.Plasmid.parse(data)); })`
      }
    };
  },
  computed: {
    parsed: function() {
      return this.selected_data ? $.Plasmid.parse(this.selected_data) : '';
    }
  },
  watch: {
   selected: function(val) {
     var self = this;
     if (val) {
       $.ajax({ url: val }).done(function(data) { self.selected_data = data; })
       $('#plasmid').Plasmid({ 'gbff-url': val });
     } else {
        self.selected_data = null;
     }
   },
 },
 attached: function() {
   $('#plasmid').Plasmid({"outerSize":400, "gbff-url": this.selected});
 }
}
</script>
