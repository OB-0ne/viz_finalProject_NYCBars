function d3_BarChart(data,graph_title_text,dims){

    var margin = {top: 30, right: 30, bottom: 60, left: 60};
    var width = dims[0] - margin.left - margin.right,
        height = dims[1]- margin.top - margin.bottom;

    // creating dictionary
    var final_data = [];
    for (var i = 0; i< data.length; i++){
        final_data.push({
            key: data[i][0],
            value: data[i][1],
            color: data[i][2],
            tip: '[Precinct ' + data[i][0] + '] ' + data[i][1] + ' Arrests'
        });
    }

    var y = d3.scaleBand()
        .range([0, height])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);

    d3.select("#svg-holder-CityBar").select("svg").remove();

    var svg = d3.select("#svg-holder-CityBar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    x.domain([0, d3.max(final_data, function(d){return d.value; })])
    y.domain(final_data.map(function(d) { return d.key; }));

    // append the rectangles for the bar chart
    svg.selectAll(".bar")                                          
        .data(final_data)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.value); } )
        .attr("y", function(d,i) { return y(d.key); })
        .attr("height", y.bandwidth())
        .attr("fill", function(d) { return color(d.color); })
        .attr("tip", function(d) { return d.tip; })
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration('100');
            d3.select('#tool-tip')
                .style('visibility','visible')
                .style("left", d3.event.pageX + 12 + "px")
                .style("top", d3.event.pageY + 12 + "px")
                .text(d3.select(this).attr("tip"))
        })
        .on('mousemove',function () {
            d3.select('#tool-tip')
            .style("left", d3.event.pageX + 12 + "px")
            .style("top", d3.event.pageY + 12 + "px");
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration('200');
            d3.select('#tool-tip')
                .style('visibility','hidden')
                .text('');
       })
       .transition()
       .duration(100)
       .ease(d3.easeBack);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill","white")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Title to the x axis
    svg.append("text")
        .attr("class","axis-titles")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(graph_title_text);

    // Title to the x axis
    svg.append("text")
        .attr("class","axis-titles")
        .attr("transform","translate(-32," + (height)/2 + "),rotate(-90)")
        .style("text-anchor", "middle")
        .text(" Top Safe Precincts");

}