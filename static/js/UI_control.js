
//make the Bar Location graph
function drawGraphs(){

    //get the data
    $.get('/updateData', function(response){
        d3_ScatterPlot(response.BarLoc, "NYC Bar Map","NYC_BarLoc");
        d3_PieChart(response.ComplainPie);
        d3_BarChart(response.BarCities);
    });

}
