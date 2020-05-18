function d3_PieChart(data){

    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var final_data = [];
    var final_data_label = [];
    for (var i = 0; i< data.length; i++){
        final_data.push(data[i][0]);
        final_data_label.push(data[i][1]  + ": " + data[i][0]);
    }

    var colorPie = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888","#98abc5", "#8a89a6", "#7b6888"]);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d; });

        d3.select("#svg-holder-ComPie").select("svg").remove();

    var svg = d3.select("#svg-holder-ComPie").append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(final_data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("tip", function(d,i){ return final_data_label[i]; })
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
        });

    g.append("path")
        .transition()
        .duration(1000)
        .attr("d", arc)
        .style("fill", function(d) { return colorPie(d.data); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data; });

}