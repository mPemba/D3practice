import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/pics.js';

/*

THIS STUFF IS ALL FOR THE HELLO TEMPLATE, UN COMMENT IT OUT IN MAIN.js

*/

Template.hello.onCreated(function helloOnCreated() {
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
    {date:"1-May-12",close:"48.13"},
    {date:"30-Apr-12",close:"53.98"},
    {date:"27-Apr-12",close:"67.00"},
    {date:"26-Apr-12",close:"89.70"},
    {date:"25-Apr-12",close:"99.00"}

    // example times
    // {date:"23-May-12",close:"666"},
    // {date:"26-May-14",close:"69"}
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

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);

  },
});




/*

THIS STUFF IS ALL FOR THE FEM LESSON.

WE'll be using data from reddit

*/

Template.circles.onCreated(function circlesOnCreated() {

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 800 - margin.left - margin.right,
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

  var g = svg.append('g')
    .attr('transform', 'translate(5, 5)')

  var circles = g.selectAll('circle')
    .data(data)

  circles.enter()
    .append('circle')
    .attr({
      cx: function(d, i) { return 49 + i * 25 },
      cy: function(d, i) { return yScale(d.data.score) },
      r: 6,
      fill:'#333'
    })
    .on('mouseover', function(d) {
      console.log(d.data.score);
    })




});









Template.rectangles.onCreated(function rectOnCreated() {

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 800 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  var svg = d3.select('#mikesRectangles')
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)




});
