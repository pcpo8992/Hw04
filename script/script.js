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
            "fill": "none"
        });
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

    d3.select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 0 + "," + (height - padding.bottom + 10) + ")")
        .call(axisX);

    d3.select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (padding.left - 10) + "," + 0 + ")")
        .call(axisY);
}
