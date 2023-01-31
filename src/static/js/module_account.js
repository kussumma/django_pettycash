
$(document).ready(function() { 
    // datatable untuk account
    var table = $('#tb_account').DataTable({
        dom: "<'row'<'col-sm-12'tr>>" + "<'px-3 py-3 border-top'<'row'<'col-sm-5'i><'col-sm-7'p>>>",
        ordering: false,
        scrollX: true,
        pagingType: "full_numbers",
        ajax: {
            'url': "/account/ajax/get",
            "dataSrc": '',
            'type': "GET",
        },
        columns: [
            { "data": function(){return ''} },
            { "data": "name" },
            { "data": function (item) { return formatRupiah( (item.balance).toString(), 'Rp.' ) } },
            { "data": "description" },
            { "data": "group__name" },
            { "data": function (item) {
                return '<button id="btn_update_account" data="' + item.id + '" type="button" class="btn btn-primary mr-2 rounded"><i class="fa-regular fa-pen-to-square"></i></button>'+
                '<button id="btn_delete_account" data-id="' + item.id + '" type="button" class="btn btn-danger rounded"><i class="fa-regular fa-trash"></i></button>';
            } },
        ],
        fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            $('td:eq(0)', nRow).html(iDisplayIndexFull +1);
        },
    });

    $('#account_search').on('keyup', function(){
        table.search($(this).val()).draw();
    });

    //END DATATABLE ACCOUNT

    // GET ALL GROUP
    function getAllGroup() {
        $.ajax({
            url: "/account/ajax/get/group",
            type: 'GET',
            success: function(response) {
                if (response.status == 'success') {
                    var group = response.data;
                    var html = '';
                    for (var i = 0; i < group.length; i++) {
                        html += '<option value="' + group[i].id + '">' + group[i].name + '</option>';
                    }
                    $('#account_group').html(html);
                    $('#eaccount_group').html(html);
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }

    //ADD ACCOUNT
    $('#add_account').on('click', function(){
        openForm('add-account');
        getAllGroup();

        $('#account_balance').on('keyup', function(){
            var val = $(this).val();
            $(this).val(formatRupiah(val));
        });
    
    });

    $('#close_account').on('click', function(){
        closeForm('add-account');
    });


    $("#save_account").on("click", addAccount);

    // function untuk tambah data
    function addAccount() {
        var data = {
            'name': $('#account_name').val(),
            'balance': $('#account_balance').val(),
            'description': $('#account_description').val(),
            'group': $('#account_group').val()
        }

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: '/account/ajax/post',
            type: 'POST',
            data: JSON.stringify(data),
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                if (response.status == 'success') {
                    Swal.fire('Success', response.message, 'success').then(
                        function() {
                            closeForm('add-account');
                            $('#tb_account').DataTable().ajax.reload();
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
    $(document).on("click", "#btn_delete_account", function(){

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
                    url: "/account/ajax/delete",
                    type: 'DELETE',
                    data: JSON.stringify(data),
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    success: function(response) {
                        if (response.status == 'success') {
                            Swal.fire('Success', response.message, 'success').then(
                                function() {
                                    $('#tb_location').DataTable().ajax.reload();
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
    $('#close_update_account').on('click', function(){
        closeForm('update-account');
    });

    $(document).on('click','#btn_update_account', function(){
        openForm('update-account');
        getAllGroup();

        $('#ebalance').on('keyup', function(){
            var val = $(this).val();
            $(this).val(formatRupiah(val));
        });
        
        var id = $(this).attr('data');

        $.ajax({
            url: "/account/ajax/get/" + id,
            type: 'GET',
            success: function(response) {
                if (response.status == 'success') {
                    var acc = response.data;
                    $('#eid').val(acc.id);
                    $('#ename').val(acc.name);
                    $('#ebalance').val(acc.balance);
                    $('#eaccount_group').val(acc.group).change();
                    $('#edescription').val(acc.description);
                } else {
                    Swal.fire('Oopss!', response.message, 'error').then(
                        function() {
                            closeForm('update-account');
                        }
                    ); 
                }
            }
        });
    });

    // UPDATE ACCOUNT
    $("#update_account").on("click", function(){

        var data = {
            'id': $('#eid').val(),
            'name': $('#ename').val(),
            'balance': $('#ebalance').val(),
            'group': $('#eaccount_group').val(),
            'description': $('#edescription').val()
        }

        var csrftoken = getCookie('csrftoken');

        $.ajax({
            url: "/account/ajax/update",
            type: 'PUT',
            data: JSON.stringify(data),
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                if (response.status == 'success') {
                    Swal.fire('Success!', response.message, 'success').then(
                        function() {
                            closeForm('update-account');
                            $('#tb_account').DataTable().ajax.reload();
                        }
                    ); 
                } else {
                    Swal.fire('Oopss!', response.message, 'error').then(
                        function() {
                            closeForm('update-account');
                        }
                    ); 
                }
            }
        });
    });
    //END UPDATE ACCOUNT
});