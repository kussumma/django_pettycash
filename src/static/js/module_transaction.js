
$(document).ready(function () {
    // datatable untuk transaksi
    var table = $('#tb_transaction').DataTable({
        dom: "<'row'<'col-sm-12'tr>>" + "<'px-3 py-3 border-top'<'row'<'col-sm-5'i><'col-sm-7'p>>>",
        ordering: false,
        scrollX: true,
        pagingType: "full_numbers",
        ajax: {
            'url': "/transaction/ajax/get",
            "dataSrc": '',
            'type': "GET",
        },
        columns: [
            { "data": function () { return '' } },
            { "data": "date" },
            { "data": "amount" },
            { "data": "description" },
            { "data": "type" },
            { "data": "account__name" },
            { "data": "category__name" },
            { "data": "user__username" },
            { "data": "location__site" },
            { "data": function(item){
                if (item.receipt != null) {
                    var binaryData = atob(item.receipt);
                    var arrayBuffer = new ArrayBuffer(binaryData.length);
                    var uint8Array = new Uint8Array(arrayBuffer);
                    for (var i = 0; i < binaryData.length; i++) {
                        uint8Array[i] = binaryData.charCodeAt(i);
                    }
                    var blob = new Blob([uint8Array], {type: "image/jpeg"});
                    var imageUrl = URL.createObjectURL(blob);
                } else {
                    var imageUrl = '/static/images/no-image.jpg';
                }

                return "<img on style='width: 40px; height: 40px; border-radius: 8px; cursor: pointer;' src='" + imageUrl + "' id='viewImage' />";
            }},
            {
                "data": function (item) {
                    return '<button id="btn_update_transaction" data="' + item.id + '" type="button" class="btn btn-primary mr-2 rounded"><i class="fa-regular fa-pen-to-square"></i></button>' +
                        '<button id="btn_delete_transaction" data-id="' + item.id + '" type="button" class="btn btn-danger rounded"><i class="fa-regular fa-trash"></i></button>';
                }
            },
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(0)', nRow).html(iDisplayIndexFull + 1);
        },
        columnDefs: [
            {
                targets: 2,
                render: function (data, type, row) {
                    return formatRupiah((data).toString(), 'Rp. ');
                }
            },
            {
                targets: 4,
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
            $('#tb_transaction tbody tr').each(function () {
                var type = $(this).find('td:eq(4)').text();
                if (type == 'Expense') {
                    $(this).find('td:eq(2)').addClass('text-danger');
                } else {
                    $(this).find('td:eq(2)').addClass('text-success');
                }
            }); 
        }
    });

    $(document).on('click', '#viewImage', viewImage);
    $(document).on('click', '#current_trxreceipt', viewImage);

    function viewImage() {
        var link = $(this).attr('src');
        Swal.fire({
            imageUrl: link,
            width: '40rem',
            padding: '2rem',
            imageAlt: 'receipt',
            showConfirmButton: false,
            showCloseButton: true,
        });
    }  
 

    $('#transaction_search').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    //END DATATABLE TRANSACTION

    // GET ALL ACCOUNT
    function getAllAccount() {
        $.ajax({
            url: "/account/ajax/get",
            type: 'GET',
            success: function (response) {
                if (response != null) {
                    var account = response;
                    var html = '';
                    for (var i = 0; i < account.length; i++) {
                        html += '<option value="' + account[i].id + '">' + account[i].name + '</option>';
                    }
                    $('#trx_account').html(html);
                    $('#etrx_account').html(html);
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }

    // GET ALL CATEGORY
    function getAllCategory() {
        $.ajax({
            url: "/transaction/ajax/get/category",
            type: 'GET',
            success: function (response) {
                if (response.status == 'success') {
                    var category = response.data;
                    var html = '';
                    for (var i = 0; i < category.length; i++) {
                        html += '<option value="' + category[i].id + '">' + category[i].name + '</option>';
                    }
                    $('#trx_category').html(html);
                    $('#etrx_category').html(html);
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }

    function getAllUser() {
        $.ajax({
            url: "/user/ajax/get",
            type: 'GET',
            success: function (response) {
                if (response != null) {
                    var user = response;
                    var html = '';
                    for (var i = 0; i < user.length; i++) {
                        html += '<option value="' + user[i].id + '">' + user[i].username + '</option>';
                    }
                    $('#trx_user').html(html);
                    $('#etrx_user').html(html);
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }

    function getAllLocation() {
        $.ajax({
            url: "/location/ajax/get",
            type: 'GET',
            success: function (response) {
                if (response != null) {
                    var location = response;
                    var html = '';
                    for (var i = 0; i < location.length; i++) {
                        html += '<option value="' + location[i].id + '">' + location[i].site + '</option>';
                    }
                    $('#trx_location').html(html);
                    $('#etrx_location').html(html);
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }

    function getAllType() {
        var type = [
            {
                id: 'income',
                name: 'Income',
            },
            {
                id: 'expense',
                name: 'Expense',
            }
        ]

        var html = '';
        for (var i = 0; i < type.length; i++) {
            html += '<option value="' + type[i].id + '">' + type[i].name + '</option>';
        }
        $('#trx_type').html(html);
        $('#etrx_type').html(html);
    }

    //ADD TRANSACTION
    $('#add_transaction').on('click', function () {
        openForm('add-transaction');

        getAllType();
        getAllAccount();
        getAllCategory();
        getAllUser();
        getAllLocation();

        $('#trx_amount').on('keyup', function () {
            var val = $(this).val();
            $(this).val(formatRupiah(val));
        });

    });

    $('#close_transaction').on('click', function () {
        closeForm('add-transaction');
    });


    $("#save_transaction").on("click", addTransaction);

    // function untuk tambah data
    function addTransaction() {

        var receipt = $('#trx_receipt')[0].files[0];
        var formData = new FormData();
        formData.append('date', $('#trx_date').val());
        formData.append('amount', $('#trx_amount').val());
        formData.append('description', $('#trx_description').val());
        formData.append('type', $('#trx_type').val());
        formData.append('account', $('#trx_account').val());
        formData.append('category', $('#trx_category').val());
        formData.append('location', $('#trx_location').val());
        formData.append('user', $('#trx_user').val());
        formData.append('receipt', receipt);

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: '/transaction/ajax/post',
            type: 'POST',
            contentType: false,
            processData: false,
            dataType: 'json',
            mimeType: "multipart/form-data",
            data: formData,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function (response) {
                console.log(response);
                if (response.status == 'success') {
                    Swal.fire('Success', response.message, 'success').then(
                        function () {
                            closeForm('add-transaction');
                            $('#tb_transaction').DataTable().ajax.reload();
                        }
                    );
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }
    //END ADD ACCOUNT

    //DELETE ACCOUNT
    $(document).on("click", "#btn_delete_transaction", function () {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var id = $(this).attr('data-id');
                var csrftoken = getCookie('csrftoken');

                var data = {
                    'id': id
                }

                $.ajax({
                    url: "/transaction/ajax/delete",
                    type: 'DELETE',
                    data: JSON.stringify(data),
                    beforeSend: function (xhr, settings) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    success: function (response) {
                        if (response.status == 'success') {
                            Swal.fire('Success', response.message, 'success').then(
                                function () {
                                    $('#tb_transaction').DataTable().ajax.reload();
                                }
                            );
                        } else {
                            Swal.fire('Oopss!', response.message, 'error');
                        }
                    }
                });
            }
        });

    });

    //END DELETE ACCOUNT

    // GET DETAIL ACCOUNT
    $('#close_update_transaction').on('click', function () {
        closeForm('update-transaction');
    });

    $(document).on('click', '#btn_update_transaction', function () {
        openForm('update-transaction');

        getAllType();
        getAllAccount();
        getAllCategory();
        getAllUser();
        getAllLocation();

        $('#etrx_amount').on('keyup', function () {
            var val = $(this).val();
            $(this).val(formatRupiah(val));
        });

        var id = $(this).attr('data');

        $.ajax({
            url: "/transaction/ajax/get/" + id,
            type: 'GET',
            success: function (response) {
                if (response.status == 'success') {
                    var trx = response.data;
                    $('#eid').val(trx.id);
                    $('#etrx_date').val(trx.date);
                    $('#etrx_amount').val(trx.amount);
                    $('#etrx_description').val(trx.description);
                    $('#etrx_type').val(trx.type).change();
                    $('#etrx_account').val(trx.account).change();
                    $('#etrx_category').val(trx.category).change();
                    $('#etrx_location').val(trx.location).change();
                    $('#etrx_user').val(trx.user).change();

                    if (trx.receipt != null) {
                        var binaryData = atob(trx.receipt);
                        var arrayBuffer = new ArrayBuffer(binaryData.length);
                        var uint8Array = new Uint8Array(arrayBuffer);
                        for (var i = 0; i < binaryData.length; i++) {
                            uint8Array[i] = binaryData.charCodeAt(i);
                        }
                        var blob = new Blob([uint8Array], {type: "image/jpeg"});
                        var imageUrl = URL.createObjectURL(blob);

                        $('#current_trxreceipt').attr('src', imageUrl);

                    } else {
                        $('#current_trxreceipt').html('No Receipt, please upload the new one.');
                    }

                } else {
                    Swal.fire('Oopss!', response.message, 'error').then(
                        function () {
                            closeForm('update-transaction');
                        }
                    );
                }
            }
        });
    });

    // UPDATE TRANSACTION
    $("#update_transaction").on("click", function () {

        var receipt = $('#etrx_receipt')[0].files[0];
     
        var formData = new FormData();
        formData.append('id', $('#eid').val());
        formData.append('date', $('#etrx_date').val());
        formData.append('amount', $('#etrx_amount').val());
        formData.append('description', $('#etrx_description').val());
        formData.append('type', $('#etrx_type').val());
        formData.append('account', $('#etrx_account').val());
        formData.append('category', $('#etrx_category').val());
        formData.append('location', $('#etrx_location').val());
        formData.append('user', $('#etrx_user').val());
        formData.append('receipt', receipt);

        var csrftoken = getCookie('csrftoken');

        $.ajax({
            url: "/transaction/ajax/update",
            type: 'POST',
            contentType: false,
            processData: false,
            dataType: 'json',
            mimeType: "multipart/form-data",
            data: formData,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function (response) {
                if (response.status == 'success') {
                    Swal.fire('Success!', response.message, 'success').then(
                        function () {
                            closeForm('update-transaction');
                            $('#tb_transaction').DataTable().ajax.reload();
                        }
                    );
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    });
    //END UPDATE TRANSACTION

});