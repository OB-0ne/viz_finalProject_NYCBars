//making a range for all the data column names
data_col_names = ['precinct','Longitude','Latitude','Borough'];

//making color range for all
var color = d3.scaleOrdinal()
    .domain(["MANHATTAN","BROOKLYN","QUEENS","STATEN ISLAND","BRONX"])
    .range(["#d11141", "#00b159", "#00aedb","#f37735", "#ffc425","#000000"]);

var col2num = d3.scaleOrdinal()
    .domain(data_col_names)
    .range(d3.range(d3.set(data_col_names).size()))


//make the Bar Location graph
function drawGraphs(){

    //get the data
    $.get('/updateData', function(response){
        d3_ScatterPlot(response.BarLoc, "NYC Bar Map","svg-holder-BarLoc",col2num('Longitude'),col2num('Latitude'),col2num('Borough'),1.5);
        d3_ScatterPlot(response.PCA1, "Precinct Safety PCA1","svg-holder-PCA1",col2num('Longitude'),col2num('Latitude'),col2num('Borough'),4);
        d3_ScatterPlot(response.PCA2, "Precinct Safety PCA2","svg-holder-PCA2",col2num('Longitude'),col2num('Latitude'),col2num('Borough'),4);
        d3_PieChart(response.ComplainPie);
        d3_BarChart(response.BarCities);
    });

}

var all_scatter_graphs = ['svg-holder-BarLoc','svg-holder-PCA1','svg-holder-PCA2']

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
        var pecinct = d3.select(this).attr("precinct")
        return data.has(pecinct); 
    })
    .attr("class", "brushed");

}

function resetCateGrahs(data){
    
    //check if this needs to be reset or updated
    if(data.size() > 0){
        data = data.values();
    }
    else{
        data="reset"
    }
    //get the data
    $.get('/updateCateData/' + data, function(response){
        d3_PieChart(response.ComplainPie);
        d3_BarChart(response.BarCities);
    });
}