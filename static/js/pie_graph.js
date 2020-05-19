function d3_PieChart(data,graph_title_text,dims){

    var margin = {top: 0, right: 0, bottom: 30, left: 0};
    var width = dims[0] - margin.left - margin.right,
    height = dims[1]- margin.top - margin.bottom
        radius = Math.min(width, height) / 2;

    var final_data = [];
    var final_data_color = [];
    var final_data_label = [];
    for (var i = 0; i< data.length; i++){
        final_data.push(data[i][0]);
        final_data_color.push(colorComplaint(data[i][1]))
        final_data_label.push(data[i][1]  + ": " + data[i][0]);
    }

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
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
        .style("fill", function(d,i) { return final_data_color[i]; });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data; });

    // Title to the x axis
    svg.append("text")
        .attr("class","axis-titles")
        .attr("transform","translate(0," + (height + margin.top + 30)/2 + ")")
        .style("text-anchor", "middle")
        .text(graph_title_text);        
}