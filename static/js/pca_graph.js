
function d3_ScatterPlot(data,graph_title_text, div_id, scatter_x, scatter_y, scatter_color, dot_radius, dims, axis){

    var resetBar = false;

    var margin = {top: 30, right: 25, bottom: 60, left: 35},
    width = dims[0] - margin.left - margin.right,
    height = dims[1] - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    d3.select("#" + div_id).select("svg").remove();

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#" + div_id).append("svg")
        .attr("class","multi-scatter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // don't want dots overlapping axis, so add in buffer to data domain
    x.domain(d3.extent(data, function(d) { return d[scatter_x]; })).nice();
    y.domain(d3.extent(data, function(d) { return d[scatter_y]; })).nice();

        /*
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
        */

    

    // draw dots
    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", dot_radius)
        .attr("cx", function(d) { return x(d[scatter_x]); })
        .attr("cy", function(d) { return y(d[scatter_y]); })
        .attr("fill", function(d) { return color(d[scatter_color]); })
        .attr("precinct", function(d) { return d[col2num('precinct')]; });

    // Title to the x axis
    svg.append("text")
        .attr("class","axis-titles")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(graph_title_text);

    if(axis){

        var x_tit, y_tit;

        if(div_id == "svg-holder-PCA1"){
            x_tit = "Low <--------- (Active Bar Life) ---------> High"
            y_tit = "Low <----------- (Safety) ------------> High"
        }
        else{
            x_tit = "Low <------- (Bar Locations) -------> High"
            y_tit = "Others <----- (Complaint Type) ------> Bars"
        }

        //PCA titles
        svg.append("text")
            .attr("class","axis-titles")
            .attr("transform","translate(" + (width)/2 + " ," + (height + margin.top - 10) + ")")
            .style("font-size","15px")
            .style("text-anchor", "middle")
            .text(x_tit);
        svg.append("text")
            .attr("class","axis-titles")
            .attr("transform","translate(-5," + (height + margin.top)/2 + "),rotate(-90)")
            .style("font-size","15px")
            .style("text-anchor", "middle")
            .text(y_tit);

    }


    
    function resetSelection(){
        //reset the selection if new brushing event starts
        d3.select(this).call(brush.move, null);
        //color all current dots
        circles.attr("class","brushed");
        //reset other graph selections too
        resetAllGraphs(d3.set([]), div_id,"start");
        if(resetBar){
            resetCateGrahs(d3.set(''));
            resetBar = false;
        }
    }

    //brushing function for the dots
    function highlightBrushedCircles() {

        if (d3.event.selection != null) {

            // revert circles to initial style
            circles.attr("class", "non_brushed");

            // get the currect selection cordinates
            var brush_coords = d3.brushSelection(this);

            // style brushed circles
            circles.filter(function (){

                var cx = d3.select(this).attr("cx"),
                    cy = d3.select(this).attr("cy");

                return isBrushed(brush_coords, cx, cy);
            })
            .attr("class", "brushed");

            //get the data of all the dots under the selection
            d_brushed =  d3.set(svg.selectAll(".brushed").data().map(function(d){return d[col2num('precinct')];}));
            // check if any dots have been selected to update the other graphs as well
            if (d_brushed.size() > 0) {
                resetAllGraphs(d_brushed, div_id,"brush");
            }
            else{
                resetAllGraphs(d3.set([]), div_id,"start");
            }

        }
    }

    function updateOtherCharts() {

        // disregard brushes w/o selections  
        // ref: http://bl.ocks.org/mbostock/6232537
        if (!d3.event.selection) return;

        // programmed clearing of brush after mouse-up
        // ref: https://github.com/d3/d3-brush/issues/10
        //d3.select(this).call(brush.move, null);

        //get the precinct of the brushed data
        var d_brushed =  svg.selectAll(".brushed").data();

        // populate table if one or more elements is brushed
        if (d_brushed.length == 0) {
            //reset the selection if no point was selected
            d3.select(this).call(brush.move, null);
            //circles.attr("class","brushed");
            if(resetBar){
                resetCateGrahs(d3.set(''));
                resetBar = false;
            }
        }
        else{
            d_brushed =  d3.set(d_brushed.map(function(d){return d[col2num('precinct')];}));
            resetCateGrahs(d_brushed);
            resetBar = true;
        }        
    }


    function isBrushed(brush_coords, cx, cy) {

        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

       return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    var brush = d3.brush()
        .on("start", resetSelection)
        .on("brush", highlightBrushedCircles)
        .on("end", updateOtherCharts); 

    svg.append("g")
        .call(brush);

}
