// @TODO: YOUR CODE HERE!
// D3 Journalism Data

// Setting up Chart Parameters/Dimensions
var svgWidth = 960;
var svgHeight = 500;

// SVG Margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Define dimensions of the Chart Area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift latter by left and top margins
var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG Grouup
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

