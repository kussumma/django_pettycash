
$(document).ready(function() { 
    // datatable untuk location
    var table = $('#tb_location').DataTable({
        dom: "<'row'<'col-sm-12'tr>>" + "<'px-3 py-3 border-top'<'row'<'col-sm-5'i><'col-sm-7'p>>>",
        ordering: false,
        scrollX: true,
        pagingType: "full_numbers",
        ajax: {
            'url': "/location/ajax/get",
            "dataSrc": '',
            'type': "GET",
        },
        columns: [
            { "data": function(){return ''} },
            { "data": "city" },
            { "data": "area" },
            { "data": "site" },
            { "data": "address" },
            { "data": "description" },
            { "data": function (item) {
                return '<button id="btn_update_location" data="' + item.id + '" type="button" class="btn btn-primary mr-2 rounded"><i class="fa-regular fa-pen-to-square"></i></button>'+
                '<button id="btn_delete_location" data-id="' + item.id + '" type="button" class="btn btn-danger rounded"><i class="fa-regular fa-trash"></i></button>';
            } },
        ],
        fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            $('td:eq(0)', nRow).html(iDisplayIndexFull +1);
        },
    });

    $('#location_search').on('keyup', function(){
        table.search($(this).val()).draw();
    });


    //ADD LOCATION
    $('#add_location').on('click', function(){
        openForm('add-location');
    });

    $('#close_location').on('click', function(){
        closeForm('add-location');
    });

    $("#save_location").on("click", addLocation);

    // function untuk tambah data
    function addLocation() {
        var data = {
            'city': $('#city').val(),
            'area': $('#area').val(),
            'site': $('#site').val(),
            'address': $('#address').val(),
            'description': $('#description').val()
        }

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: '/location/ajax/post',
            type: 'POST',
            data: JSON.stringify(data),
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                if (response.status == 'success') {
                    Swal.fire('Success', response.message, 'success').then(
                        function() {
                            closeForm('add-location');
                            $('#tb_location').DataTable().ajax.reload();
                        }
                    ); 
                } else {
                    Swal.fire('Oopss!', response.message, 'error');
                }
            }
        });
    }
    //END ADD LOCATION

    //DELETE LOCATION
    $(document).on("click", "#btn_delete_location", function(){

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
                    url: "/location/ajax/delete",
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

    //END DELETE LOCATION

    // GET DETAIL LOCATION
    $('#close_update_location').on('click', function(){
        closeForm('update-location');
    });

    $(document).on('click','#btn_update_location', function(){
        openForm('update-location');
        
        var id = $(this).attr('data');

        $.ajax({
            url: "/location/ajax/get/" + id,
            type: 'GET',
            success: function(response) {
                if (response.status == 'success') {
                    var loc = response.data;
                    $('#eid').val(loc.id);
                    $('#ecity').val(loc.city);
                    $('#earea').val(loc.area);
                    $('#esite').val(loc.site);
                    $('#eaddress').val(loc.address);
                    $('#edescription').val(loc.description);
                } else {
                    Swal.fire('Oopss!', response.message, 'error').then(
                        function() {
                            closeForm('update-location');
                        }
                    ); 
                }
            }
        });
    });

    // UPDATE LOCATION
    $("#update_location").on("click", function(){

        var data = {
            'id': $('#eid').val(),
            'city': $('#ecity').val(),
            'area': $('#earea').val(),
            'site': $('#esite').val(),
            'address': $('#eaddress').val(),
            'description': $('#edescription').val()
        }

        var csrftoken = getCookie('csrftoken');

        $.ajax({
            url: "/location/ajax/update",
            type: 'PUT',
            data: JSON.stringify(data),
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                if (response.status == 'success') {
                    Swal.fire('Success!', response.message, 'success').then(
                        function() {
                            closeForm('update-location');
                            $('#tb_location').DataTable().ajax.reload();
                        }
                    ); 
                } else {
                    Swal.fire('Oopss!', response.message, 'error').then(
                        function() {
                            closeForm('update-location');
                        }
                    ); 
                }
            }
        });
    });
    //END UPDATE LOCATION
});