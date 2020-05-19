//making a range for all the data column names
data_col_names = ['precinct','Longitude','Latitude','Borough'];
borough_names = ["MANHATTAN","QUEENS","BROOKLYN","STATEN ISLAND","BRONX"];
borough_colors = ["#d11141", "#00b159", "#00aedb","#f37735", "#ffc425","#000000"];


//making color range for all
var color = d3.scaleOrdinal()
    .domain(borough_names)
    .range(borough_colors);

var colorComplaint = d3.scaleOrdinal()
    .domain(['Residential Building/House','Street/Sidewalk','Store/Commercial','Club/Bar/Restaurant','Park/Playground','House of Worship'])
    .range(["#f94144", "#f3722c", "#f8961e","#f9c74f", "#90be6d","#43aa8b"]);

var col2num = d3.scaleOrdinal()
    .domain(data_col_names)
    .range(d3.range(d3.set(data_col_names).size()))

//setting dimensions for all the graphs
map_dim = [800,775];
PCA_dim = [380,380];
bar_dim = [450,380];
pie_dim = [450,380];


//make the Bar Location graph
function drawGraphs(month_range){

    $.get('/updateData/' + month_range, function(response){
        d3_ScatterPlot(response.BarLoc, "NYC Bar Map","svg-holder-BarLoc",col2num('Longitude'),col2num('Latitude'),col2num('Borough'),2,map_dim,false);
        d3_ScatterPlot(response.PCA1, "PCA: Bar Activity vs Safety","svg-holder-PCA1",col2num('Longitude'),col2num('Latitude'),col2num('Borough'),3,PCA_dim,true);
        d3_ScatterPlot(response.PCA2, "PCA: More Locations by Bar Complaints","svg-holder-PCA2",col2num('Longitude'),col2num('Latitude'),col2num('Borough'),3,PCA_dim,true);
        d3_PieChart(response.ComplainPie, "Complaints Coming From", pie_dim);
        d3_BarChart(response.BarCities, "Arrest per 10 complaints (Bar Colored by Borough)", bar_dim);
        d3_Slider();
        makeLegend()
    });
}

function makeLegend(){

    var svg = d3.select("#svg-holder-BarLoc").select("svg").select("g");

    var x_main = 40;
    var y_main = 40;
    var offset = 25;

    var i;
    for (i = 0; i < borough_names.length; i++) {
        svg.append("rect").attr("x", x_main).attr("y", y_main + i*offset).attr("height", 15).attr("width",15).style("fill", color(borough_names[i]));
        svg.append("text").attr("x", x_main + 20).attr("y", y_main + 12 + i*offset).text(borough_names[i]).style("font-size", "15px").attr("alignment-baseline","middle").attr("class","axis-titles");
    } 

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
    
    if(new_left==1 && new_right==12){
        month_range = "|reset";
    }
    else{
        month_range = "|" + new_left + "," + new_right
    }

    //check if this needs to be reset or updated
    if(data.size() > 0){
        data = data.values();
    }
    else{
        data="reset"
    }
    //get the data
    $.get('/updateCateData/' + data + month_range, function(response){
        d3_PieChart(response.ComplainPie, "Complaint Location", pie_dim);
        d3_BarChart(response.BarCities, "Arrest per 10 complaints", bar_dim);
    });
}
