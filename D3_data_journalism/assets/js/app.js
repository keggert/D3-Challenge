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
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

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
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
};

// Function for updating the text group with a transition to the new text
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]))
        .attr("text-anchor", "middle");

    return textGroup;
};

// Function for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    if (chosenXAxis === "poverty") {
        var xLabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        var xLabel = "Age (Median)";
    }
    else {
        var xLabel = "Household Income (Median)";
    }
    if (chosenYaxis === "obesity") {
        var yLabel = "Obese (%)";
    }
    else if (chosenYAxis === "healthcare") {
        var yLabel = "Lacks Healthcare (%)";
    }
    else {
        var yLabel = "Smokes (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });
    
    // Create circles tooltip in the chart
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

        // on mouseout event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    
    textGroup.call(toolTip);
    
    textGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data){
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from CSV file
d3.csv("assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // Parse data
    data.forEach(function(data) {
        data.abbr = data.abbr;
        data.sate = data.state;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
    });

    // Create xLinearScale & yLinearScale functions for our chart
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create axis functions for the chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append X-Axis to the chart
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    // Append y-axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("fill", "blue")
        .attr("stroke-width", "1")
        .attr("stroke", "white")
        .attr("opacity", ".5");
    
    // Append text to circles
    var textGroup = chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("class", text)
        .attr("font-size", "10 px")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => d.abbr);
    
    // Create Group for 3 X-Axis Labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    // Append X-Axis
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");
    
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Createt group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-25, ${height / 2})`);
    // Append y-axis
    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("value", "obesity")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Obese (%)");
    
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0)
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");
    
    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0)
        .attr("value", "smokes")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (%)");
    
    // Update ToolTip Function
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // X Axis Labels Event Listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // Replaces chosen X Axis with value
                chosenXAxis = value;
                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);
                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // updates x circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates text with new values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                // updates tooltips with new information
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    
    // Y Axis Labels Event Listener
    yLabelsGroup.selectAll("text")
        .on("click", function () {
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // Replaces chosen y axis with value
                chosenYAxis = value;
                // updates y scale for new data
                yLinearScale = yScale(data, chosenYAxis);
                // Updates y axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);
                // updates circles with new values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates text with new values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                // updates tooltips witth new information
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                // changes classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else if (chosenYAxis === "healthcare") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false)
                }
            }
        })
}
)