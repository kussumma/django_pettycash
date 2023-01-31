$(document).ready(function () {

    // PERIOD
    var startOfWeek = moment().weekday(1).startOf('week').utcOffset(480).add(1, 'days');
    var endOfWeek = moment(startOfWeek).endOf('week').utcOffset(480).add(1, 'days');
    $('#weekly_period').text(startOfWeek.format('DD MMMM YYYY') + ' - ' + endOfWeek.format('DD MMMM YYYY'));

    var startOfMonth = moment().startOf('month');
    var endOfMonth = moment().endOf('month');
    $('#monthly_period').text(startOfMonth.format('DD MMMM YYYY') + ' - ' + endOfMonth.format('DD MMMM YYYY'));


    // GET ALL ACCOUNT
    $.ajax({
        url: "/account/ajax/get",
        type: 'GET',
        success: function(response) {
            if (response != null) {
                var account = response;
                var html = '';
                html += '<option value="">Select Account</option>';
                for (var i = 0; i < account.length; i++) {
                    html += '<option value="' + account[i].id + '">' + account[i].name + '</option>';
                }
                $('#ft_weekly').html(html);
                $('#ft_monthly').html(html);
            } else {
                Swal.fire('Oopss!', response.message, 'error');
            }
        }
    });

    weekly_datatable();
    monthly_datatable();

    $('#ft_weekly').change(function () {
        var id = $(this).val();
        if (id != '') {
            var year = parseInt(moment().format('YYYY'));
            var month = parseInt(moment().format('MM'));
            var day = parseInt(moment().format('DD'));

            $.ajax({
                url: 'http://127.0.0.1:8000/report/week-report/'+id+'/'+year+'/'+month+'/'+day+'/',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'success') {
                        $('#download_weekly').click(function () {
                            // Proses download PDF
                            generatePDF(data.data);
                        });

                        $('#tb_weekly').DataTable().destroy();
                        weekly_datatable(data.data);
                    }else{
                        Swal.fire('Oopss!', data.status, 'error');
                    }
                }
            });
        }
    });

    $('#ft_monthly').change(function () {
        var id = $(this).val();
        if (id != '') {
            var year = parseInt(moment().format('YYYY'));
            var month = parseInt(moment().format('MM'));
            var day = parseInt(moment().format('DD'));

            $.ajax({
                url: 'http://127.0.0.1:8000/report/month-report/'+id+'/'+year+'/'+month+'/'+day+'/',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'success') {
                        $('#download_monthly').click(function () {
                            // Proses download PDF
                            generatePDF(data.data);
                        });

                        $('#tb_monthly').DataTable().destroy();
                        monthly_datatable(data.data);
                    }else{
                        Swal.fire('Oopss!', data.status, 'error');
                    }
                }
            });
        }
    });

    $('#download_weekly').click(function () {
        if ($('#ft_weekly').val() == '') {
            Swal.fire('Oopss!', 'Please select an account first!', 'error');
        }
    });

    $('#download_monthly').click(function () {
        if ($('#ft_monthly').val() == '') {
            Swal.fire('Oopss!', 'Please select an account first!', 'error');
        }
    });

    function weekly_datatable(data) {
        if (data != null) {
            var table_weekly = $('#tb_weekly').DataTable({
                dom: "<'row'<'col-sm-12'tr>>" + "<'px-3 py-3 border-top'<'row'<'col-sm-5'i><'col-sm-7'p>>>",
                ordering: false,
                scrollX: true,
                pagingType: "full_numbers",
                data: data.transactions,
                columns: [
                    { data: 'date' },
                    { data: 'amount' },
                    { data: 'description' },
                    { data: 'type' },
                    { data: 'account__name' },
                    { data: 'category__name' },
                    { data: 'user__username' },
                    { data: 'location__site' },
                ],
                columnDefs: [
                    {
                        targets: 1,
                        render: function (data, type, row) {
                            return formatRupiah((data).toString(), 'Rp. ');
                        }
                    },
                    {
                        targets: 3,
                        render: function (data, type, row) {
                            if (data == 'expense') {
                                return '<span class="badge badge-danger rounded-pill px-2 py-1">Expense</span>';
                            } else {
                                return '<span class="badge badge-success rounded-pill px-2 py-1">Income</span>';
                            }
                        }
                    },
                ],
                initComplete: function () {
                    $('#tb_weekly tbody tr').each(function () {
                        var type = $(this).find('td:eq(3)').text();
                        if (type == 'Expense') {
                            $(this).find('td:eq(1)').addClass('text-danger');
                        } else {
                            $(this).find('td:eq(1)').addClass('text-success');
                        }
                    });
                }
            });

            $('#weekly_search').on('keyup', function(){
                table_weekly.search($(this).val()).draw();
            });

            $('#income_total_weekly').text(formatRupiah((data.income_total).toString(), 'Rp. '));
            $('#expense_total_weekly').text(formatRupiah((data.expense_total).toString(), 'Rp. '));
            $('#opening_balance_weekly').text(formatRupiah((data.opening_balance).toString(), 'Rp. '));
            $('#closing_balance_weekly').text(formatRupiah((data.closing_balance).toString(), 'Rp. '));
        }else{
            emptyTable('tb_weekly');
        }
    }

    function monthly_datatable(data) {
        if (data != null) {
            var table_monthly = $('#tb_monthly').DataTable({
                dom: "<'row'<'col-sm-12'tr>>" + "<'px-3 py-3 border-top'<'row'<'col-sm-5'i><'col-sm-7'p>>>",
                ordering: false,
                scrollX: true,
                pagingType: "full_numbers",
                data: data.transactions,
                columns: [
                    { data: 'date' },
                    { data: 'amount' },
                    { data: 'description' },
                    { data: 'type' },
                    { data: 'account__name' },
                    { data: 'category__name' },
                    { data: 'user__username' },
                    { data: 'location__site' },
                ],
                columnDefs: [
                    {
                        targets: 1,
                        render: function (data, type, row) {
                            return formatRupiah((data).toString(), 'Rp. ');
                        }
                    },
                    {
                        targets: 3,
                        render: function (data, type, row) {
                            if (data == 'expense') {
                                return '<span class="badge badge-danger rounded-pill px-2 py-1">Expense</span>';
                            } else {
                                return '<span class="badge badge-success rounded-pill px-2 py-1">Income</span>';
                            }
                        }
                    },
                ],
                initComplete: function () {
                    $('#tb_monthly tbody tr').each(function () {
                        var type = $(this).find('td:eq(3)').text();
                        if (type == 'Expense') {
                            $(this).find('td:eq(1)').addClass('text-danger');
                        } else {
                            $(this).find('td:eq(1)').addClass('text-success');
                        }
                    });
                }
            });
            $('#monthly_search').on('keyup', function(){
                table_monthly.search($(this).val()).draw();
            });

            $('#income_total_monthly').text(formatRupiah((data.income_total).toString(), 'Rp. '));
            $('#expense_total_monthly').text(formatRupiah((data.expense_total).toString(), 'Rp. '));
            $('#opening_balance_monthly').text(formatRupiah((data.opening_balance).toString(), 'Rp. '));
            $('#closing_balance_monthly').text(formatRupiah((data.closing_balance).toString(), 'Rp. '));
        }else{
            emptyTable('tb_monthly');
        }
    }

    function emptyTable(el){
        $('#'+el).DataTable({
            dom: "<'row'<'col-sm-12'tr>>" + "<'px-3 py-3 border-top'<'row'<'col-sm-5'i><'col-sm-7'p>>>",
            language: {
                "emptyTable": "No data available in table. Please select another account."
            },
            pagingType: "full_numbers",
        });
    }

    function generatePDF(data) {
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        // Menambah header tabel
        doc.text("PettyCash Report", 14, 20);
        doc.setFontSize(10);
        doc.setFontStyle("normal");
        doc.setTextColor(40);
        doc.setLineWidth(0.1);
        doc.text("Account : "+data.account , 14, 30);
        doc.text("Period : "+data.period , 14, 35);
        
        // Membuat header tabel
        var tableHeader = [["Date", "Amount", "Description", "Type", "Account", "Category", "User", "Location"]];
        var content = [];

        // Menambah isi tabel
        data.transactions.forEach(function (transaction) {
            content.push(
                [transaction.date, formatRupiah((transaction.amount).toString()), transaction.description, transaction.type, transaction.account__name, transaction.category__name, transaction.user__username, transaction.location__site],
            );
        });

        // Menambah tabel ke PDF
        doc.autoTable({
            head: tableHeader,
            body: content,
            startY: 45,
            tableWidth: 'wrap',
            styles: {
                fontSize: 10,
                cellPadding: 1,
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 30 },
                2: { cellWidth: 50 },
                3: { cellWidth: 30 },
                4: { cellWidth: 30 },
                5: { cellWidth: 40 },
                6: { cellWidth: 30 },
                7: { cellWidth: 30 },
            },
            headstyle: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
            }
        });

        var tableHeader2 = [["Summary", ""]];
        var content2 = [
            ["Total Transaction", data.transactions_count],
            ["Total Expense", formatRupiah((data.expense_total).toString())],
            ["Total Income", formatRupiah((data.income_total).toString())],
            ["Opening Balance", formatRupiah((data.opening_balance).toString())],
            ["Closing Balance", formatRupiah((data.closing_balance).toString())],
        ];

        doc.autoTable({
            head: tableHeader2,
            body: content2,
            startY: 120,
            tableWidth: 'wrap',
            styles: {
                fontSize: 10,
                cellPadding: 1,
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 30 },
            },
            headstyle: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
            }
        });

        // Menyimpan PDF
        var period = data.period;
        doc.save("PettyCash Report ("+period+").pdf");
        Swal.fire('Success', 'Report has been downloaded', 'success');
    }
});