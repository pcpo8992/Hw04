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
svg();
var data;
//讀資料
d3.csv("data/invoice.csv", mid, function (dataSet) {
    data = dataSet;
    binder(dataSet);
    render(dataSet);
    btnList(unique(dataSet));
});

//d3讀取的資料皆為字串
function mid(d) {
    d.number = +d.number;
    d.amount = +d.amount;
    return d;
}

//畫布function
function svg() {
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .append("rect")
        .attr({
            "width": "100%",
            "height": "100%",
            "fill": "white"
        });

    svg.append("g")
        .classed("axis", true)
        .attr("id", "axisX");

    svg.append("g")
        .classed("axis", true)
        .attr("id", "axisY");
}

//綁定元素
function binder(data) {
    var selection = d3.select("svg")
        .selectAll("circle")
        .data(data);

    selection.enter()
        .append("circle");

    selection.exit()
        .remove();
}

//畫資料
function render(data) {
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

    d3.selectAll("circle")
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

    d3.selectAll("circle")
        .on("mouseover", function (d) {
            var posiX = d3.select(this).attr("cx");
            var posiY = d3.select(this).attr("cy");
            //            console.log(posiX);
            var tooltip = d3.select("#tooltip")
                .style({
                    "left": (+posiX + 20) + "px",
                    "top": (+posiY + 20) + "px"
                });

            tooltip.select("#city").text(d.city);
            tooltip.select("#industry").text(d.industry);

            tooltip.classed("hidden", false);
        })
        .on("mouseout", function (d) {
            d3.select("#tooltip").classed("hidden", true);
        });



    d3.select("svg>#axisX")
        .attr("transform", "translate(" + 0 + "," + (height - padding.bottom + 10) + ")")
        .call(axisX);

    d3.select("svg>#axisY")
        .attr("transform", "translate(" + (padding.left - 10) + "," + 0 + ")")
        .call(axisY);
}

//列出button
function btnList(data) {

    var narray = data.map(function (d) {
        return d.industry;
    });

    var fnarry = unique(narray);

    var farry = fnarry.filter(function (d) {
        return d != "";
    });
    var selection = d3.select("body")
        .append("select")
        .selectAll("option")
        .data(farry);

    selection.enter()
        .append("option");

    selection.exit()
        .remove();

    d3.selectAll("option")
        .attr({
            "value": function (d) {
                return d;
            }
        })
        .text(function (d) {
            return d;
        });

    d3.selectAll("select")
        .on("change", function (d) {
            var value = d3.select("select").property("value");
            //            console.log(value);
            update(value);
        });

    function update(da) {
        var fdata = data.filter(function (d) {
            return d.industry === da;
        });

        binder(fdata);
        render(fdata);

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
