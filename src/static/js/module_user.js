
// Get Profile
$.ajax({
    url: "/user/ajax/profile",
    dataType: "JSON",
    type: "GET",
    beforeSend: function() {
        $("#avatar_loading").attr('class', 'spinner-border text-purple d-block');
        $("#user_avatar").attr('class', 'avatar d-none');
    },
    success: function(data) {
        if (data.status == 'success') {
            $("#avatar_loading").attr('class', 'spinner-border text-purple d-none');
            $("#user_avatar").attr('class', 'avatar d-block');
            $('#user_avatar').attr('src', '/static/images/avatar.png');

            $('#user_name').html(data.data.first_name + ' ' + data.data.last_name);

            var level = '';
            if (data.data.is_superuser == true) {
                level = 'Superuser';
            } else {
                level = 'Staff';
            }

            $('#user_level').html(level);

            $('#data_firstname').val(data.data.first_name);
            $('#data_lastname').val(data.data.last_name);
            $('#data_email').val(data.data.email);
            $('#data_username').val(data.data.username);

        } else {
            Swal.fire('Oopss!', 'Unable to fetch data!', 'error');
        }
    }
});


    var calendarEl = document.getElementById('calendar-view');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayMaxEvents: true,
        buttonIcons: false,
        buttonText: {
            next: '>',
            prev: '<',
        },
        themeSystem: 'bootstrap',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
    });

    $('#menu_personal').on('click', function(){
        $(this).addClass('active');
        $(this).next().addClass('bg-purple');

        $('#menu_calendar').removeClass('active');
        $('#menu_calendar').next().removeClass('bg-purple');
        
        $('#personal-container').attr('style', 'display: block !important;');
        $('#calendar-container').attr('style', 'display: none !important;');
    });

    $('#menu_calendar').on('click', function(){
        $(this).addClass('active');
        $(this).next().addClass('bg-purple');

        setTimeout(function(){
            calendar.render();
        }, 1);

        $('#menu_personal').removeClass('active');
        $('#menu_personal').next().removeClass('bg-purple');

        $('#personal-container').attr('style', 'display: none !important;');
        $('#calendar-container').attr('style', 'display: block !important;');
    });