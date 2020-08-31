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
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG Grouup
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// The function used for updating x-scale and y-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis] - 1), d3.max(data, d => d[chosenXAxis])])
        .range([0, width]);
    return xLinearScale;
};

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[chosenYAxis])])
        .range([height, 0]);
    return yLinearScale;
};

// Function for updating x-axis upon click on axis label
function renderXAxis(newXscale, xAxis) {
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

// Function for updating y-axis upon click on axis label
function renderYaxis(newYScale, yAxis) {
    var leftAxis = d3.axisleft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
};

// Function used for updating circle group with transition to new circles
fnction renderCircles(circlesGroup, newXscale, chosenXAxis) {
    
}