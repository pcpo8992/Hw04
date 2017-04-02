//定義基本長寬
var width = 700;
var height = 500;

//定義padding
var padding = {
    "left": 60,
    "right": 50,
    "top": 50,
    "bottom": 50
};

//畫布
svg1();

//讀資料
d3.csv("data/invoice.csv", mid1, function (dataSet) {

    binder1(dataSet);
    render1(dataSet);
    btnList1(unique(dataSet));
});

//d3讀取的資料皆為字串
function mid1(d) {
    d.number = +d.number;
    d.amount = +d.amount;
    return d;
}

//畫布function
function svg1() {
    var svg1 = d3.select(".svg1")
        .attr("width", width)
        .attr("height", height);

    svg1.append("g")
        .append("rect")
        .attr("class", "rect-1")
        .attr({
            "width": "100%",
            "height": "100%",
            "fill": "white"
        });

    svg1.append("g")
        .classed("axis", true)
        .attr("id", "axisX");

    svg1.append("g")
        .classed("axis", true)
        .attr("id", "axisY");
}

//綁定元素
function binder1(data) {
    var selection = d3.select(".svg1")
        .selectAll("circle")
        .data(data);

    selection.enter()
        .append("circle");

    selection.exit()
        .remove();
}

//畫資料
function render1(data) {
    //定義比例尺
    var xScale = d3.time.scale()
        .domain([
            new Date("2013/01/01"),
            new Date("2016/08/01")
        ])
        .rangeRound([
            padding.left,
            width - padding.right
        ]);

    var yScale = d3.scale.linear()
        .domain([
            d3.min(data, function (d) {
                return d.number;
            }),
            d3.max(data, function (d) {
                return d.number;
            })
           ])
        .rangeRound([
            height - padding.bottom,
            padding.top
        ]);

    var rScale = d3.scale.linear()
        .domain([
            0,
            d3.max(data, function (d) {
                return d.amount;
            })
        ])
        .rangeRound([5, 20])
        .clamp(true);

    var fScale = d3.scale.category20();

    //畫x ,y 軸
    var axisX = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    var axisY = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10)
        .tickFormat(function (d) {
            return (d / 1000000) + "M";
        })

    d3.select(".svg1")
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr({
            "cx": function (d) {
                return xScale(new Date(d.date));
            },
            "cy": function (d) {
                return yScale(d.number);
            },
            "r": function (d) {
                return rScale(d.amount);
            },
            "fill": function (d) {
                return fScale(d.city);
            }
        });

    d3.select(".svg1")
        .selectAll("circle")
        .on("mouseover", function (d) {
            var posiX = d3.select(this).attr("cx");
            var posiY = d3.select(this).attr("cy");
            //            console.log(posiX);
            var tooltip = d3.select("#tooltip.type1")
                .style({
                    "left": (+posiX + 20) + "px",
                    "top": (+posiY + 20) + "px"
                });

            tooltip.select("#city").text(d.city);
            tooltip.select("#industry").text(d.industry);

            tooltip.classed("hidden", false);
        })
        .on("mouseout", function (d) {
            d3.select("#tooltip.type1").classed("hidden", true);
        });



    d3.select(".svg1>#axisX")
        .attr("transform", "translate(" + 0 + "," + (height - padding.bottom + 10) + ")")
        .call(axisX);

    d3.select(".svg1>#axisY")
        .attr("transform", "translate(" + (padding.left - 10) + "," + 0 + ")")
        .call(axisY);
}

//列出button
function btnList1(data) {

    var narray = data.map(function (d) {
        return d.industry;
    });

    var fnarry = unique(narray);

    var farry = fnarry.filter(function (d) {
        return d != "";
    });
    var selection = d3.select(".select1")
        .append("select")
        .selectAll("option")
        .data(farry);

    selection.enter()
        .append("option");

    selection.exit()
        .remove();

    d3.select(".select1")
        .selectAll("option")
        .attr({
            "value": function (d) {
                return d;
            }
        })
        .text(function (d) {
            return d;
        });

    d3.select(".select1")
        .selectAll("select")
        .on("change", function (d) {
            var value = d3.select(".select1").select("select").property("value");
            var fdata = data.filter(function (d) {
                return d.industry === value;
            });
            update1(fdata);
        });

    function update1(da) {
        binder1(da);
        render1(da);
    }
}

function unique(array) {
    var narry = [];

    for (var n = 0; n < array.length; n++) {
        if (narry.indexOf(array[n]) === -1) {
            narry.push(array[n]);
        }
    }
    //    console.log(narry);
    return narry;
}


svg2();

d3.csv("data/cancer_data.csv", mid2, function (dataSet) {
    binder2(dataSet);
    render2(dataSet);
    btnList2(unique(dataSet));
});

