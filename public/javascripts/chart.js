// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
var d = [['Month', 'Income', 'Expenses', "Ending Balance"]];
var n = 0;
for (var i = 0; i < 12; i++) {
    n += nets[i];
    d.push([months[i], income[i], expenses[i], n]);
}
function drawChart() {
    var data = google.visualization.arrayToDataTable(d);

      var options = {
        legend: { position: 'bottom', textStyle: {color: 'white'}},
        hAxis: {textStyle: {color: 'white'}}
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

      chart.draw(data, options);
}