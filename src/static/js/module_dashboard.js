$(document).ready(function () {

    var year = moment().format('YYYY');

    // SUMMARIES
    $.ajax({
        url: '/dashboard/ajax/summary/'+year+'/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#summary_income').html( formatRupiah((data.total_income).toString(), 'Rp. ') );
            $('#summary_expense').html( formatRupiah((data.total_expense).toString(), 'Rp. ') );
            $('#summary_opening').html( formatRupiah((data.opening_balance).toString(), 'Rp. ') );
            $('#summary_closing').html( formatRupiah((data.closing_balance).toString(), 'Rp. ') );
        }
    });

    var options_bar = {
        chart: {
            type: 'bar',
            height: 350,
        },
        series: [
            {
                name: 'Income',
                data: [1000, 2000, 1500, 3000, 2500, 4000, 3500]
            },
            {
                name: 'Expense',
                data: [500, 1000, 800, 1500, 1200, 2000, 1700]
            }
        ],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        },
        title: {
            text: 'Income and Expense in 1 Year'
        }
    }

    var chart_bar = new ApexCharts(document.querySelector("#chart_bar"), options_bar);
    chart_bar.render();

    var options_pie = {
        chart: {
            type: 'pie',
            height: 200,
        },
        series: [55, 35, 10],
        labels: ['Travel Expense', 'Food Expense', 'Office Supplies Expense'],
        title: {
            text: 'Expense per Account in 1 Year'
        }
    }

    var chart_pie = new ApexCharts(document.querySelector("#chart_pie"), options_pie);
    chart_pie.render();

    var options_pie2 = {
        chart: {
            type: 'pie',
            height: 200,
        },
        series: [35, 25, 20, 20],
        labels: ['Store A', 'Store B', 'Store C', 'Store D'],
        title: {
            text: 'Expense per Store in 1 Year'
        }
    }

    var chart_pie2 = new ApexCharts(document.querySelector("#chart_pie2"), options_pie2);
    chart_pie2.render();

});