function svg2() {
    var svg2 = d3.select(".svg2")
        .attr("width", width)
        .attr("height", height);

    svg2.append("g")
        .append("rect")
        .attr({
            "width": "100%",
            "height": "100%",
            "fill": "white"
        });

    svg2.append("g")
        .classed("axis", true)
        .attr("id", "axisX");

    svg2.append("g")
        .classed("axis", true)
        .attr("id", "axisY");
}

function mid2(d) {
    d.date = +d.date;
    d.count = +d.count;
    d.avg_age = +d.avg_age;
    d.mid_age = +d.mid_age;
    d.crude_rate = +d.crude_rate;
    return d;
}

function binder2(data) {
    var selection = d3.select(".svg2")
        .selectAll("circle")
        .data(data);

    selection.enter()
        .append("circle");

    selection.exit()
        .remove();
}

function render2(data) {
    //定義比例尺
    var xScale = d3.scale.linear()
        .domain([
            d3.min(data, function (d) {
                return d.crude_rate;
            }),
            d3.max(data, function (d) {
                return d.crude_rate;
            })
        ])
        .rangeRound([
            padding.left,
            width - padding.right
        ]);

    var yScale = d3.scale.linear()
        .domain([
            0,
            d3.max(data, function (d) {
                return d.avg_age;
            })
           ])
        .rangeRound([
            height - padding.bottom,
            padding.top
        ]);

    var rScale = d3.scale.linear()
        .domain([
            0,
            d3.max(data, function (d) {
                return d.count;
            })
        ])
        .rangeRound([5, 15])
        .clamp(true);

    var fScale = d3.scale.category20();

    //畫x ,y 軸
    var axisX = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    var axisY = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);
    //        .tickFormat(function (d) {
    //            return (d / 1000000) + "M";
    //        });

    d3.select(".svg2")
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr({
            "cx": function (d) {
                return xScale(d.crude_rate);
            },
            "cy": function (d) {
                return yScale(d.avg_age);
            },
            "r": function (d) {
                return rScale(d.count);
            },
            "fill": function (d) {
                return fScale(d.city);
            }
        });

    d3.select(".svg2")
        .selectAll("circle")
        .on("mouseover", function (d) {
            var posiX = d3.select(this).attr("cx");
            var posiY = d3.select(this).attr("cy");
            //            console.log(posiX);
            var tooltip = d3.select("#tooltip.type2")
                .style({
                    "left": (+posiX + 80) + "px",
                    "top": (+posiY + 580) + "px"
                });

            tooltip.select("#city").text(d.city);
            tooltip.select("#category").text(d.category);
            tooltip.select("#count").text("案例數:" + d.count);

            tooltip.classed("hidden", false);
        })
        .on("mouseout", function (d) {
            d3.select("#tooltip.type2").classed("hidden", true);
        });



    d3.select(".svg2>#axisX")
        .attr("transform", "translate(" + 0 + "," + (height - padding.bottom + 10) + ")")
        .call(axisX);

    d3.select(".svg2>#axisY")
        .attr("transform", "translate(" + (padding.left - 10) + "," + 0 + ")")
        .call(axisY);
}

function btnList2(data) {

    var narray = data.map(function (d) {
        return d.category;
    });

    var fnarry = unique(narray);

    var farry = fnarry.filter(function (d) {
        return d != "";
    });
    var selection = d3.select(".select2")
        .append("select")
        .selectAll("option")
        .data(farry);

    selection.enter()
        .append("option");

    selection.exit()
        .remove();

    d3.select(".select2")
        .selectAll("option")
        .attr({
            "value": function (d) {
                return d;
            }
        })
        .text(function (d) {
            return d;
        });

    d3.select(".select2")
        .selectAll("select")
        .on("change", function (d) {
            var value = d3.select(".select2").select("select").property("value");
            //console.log(value);
            var fdata = data.filter(function (d) {
                return d.category === value;
            });
            update2(fdata);
        });

    function update2(da) {
        binder2(da);
        render2(da);
    }

    d3.select("#timer")
        .on("click", function (d) {

            var dateArr = unique(data.map(function (d) {
                return d.date;
            }));

            d3.select(".svg2")
                .append("text")
                .attr({
                    "id": "showYear",
                    "x": width - padding.left - 380,
                    "y": height - padding.bottom,
                    "fill": "#a8a3a3",
                    "opcity": 5,
                    "font-size": "180"
                });

            var idx = 0;

            window.setInterval(function () {
                //更新圖表內容
                var value = d3.select(".select2").select("select")
                    .property("value");

                var newDataSet = data.filter(function (d) {
                    return d.category === value && d.date === dateArr[idx];
                });

                update2(newDataSet);

                d3.select("#showYear")
                    .text(dateArr[idx]);

                idx++;
                if (idx >= dateArr.length) {
                    idx = 0;
                }
            }, 1000);
        });
}
