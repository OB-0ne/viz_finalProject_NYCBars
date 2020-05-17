function d3_BarChart(data){

    var width = 960,
        height = 500;

    // creating dictionary
    var final_data = [];
    for (var i = 0; i< data.length; i++){
        final_data.push({
            key: data[i][1],
            value: data[i][0]
        });
    }

    var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888","#98abc5", "#8a89a6", "#7b6888"]);

    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);

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
        .attr("class", "bar")
        .style("fill", function(d) { return color(d.key); })
        .attr("width", function(d) {return x(d.value); } )
        .attr("y", function(d) {return height - 70 - y(d.key); })
        .attr("height", y.bandwidth());

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}