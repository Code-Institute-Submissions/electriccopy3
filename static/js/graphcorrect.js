queue()
     .defer(d3.json, "/electric/projects")
     .await(makeGraphs);

function makeGraphs(error, projectsJson) {
     if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
     }


   //Clean projectsJson data

    var electricProjects = projectsJson;

    var dateFormat = d3.time.format("%Y-%m-%d");
       electricProjects.forEach(function (d) {

       d["date"] = dateFormat.parse(d["date"]+"-1-1");
       d['year'] = d['date'].getFullYear();
       d["oil_equivalent"] = +d["oil_equivalent"];
       });


   //Create a Crossfilter instance
    var ndx = crossfilter(electricProjects);


   //Define Dimensions

   var dateDim = ndx.dimension(function (d) {
       return d["date"];
   });

//                var electric_consumedDim = ndx.dimension(function (d) {
//              return d["electric_consumed"];
//                       });

//   var major_areasDim = ndx.dimension(function (d) {
//     return d["year"];
// });

   var oil_equivalentDim = ndx.dimension(function (d) {
       return d["electric_consumed"];
   });

//   var major_areas2Dim = ndx.dimension(function (d) {
//      return d["electric_consumed"];
// });

   var ledDim = ndx.dimension(function (d) {
       return d["date"];
   });

   var tvDim = ndx.dimension(function (d) {
       return d["year"];
   });

   var set_top_boxDim = ndx.dimension(function (d) {
       return d["year"];
   });

   var dvd_vcrDim = ndx.dimension(function (d) {
       return d["year"];
   });

   var gamesDim = ndx.dimension(function (d) {
       return d["year"];
   });


   //Calculate metrics

    var date = dateDim.group();

    var electric_consumed = dateDim.group().reduceSum(function (d) {
        return d["electric_consumed"];
    });

//    var major_areas = dateDim.group().reduceSum(function (d) {
//        return d["electric_consumed"];
//    });

    var oil_equivalent = oil_equivalentDim.group().reduceSum(function (d) {
        return d["electric_consumed"];
    });

//    var major_areas2 = ndx.groupAll().reduceSum(function (d) {
//        return d["electric_consumed"];
//    });

    var led = ledDim.group().reduceSum(function (d) {
        return d["led"];
    });

    var tv = tvDim.group().reduceSum(function (d) {
        return d["tv"];
    });

    var set_top_box = set_top_boxDim.group().reduceSum(function (d) {
        return d["set_top_box"];
    });

    var dvd_vcr = dvd_vcrDim.group().reduceSum(function (d) {
        return d["dvd_vcr"];
    });

    var games = gamesDim.group().reduceSum(function (d) {
        return d["games"];
    });

    var lighting_total = dateDim.group().reduceSum(function (d) {
        return d["lighting_total"];
    });

    var cold_total = dateDim.group().reduceSum(function (d) {
        return d["cold_total"];
     });

    var wet_total = dateDim.group().reduceSum(function (d) {
        return d["wet_total"];
    });

    var electronics_total = dateDim.group().reduceSum(function (d) {
        return d["electronics_total"];
    });

    var computing_total = dateDim.group().reduceSum(function (d) {
        return d["computing_total"];
    });

    var cooking_total = dateDim.group().reduceSum(function (d) {
        return d["cooking_total"];
    });

    var oilEquivalent = ndx.groupAll().reduceSum(function (d) {
        return d["oil_equivalent"];
    });


    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0]["date"];
    var maxDate = dateDim.top(1)[0]["date"];


    //Charts

    var electric_consumedChart = dc.barChart("#electric_consumed-bar-chart");

    var ledChart = dc.barChart("#led-bar-chart");

    var major_areasChart = dc.compositeChart("#major_areas-composite-chart");

    var major_areas2Chart = dc.pieChart("#major_areas2-pie-chart");

    var selectField = dc.selectMenu('#select_menu');

    var oil_equivalentND = dc.numberDisplay("#oil_equivalent-nd");

    var tvChart = dc.rowChart("#tv-row-chart");

    var set_top_boxChart = dc.rowChart("#set_top_box-row-chart");

    var dvd_vcrChart = dc.rowChart("#dvd_vcr-row-chart");

    var gamesChart = dc.rowChart("#games-row-chart");


   selectField
        .dimension(date)
        .group(date);

   electric_consumedChart
        .width(768)
        .height(300)
        .margins({top:20,right:20,bottom:40,left:60})
        .x(d3.time.scale().domain([minDate, maxDate]))
        .transitionDuration(1000)
        .xAxisLabel("Year (1970 - 2015)")
        .yAxisLabel("Power Consumption")
        .xUnits(function(){return 50;})
        .dimension(dateDim)
        .group(electric_consumed)
  .yAxis().tickFormat(function(v) {return v / 4;})
   ;

   major_areasChart
        .width(768)
        .height(480)
        .margins({top:20,right:20,bottom:40,left:60})
        .dimension(dateDim)
          //  .yAxis().tickFormat(function(v) {return v / 50;})
        .x(d3.time.scale().domain([minDate, maxDate]))
        .transitionDuration(1000)
        .xAxisLabel("Year (1970 - 2015)")
        .yAxisLabel("Power Consumption")
        .xUnits(function(){return 50;})
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose
            ([
            dc.lineChart(major_areasChart)
                .colors('red')
                .group(cooking_total, "Cooking"),
            dc.lineChart(major_areasChart)
                .colors('yellow')
                .group(lighting_total, "Lighting"),
            dc.lineChart(major_areasChart)
                .colors('green')
                .group(cold_total, "Cold"),
            dc.lineChart(major_areasChart)
                .colors('blue')
                .group(wet_total, "Wet"),
            dc.lineChart(major_areasChart)
                .colors('orange')
                .group(electronics_total, "Electronics"),
            dc.lineChart(major_areasChart)
                .colors('black')
                .group(computing_total, "Computing"),
            ])
        .brushOn(false)
        .render();

   ledChart
        .height(220)
        .width(768)
        .margins({top:20,right:20,bottom:40,left:60})
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xUnits(function(){return 50;})
        .dimension(ledDim)
        .group(led)
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxisLabel("Power Consumption")
        .yAxis().ticks(4);

   tvChart
        .width(250)
        .height(780)
        .dimension(tvDim)
        .group(tv)
        .xAxis().ticks(3);

   set_top_boxChart
        .width(250)
        .height(780)
        .dimension(set_top_boxDim)
        .group(set_top_box)
        .xAxis().ticks(3);

   dvd_vcrChart
        .width(250)
        .height(780)
        .dimension(dvd_vcrDim)
        .group(dvd_vcr)
        .xAxis().ticks(2);

   gamesChart
        .width(250)
        .height(780)
        .dimension(gamesDim)
        .group(games)
        .xAxis().ticks(2);

   oil_equivalentND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
           return d;
        })
        .group(oilEquivalent)
        .formatNumber(d3.format(".4s"));
      //  .formatNumber(d3.format("c.5s"));

   major_areas2Chart
        .height(420)
        .radius(190)
        .innerRadius(10)
        .transitionDuration(1500)
        .dimension(oil_equivalent)
        .group(oil_equivalent);

   dc.renderAll();
}
