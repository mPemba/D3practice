import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/pics.js';

/*

THIS STUFF IS ALL FOR THE HELLO TEMPLATE, UN COMMENT IT OUT IN MAIN.js

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });



Welcome to HELL....





*/

Template.simpleLine.onCreated(function simpleLineOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);

  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

  // this line parses the time and makes it flexible as fuck.
  var parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  var valueline = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  var svg = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

  var dataDates = [
    // {date:"1-May-12",close:"48.13"},
    // {date:"30-Apr-12",close:"53.98"},
    // {date:"27-Apr-12",close:"67.00"},
    // {date:"26-Apr-12",close:"89.70"},
    // {date:"25-Apr-12",close:"99.00"}

    // example times
    {date:"23-May-12",close:"666"},
    {date:"26-May-12",close:"69"}
  ];

  var blastMeData = function(data) {


    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);
    // y.domain(d3.extent(data, function(d) { return d.close;}));

    svg.append("path")		// Add the valueline path.
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("g")			// Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")			// Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);

  }

  blastMeData(dataDates);

});


/*

THIS STUFF IS ALL FOR THE FEM LESSON.

WE'll be using data from reddit

*/

Template.circles.onCreated(function circlesOnCreated() {

  var margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = 860 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  var svg = d3.select('body')
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

  var data = redditData.data.children
    .sort(function( a,b ) {
      return a.data.score - b.data.score;
    })

  var maxScore = d3.max(data, function(d) { return d.data.score });

  var yScale = d3.scale.linear()
    .domain([0, maxScore])
    .range([400, 0])

  var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeBands([0, width])

  var line = d3.svg.line()
  .x(function(d,i) { return xScale(i) })
  .y(function(d,i) { return yScale(d.data.score) })

  var g = svg.append('g')
    .attr('transform', 'translate(50, 50)')

  g.append("path")
  .attr("d", line(data))
  .style({
    fill: "none",
    stroke: "#333"
  })

  var circles = g.selectAll('circle')
    .data(data)

  circles.enter()
    .append('circle')
    .attr({
      cx: function(d, i) { return xScale(i) },
      // cx: function(d, i) { return 49 + i * 25 },
      cy: function(d, i) { return yScale(d.data.score) },
      r: 6,
      fill:'#fff',
    })
    .style('stroke', '#333')
    .on('mouseover', function(d) {
      sendCircleResultsToView(d.data.score, this);
      d3.select(this).style("r", '10');

      if ( d.data.score <= 499 ) {
        d3.select(this).style('fill', '#73C1C6');
      }
      if ( d.data.score >= 500 && d.data.score <= 999 ) {
        d3.select(this).style('fill', '#449DD1');
      }
      if ( d.data.score >= 1000 && d.data.score <= 2499 ) {
        d3.select(this).style('fill', '#67597A');
      }
      if ( d.data.score >= 2500 && d.data.score <= 4999 ) {
        d3.select(this).style('fill', '#544E61');
      }
      if ( d.data.score >= 5000 ) {
        d3.select(this).style('fill', '#8C0017');
      }

    })
    .on('mouseout', function(d) {
      d3.select(this).style("fill", "#fff");
      d3.select(this).style("stroke", "#333");
      d3.select(this).style("r", "6");
    })

});

var sendCircleResultsToView = function(score, item) {
  $('.circleResultsContainer').empty();
  $('.circleResultsContainer').prepend('<span class="barChartDataText">' + ' - ' + score + ' - ' + '</span>')


}







