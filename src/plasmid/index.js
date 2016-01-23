require('./style.scss');

var d3 = require('d3');

(function($) {
  // Extend jQuery
  $.Plasmid = {
    parse: function(text) {
      var gbff = {};

      var lines = text.replace(/\r\n/g, '\n').split('\n');
      for (var lineno = 0; lineno < lines.length; lineno++) {
        var line = lines[lineno];
        var match;

        match = /^LOCUS\s+([^\n]+)/.exec(line);
        if (match) {
          match = match[1].split(/\s+/);
          gbff.name = match.shift();
          gbff.length = match.shift();
          gbff.modifed_at = match.pop();
        }
        else if (/^SOURCE/.test(line)) {
          gbff.source = {};
          line = lines[lineno + 1];
          while (/^\s/.test(line)) {
            lineno++;
            match = /^\s+(\w+)\s+([^\n]+)/.exec(line);
            if(match) gbff.source[match[1].toLowerCase()] = match[2].split(/;\s*/);
            line = lines[lineno + 1];
          }
        }
        else if (/^FEATURES/.test(line)) {
          gbff.features = [];
          line = lines[lineno + 1];
          while (/^\s/.test(line)) {
            lineno++;
            match = /^\s+(\S+)\s+(\S+)/.exec(line);
            feature = { key: match[1], location: match[2], qualifier: {} };
            line = lines[lineno + 1];
            while(/^\s+\//.test(line)) {
              lineno++;

              var str = line.replace(/^\s+\//, '');
              match = /^([^=]+)=(\d+)$/.exec(str); // for integer values
              if (match === null) {
                // If multiple lines
                while(!/"$/.test(str)) {
                  lineno++;
                  if (lineno >= lines.length) return null;
                  str += lines[lineno].replace(/^\s+/, '');
                }

                match = /^([^=]+)="(.+)"$/.exec(str); // for string values
                if (match === null) return null;
              }

              feature.qualifier[match[1]] = match[2].replace(/""/g, '');
              line = lines[lineno + 1];
             }
            gbff.features.push(feature);
            line = lines[lineno + 1];
          }
        }
        else if (/^ORIGIN/.test(line)) {
          gbff.origin = lines.slice(lineno + 1, -2).join('').replace(/[\s\d]/g, '');
          break;
        }
        else {
          match = /^(\w+)\s+([^\n]+)/.exec(line);
          if (match) {
            match[1] = match[1].toLowerCase();
            gbff[match[1]] = match[2];

            // If multiple lines
            line = lines[lineno + 1];
            while (/^\s/.test(line)) {
              lineno++;
              if (lineno >= lines.length) return null;
              gbff[match[1]] += ' ' + line.replace(/^\s+/, '');
              line = lines[lineno + 1];
            }

            gbff[match[1]] = gbff[match[1]].replace(/\s+/g, ' ');
          }
        }
      }

      return gbff;
    }
  };

  // Extend jQuery object
  $.fn.Plasmid = function(options) {

    // Get options
    var opts = $.extend({}, $.fn.Plasmid.defaults, options);

    // Get gbff by AJAX
    if (opts['gbff-url']) $.ajax({ url: opts['gbff-url'] }).done(function(data) {
      opts.gbff = $.Plasmid.parse(data);
      render.bind(this)(opts);
    }.bind(this));

    // Render SVG
    render.bind(this)(opts);
  };

  // Default options
  $.fn.Plasmid.defaults = {
    outerSize: 375,
    innerSize: 375,
    scale: 1,
    rotate: -90,
    innerRadius: 115,
    outerRadius: 140,
    text_magin: 20,
    small_interval_angle: 5,
    large_interval_angle: 30,
  };

  // Render the plasmid based on opts
  function render(opts) {
    var svg, g;
    var title, ticks, tickTexts;
    var color = d3.scale.category10();

    // Clear
    $(this).html('');

    // Reset id
    opts.id = Math.ceil(Math.pow(10, 8) + 9 * Math.pow(10, 8) * Math.random());

    // Initialize
    svg = d3.select(this[0])
      .append('svg')
        .attr('width', opts.outerSize)
        .attr('height', opts.outerSize)
        .attr('viewBox', '0 0 ' + opts.innerSize + ' ' + opts.innerSize)
      .append('g').datum(opts)
        .attr('transform', svgTransform);

    // Scales
    g = svg.append('g');
    g.append('path')
      .attr('fill', '#eee')
      .attr('fill-rule', 'evenodd')
      .attr('d', d3.svg.arc()
        .innerRadius(0)
        .outerRadius(opts.outerRadius)
        .startAngle(0)
        .endAngle(Math.PI * 2)
      );
    g.append('path')
      .attr('fill', '#fff')
      .attr('fill-rule', 'evenodd')
      .attr('d', d3.svg.arc()
        .innerRadius(0)
        .outerRadius(opts.innerRadius)
        .startAngle(0)
        .endAngle(Math.PI * 2)
      );
    g.append('path')
      .attr('fill', '#ccc')
      .attr('fill-rule', 'evenodd')
      .attr('d', d3.svg.arc()
        .innerRadius((opts.outerRadius + opts.innerRadius)/2 - 2.5)
        .outerRadius((opts.outerRadius + opts.innerRadius)/2 + 2.5)
        .startAngle(0)
        .endAngle(Math.PI * 2)
      );

    // Draw empty plasmid if no gbff
    if (opts.gbff === undefined) return;

    // Plasmid title
    title = g = svg.append('g').attr('transform', titleTransform);
    g.append('text').text(opts.gbff.name).classed('title', true);
    g.append('text').text(opts.gbff.length + ' bp').attr('y', opts.text_magin);

    // Ticks
    ticks = g = svg.append('g')
      .selectAll('g').data(d3.range(0, 359, opts.small_interval_angle))
      .enter().append('g')
        .attr('transform', ticksTransform);
    tickTexts = g.filter(function(d) { return d % opts.large_interval_angle === 0; })
      .append('text')
        .attr('fill', '#999')
        .attr('transform', tickTextsTransform)
        .text(function(d) { return Math.floor(opts.gbff.length / 360 * d); });
    g.filter(function(d) { return d % opts.large_interval_angle === 0; })
      .append('line')
        .attr('x1', opts.text_magin - 4).attr('y1', 0)
        .attr('x2', opts.text_magin - 1).attr('y2', 0)
        .attr('stroke', '#f00');
    g.filter(function(d) { return d % opts.large_interval_angle !== 0; })
      .append('line')
      .attr('x1', opts.text_magin - 4).attr('y1', 0)
      .attr('x2', opts.text_magin - 1).attr('y2', 0)
      .attr('stroke', '#999');
    g.append('line')
      .attr('x1', opts.outerRadius - opts.innerRadius + opts.text_magin + 1).attr('y1', 0)
      .attr('x2', opts.outerRadius - opts.innerRadius + opts.text_magin + 4).attr('y2', 0)
      .attr('stroke', '#999');

    // Prepare features
    opts.gbff.features.forEach(function(d) {
      var match = /(\d+)\.\.(\d+)/.exec(d.location.replace(/[<>]/g, ''));
      if (match) {
        if (/^complement/.test(d.location)) {
          d.loc = { start: Number(match[2]), end: Number(match[1]) };
          d.loc.length = d.loc.start - d.loc.end + 1;
        } else {
          d.loc = { start: Number(match[1]), end: Number(match[2]) };
          if (d.loc.start > d.loc.end) d.loc.end += Number(opts.gbff.length);
          d.loc.length = d.loc.end - d.loc.start + 1;
        }
        d.loc.startAngle = d.loc.start / opts.gbff.length * 360;
        d.loc.endAngle = d.loc.end / opts.gbff.length * 360;
        d.loc.angle = d.loc.length / opts.gbff.length * 360;

        // // Hide features longer than 180 degrees
        // if (d.loc.angle > 180) d.loc = null;

        // For compatibility
        if (d.qualifier.label === undefined && d.qualifier.note !== undefined) {
          d.qualifier.label = d.qualifier.note;
        }
      } else {
        d.loc = null;
      }
    });

    // Features
    g = svg.append('g')
      .selectAll('g').data(opts.gbff.features.filter(function(d) {
        return d.loc !== null && d.qualifier.label !== undefined;
      }))
      .enter().append('g');

    // Large features
    g.filter(function(d) { return d.loc.angle > 8; }).append('path')
      .style('fill', function(d) { return color(d.key); })
      .attr('d', function(d) {
        if (d.loc.endAngle > d.loc.startAngle) {
          return 'M' + polar2orth(opts.innerRadius, d.loc.endAngle - 4) +
            ' A ' + opts.innerRadius + ',' + opts.innerRadius + ' 0,0,0 ' +
              polar2orth(opts.innerRadius, d.loc.startAngle) +
            ' L ' + polar2orth((opts.innerRadius + opts.outerRadius) / 2, d.loc.startAngle + 4) +
            ' L ' + polar2orth(opts.outerRadius, d.loc.startAngle) +
            ' A ' + opts.outerRadius + ',' + opts.outerRadius + ' 0,0,1 ' +
              polar2orth(opts.outerRadius, d.loc.endAngle - 4) +
            ' L ' + polar2orth((opts.innerRadius + opts.outerRadius) / 2, d.loc.endAngle);
        } else {
          return 'M' + polar2orth(opts.innerRadius, d.loc.endAngle + 4) +
            ' A ' + opts.innerRadius + ',' + opts.innerRadius + ' 0,0,1 ' +
              polar2orth(opts.innerRadius, d.loc.startAngle) +
            ' L ' + polar2orth((opts.innerRadius + opts.outerRadius) / 2, d.loc.startAngle - 4) +
            ' L ' + polar2orth(opts.outerRadius, d.loc.startAngle) +
            ' A ' + opts.outerRadius + ',' + opts.outerRadius + ' 0,0,0 ' +
              polar2orth(opts.outerRadius, d.loc.endAngle + 4) +
            ' L ' + polar2orth((opts.innerRadius + opts.outerRadius) / 2, d.loc.endAngle);
        }
      })
      .on('mouseover', featureOnMouseover)
      .on('mouseout', featureOnMouseout);

    // Medium features
    g.filter(function(d) { return d.loc.angle < 8 && d.loc.angle > 4; }).append('path')
      .style('fill', function(d) { return color(d.key); })
      .attr('d', function(d) {
        return 'M' + polar2orth(opts.innerRadius, d.loc.startAngle) +
          ' L ' + polar2orth(opts.outerRadius, d.loc.startAngle) +
          ' L ' + polar2orth((opts.innerRadius + opts.outerRadius) / 2, d.loc.endAngle);
      })
      .on('mouseover', featureOnMouseover)
      .on('mouseout', featureOnMouseout);

    // Small features
    g.filter(function(d) { return d.loc.angle < 4;}).append('line')
      .attr('transform', function(d) { return 'rotate(' + ((d.loc.startAngle + d.loc.endAngle) / 2) + ')'; })
      .attr('x1', opts.innerRadius).attr('y1', 0)
      .attr('x2', opts.outerRadius + opts.text_magin).attr('y2', 0)
      .attr('stroke', '#999')
      .on('mouseover', featureOnMouseover)
      .on('mouseout', featureOnMouseout);

    // Feature labels
    g.append('text').append('textPath')
      .attr('xlink:href', function(d) { return '#labelpath_' + opts.id + '_' + d.key + '_' + Math.floor((d.loc.startAngle + d.loc.endAngle) / 2); })
      .attr('startOffset', '50%')
      .text(function(d) { return d.qualifier.label; });
    g.append('defs').append('path')
      .attr('id', function(d) { return 'labelpath_' + opts.id + '_' + d.key + '_' + Math.floor((d.loc.startAngle + d.loc.endAngle) / 2); })
      .attr('d', function(d) {
        var radius;
        if (d.loc.angle > 8) {
          radius = (opts.innerRadius + opts.outerRadius) / 2;
        } else if (d.loc.angle > 4) {
          radius = opts.outerRadius + 15;
        } else {
          radius = opts.outerRadius + opts.text_magin + 15;
        }
        return 'M ' + polar2orth(radius, (d.loc.startAngle + d.loc.endAngle) / 2 + opts.rotate) +
          ' A ' + radius + ',' + radius + ' 0,0,1 ' +
          polar2orth(radius, (d.loc.startAngle + d.loc.endAngle) / 2 - opts.rotate);
      });

    d3.select(this)
      .call(d3.behavior.drag()
        .on('drag', function() {
          opts.rotate += d3.event.dx / opts.scale;
          svg.attr('transform', svgTransform);
          title.attr('transform', titleTransform);
          ticks.attr('transform', ticksTransform);
          tickTexts.attr('transform', tickTextsTransform);
        })
      )
      .call(d3.behavior.zoom()
        .scaleExtent([1, 4])
        .on('zoom', function() {
          opts.scale = d3.event.scale;
          svg.transition().duration(500).attr('transform', svgTransform);
        })
      );

    function polar2orth(radius, theta) {
      return radius * Math.cos(theta / 180 * Math.PI) + ',' + radius * Math.sin(theta / 180 * Math.PI);
    }

    function svgTransform(d) {
      return 'translate(' + d.innerSize/2 + ', '+ d.innerSize/2 * d.scale + ')scale('+ d.scale +')rotate(' + d.rotate + ')';
    }

    function titleTransform() {
      return 'rotate(' + (-opts.rotate) + ')';
    }

    function ticksTransform(d) {
      return 'rotate(' + (d) + ')translate(' + (opts.innerRadius - opts.text_magin) + ',0)';
    }

    function tickTextsTransform(d) {
      return 'rotate(' + (- opts.rotate - d) + ')';
    }

    function featureOnMouseover(d) {
      d3.select(this).style('fill', d3.rgb(color(d.key)).brighter());
    }

    function featureOnMouseout(d) {
      d3.select(this).style('fill', color(d.key));
    }
  }

})(require('jquery'));
