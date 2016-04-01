<template>
  <div style="position:relative">
    <div class="sunburst">
      <div class="div0"></div>
      <div class="div1"></div>
    </div>
  </div>
</template>
<script>
  var d3 = require('d3');
  module.exports = {
    ready: function () {
      /*basic variable*/
      var width = 400,
        height = 700,
        radius = Math.min(width, height) / 2;
      var node,g;
      var x = d3.scale.linear()
        .range([0, Math.PI * 2]);
      var y = d3.scale.linear()
        .range([0, radius]);
      var color = d3.scale.category20c();
      /*defining partition*/
      var partition = d3.layout.partition()
        .sort(null)
        .value(function(d) { return 1; });
      /*defining arc*/
      var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(Math.PI * 2, x(d.x)))} )
        .endAngle(function(d) { return Math.max(0, Math.min(Math.PI * 2, x(d.x + d.dx)))} )
        .innerRadius(function(d) { return Math.min(radius , y(d.y)) })
        .outerRadius(function(d) { return Math.min(radius , y(d.y + d.dy)) });
      function stash(d) {
        d.x0 = d.x;
        d.dx0 = d.dx;
      }
      function arcTweenZ(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]);
        var yd = d3.interpolate(y.domain(), [d.y, 1]);
        var yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
          return i
            ? function() {return arc(d)}
            : function(t) {x.domain(xd(t)), y.domain(yd(t)), y.range(yr(t)); return arc(d);}
        }
      }
      function built(){
        var path = g.append('path')
          .attr('d', arc)
          .style('fill', function(d) { return color((d.children ? d : d.parent).name);})
          .each(stash)
          .on("mouseover",function(d){
            $(this).next().show();
            d3.select(this)
              .style('fill', 'yellow')
          })
          .on("mouseout",function(d){
            $(this).next().hide();
            d3.select(this)
              .style('fill', function(d) { return color((d.children ? d : d.parent).name);})
          })
          .on('click', click);
        /*adding element*/
        g.append('text')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .style('text-shadow', '1px 1px #fff')
          .attr("text-anchor","middle")
          .text(function (d) {return d.name;})
          .attr('display', 'none');
        function click(d) {
          node = d;
          path.transition()
            .duration(1000)
            .attrTween('d', arcTweenZ(d));
        }
      }
      /*automatic*/
      var svg = d3.select('div.sunburst div.div0').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate('+ width / 2 +', '+ (height / 2 + 10) +')');
      d3.json(require('file!./json/flare2.json'), function(error, root) {
        node = root;
        g = svg.datum(root).selectAll('g')
          .data(partition.nodes)
          .enter().append('g');
        built();
      })
      var svg1 = d3.select('div.sunburst div.div1').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate('+ width / 2 +', '+ (height / 2 + 10) +')');
      d3.json(require('file!./json/flare1.json'), function(error, root) {
        node = root;
        g = svg1.datum(root).selectAll('g')
          .data(partition.nodes)
          .enter().append('g');
        built();
      })
    }
  }
</script>
