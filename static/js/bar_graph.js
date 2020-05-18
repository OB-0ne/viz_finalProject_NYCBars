function d3_BarChart(data){

    var width = 960,
        height = 500;

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
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);

    d3.select("#svg-holder-CityBar").select("svg").remove();

    var svg = d3.select("#svg-holder-CityBar").append("svg")
        .attr("width", width + 0 + 20)
        .attr("height", height + 20 + 30)
      .append("g")
        .attr("transform", 
              "translate(" + 100 + "," + 20 + ")");


    // Scale the range of the data in the domains
    x.domain([0, d3.max(final_data, function(d){return d.value; })])
    y.domain(final_data.map(function(d) { return d.key; }));

    // append the rectangles for the bar chart
    svg.selectAll(".bar")                                          
        .data(final_data)
    .enter().append("rect")
        .transition()
        .duration(100)
        .ease(d3.easeBack)
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.value); } )
        .attr("y", function(d) {return height - 70 - y(d.key); })
        .attr("height", y.bandwidth())
        .attr("fill", function(d) { return color(d.color); })
        .attr("tip", function(d) {return d.tip; })
        .on('mouseover', function (d, i) {
            d3.select(this)
                .transition()
                .duration('100');
            d3.select('#tool-tip')
                .style('visibility','visible')
                .style("left", d3.event.pageX + 12 + "px")
                .style("top", d3.event.pageY + 12 + "px")
                .text(d3.select(this).attr("tip"))
        })
        .on('mousemove',function (d, i) {
            d3.select('#tool-tip')
            .style("left", d3.event.pageX + 12 + "px")
            .style("top", d3.event.pageY + 12 + "px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this)
                .transition()
                .duration('200');
            d3.select('#tool-tip')
                .style('visibility','hidden')
                .text('');
       });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}