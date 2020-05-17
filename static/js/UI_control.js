//making a range for all the data column names
data_col_names = ['index','Longitude','Latitude','Borough'];

var col2num = d3.scaleOrdinal()
    .domain(data_col_names)
    .range(d3.range(d3.set(data_col_names).size()))


//make the Bar Location graph
function drawGraphs(){

    //get the data
    $.get('/updateData', function(response){
        d3_ScatterPlot(response.BarLoc, "NYC Bar Map","svg-holder-BarLoc",col2num('Longitude'),col2num('Latitude'),col2num('Borough'));
        d3_ScatterPlot(response.BarLoc, "NYC Bar Map","svg-holder-BarLoc-test",col2num('Longitude'),col2num('Latitude'),col2num('Borough'));
        d3_PieChart(response.ComplainPie);
        d3_BarChart(response.BarCities);
    });

}

var all_scatter_graphs = ['svg-holder-BarLoc','svg-holder-BarLoc-test']

function resetAllGraphs(data, current_svg, event_type){
    
    //loop for all the scatter plots which need to be colored
    all_scatter_graphs.forEach(function(item){

        //apply functions for all svg except the current one
        if(item!=current_svg){

            //cehck if brushing or resetting functions need to be called
            if(event_type=="brush"){
                brushScatterGraph(item,data);
            }
            else{
                unbrushScatterGraph(item);
            }
        }
    });
}

function unbrushScatterGraph(svg_id){
    //select the correct svg and color all its dots
    var svg = d3.select('#' + svg_id)    
    svg.selectAll('circle').attr("class", "brushed");
}

function brushScatterGraph(svg_id, data){

    //select the correct svg
    var svg = d3.select('#' + svg_id)

    //selects its dots
    var circles = svg.selectAll('circle')

    //remove color from all dots
    circles.attr("class", "non_brushed");

    //only color the dows which have been selected in the other graph
    circles.filter(function (){
        var index = d3.select(this).attr("index")
        return data.has(index); 
    })
    .attr("class", "brushed");

}