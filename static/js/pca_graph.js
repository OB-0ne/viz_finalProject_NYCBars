
function d3_ScatterPlot(data,graph_title_text){

    var margin = {top: 30, right: 30, bottom: 60, left: 30},
    width = 550 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#svg-holder-BarLoc").append("svg")
        .attr("class","multi-scatter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // don't want dots overlapping axis, so add in buffer to data domain
    x.domain(d3.extent(data, function(d) { return d[0]; })).nice();
    y.domain(d3.extent(data, function(d) { return d[1]; })).nice();

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Calories");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Protein (g)");

    // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 2.5)
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })

    // Title to the x axis
    svg.append("text")
        .attr("class","axis-titles")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(graph_title_text);

}