Template.rectangles.onCreated(function rectanglesOnCreated() {

  // set the dimensions of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 860 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  // append the svg canvas
  var svg = d3.select('body')
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

  // get the data
  var data = redditData.data.children
    .sort(function(a, b) {
      return d3.ascending(a.data.score, b.data.score)
      // return a.data.score - b.data.score
    })

  // declare some helper variables
  var maxScore = d3.max(data, function(d) { return d.data.score });
  var chartHeight = 400;

  // set the ranges and order
  var yScale = d3.scale.linear()
    .domain([0, maxScore])
    .range([0, chartHeight])

  var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeBands([0, 666], 0.2)

  var yScaleLine = d3.scale.linear()
    .domain([0, maxScore])
    .range([chartHeight, 0])

  // define the axis
  var axis = d3.svg.axis()
    .scale( d3.scale.linear()
              .domain([maxScore, 0])
              .range([0, chartHeight])
            )
    .orient('left')

  // append the graph
  var g = svg.append('g')
    .attr('transform', 'translate(150, 11)')

  // set styles for the axes
  axis(g)
  g.selectAll('path')
    .style({ fill: 'none', stroke: '#333' })
  g.selectAll('line')
    .style({ stroke: '#333' })

  // bind the data
  var bars = g.selectAll('rect')
    .data(data)

  // scale the range of the line
  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i) })
    .y(function(d, i) { return yScaleLine(d.data.score) })
    // .interpolate('basis')
    .interpolate('cardinal')

  // draw the line
  g.append('path')
    .attr('d', line(data))
    .style({
      fill: 'none',
      stroke: '#333'
    })

  // enter will build the bars
  bars.enter()
      .append('rect')
      .attr({
          x: function(d, i) { return xScale(i) },
          y: function(d, i) { return chartHeight - yScale(d.data.score) },
          width: xScale.rangeBand(),
          height: function(d, i) { return yScale(d.data.score) },
          fill: '#fff',
          stroke: '#333'
      })
      .on('mouseover', function(d) {
        sendBarResultsToView(d.data.score);

        // depending on the score, the color will change
        if ( d.data.score <= 499 ) {
          d3.select(this).style('fill', '#73C1C6');
        }
        if ( d.data.score >= 500 && d.data.score <= 999 ) {
          d3.select(this).style('fill', '#449DD1');
        }
        if ( d.data.score >= 1000 && d.data.score <= 2499 ) {
          d3.select(this).style('fill', '#67597A');
        }
        if ( d.data.score >= 2500 && d.data.score <= 4999 ) {
          d3.select(this).style('fill', '#544E61');
        }
        if ( d.data.score >= 5000 ) {
          d3.select(this).style('fill', '#8C0017');
        }

      })
      .on('mouseout', function(d) {
        d3.select(this).style('fill', '#fff');
      })

});

var sendBarResultsToView = function(score) {
  $('.barResultsContainer').empty();
  $('.barResultsContainer').prepend('<span class="barChartDataText">' + ' - ' + score + ' - ' + '</span>')
}




Template.brushExample.onCreated(function buildBrushExample() {

  // set the dimensions of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 860 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  // append the svg canvas
  var svg = d3.select('body')
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

  // get the data
  var data = redditData.data.children;

  // format timestamps from seconds to milliseconds
  data.forEach(function(d) {
    d.data.created *= 1000
  })

  // return the range of posts w/ extent method
  var extent = d3.extent(data, function(d) {
    return d.data.created
  })

  // set the range
  var scale = d3.time.scale()
  .domain( extent )
  .range([10, 463])

  var brush = d3.svg.brush()
  brush.x(scale)
  // brush.extent([22, 28])

  // append the graph
  var g = svg.append("g")
  var chartHeight = 30;

  // render and style the brush
  brush(g)
  g.attr("transform", "translate(100  , 100)")
  g.selectAll("rect").attr("height", chartHeight)
  g.selectAll(".background")
    .style({fill: "#d0d2d3", visibility: "visible"})
  g.selectAll(".extent")
    .style({fill: "#474345", visibility: "visible"})
  g.selectAll(".resize rect")
    .style({fill: "#276C86", visibility: "visible"})

  // render rectangles on top of the brush
  var rects = g.selectAll('rect.events')
  .data(data)
  rects.enter()
  .append('rect').classed('events', true) // true adds class, false removes class
  rects.attr({
    x: function(d) { return scale(d.data.created) },
    y: 0,
    width: 1,
    height: chartHeight
  })
  .style('pointer-events', 'none');

  // filter the data to what is inside the extent and light up the ones that match
  brush.on('brushend', function() {

    // get extent
    var ext = brush.extent()

    // filter will return true or false for every element in the array
    // if it returns true it gets put in this new array, and skipped if false
    var filtered = data.filter(function(d) {

      // the extent is an array with a min and max timestamp so get us everything inbetween
      return ( d.data.created > ext[0] && d.data.created < ext[1] )
    });

    // log to console
    console.log(brush.extent());

    // remove all styling
    g.selectAll('rect.events')
    .style({ stroke: '' });

    // highlight rectangles
    g.selectAll('rect.events')

    // return the id / key to make sure we highlight correct data
    .data(filtered, function(d) { return d.data.id })
    .style({
      stroke: '#fff'
    })

  });


});
