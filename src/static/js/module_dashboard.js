$(document).ready(function () {

    var year = moment().format('YYYY');
    $('#yearly_period').html(year);

    // SUMMARIES
    $.ajax({
        url: '/dashboard/ajax/summary/' + year + '/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#summary_income').html(formatRupiah((data.total_income).toString(), 'Rp. '));
            $('#summary_expense').html(formatRupiah((data.total_expense).toString(), 'Rp. '));
            $('#summary_opening').html(formatRupiah((data.opening_balance).toString(), 'Rp. '));
            $('#summary_closing').html(formatRupiah((data.closing_balance).toString(), 'Rp. '));
        }
    });

    var options_bar = {
        chart: {
            type: 'bar',
            height: 350,
        },
        series: [],
        xaxis: {
            categories: []
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return 'Rp ' + value.toLocaleString('id-ID');
                }
            }
        },
        title: {
            text: 'Income and Expense in 1 Year'
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: false
                }
            },
        }
    }
    var chart_bar = new ApexCharts(document.querySelector("#chart_bar"), options_bar);
    chart_bar.render();

    $.ajax({
        url: "/dashboard/ajax/bar/" + year + "/",
        success: function (data) {
            options_bar.series = data.series;
            options_bar.xaxis.categories = data.categories;
            chart_bar.updateOptions(options_bar);
        }
    });

    var options_pie = {
        chart: {
            type: 'donut',
            height: 200,
        },
        series: [],
        labels: [],
        title: {
            text: 'Expense per Account in 1 Year'
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: function (data) {
                    return 'Rp ' + data.toLocaleString('id-ID');
                  }
            }
        }
    }
    var chart_pie = new ApexCharts(document.querySelector("#chart_pie"), options_pie);
    chart_pie.render();

    $.ajax({
        url: "/dashboard/ajax/pie-account/" + year + "/",
        success: function (data) {
            options_pie.series = data.series;
            options_pie.labels = data.labels;
            chart_pie.updateOptions(options_pie);
        }
    });

    var options_pie2 = {
        chart: {
            type: 'donut',
            height: 200,
        },
        series: [],
        labels: [],
        title: {
            text: 'Expense per Store in 1 Year'
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            y: {
                formatter: function (data) {
                    return 'Rp ' + data.toLocaleString('id-ID');
                  }
            }
        }
    }
    var chart_pie2 = new ApexCharts(document.querySelector("#chart_pie2"), options_pie2);
    chart_pie2.render();

    $.ajax({
        url: "/dashboard/ajax/pie-site/" + year + "/",
        success: function (data) {
            options_pie2.series = data.series;
            options_pie2.labels = data.labels;
            chart_pie2.updateOptions(options_pie2);
        }
    });

});