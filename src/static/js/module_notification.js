$(document).ready(function() {
    
    // GET NOTIFICATION
    var socket = new WebSocket('ws://' + window.location.host + '/notifications/');

    socket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        console.log(data);
        if (data.notification_count > 0) {
            $('#notifbadge').removeClass('d-none');
            var  count = parseInt($('#notifbadge').text());
            var new_count = count + data.notification_count;
            $('#notifbadge').html(new_count);
        }
    };

});