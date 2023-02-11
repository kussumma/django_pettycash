
// FORM OPEN
function openForm(el) {
    var el = $('#' + el);
    el.css('display', 'block');
}
// END FORM OPEN

// FORM CLOSE
function closeForm(el) {
    var el = $('#' + el);
    el.css('display', 'none');
  }
// END FORM CLOSE

// SELECT2
$('.js-example-basic-single').select2({
	theme: 'bootstrap4',
	allowClear: false
});
// END SELECT2

// CSRF TOKEN
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
} 
// END CSRF TOKEN

// FORMAT RUPIAH
function formatRupiah(angka, prefix) {
	if(angka != null) {
		var number_string = angka.replace(/[^,\d]/g, "").toString(),
			split = number_string.split(","),
			sisa = split[0].length % 3,
			rupiah = split[0].substr(0, sisa),
			ribuan = split[0].substr(sisa).match(/\d{3}/gi);
		if(ribuan) {
			separator = sisa ? "." : "";
			rupiah += separator + ribuan.join(".");
		}
		rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
		return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
	}
}
// END FORMAT RUPIAH 

// SIDE BAR
var currentLocation = window.location.pathname;
  
$('.sidebar a').each(function() {
	var linkLocation = $(this).attr('href');

	if (linkLocation == currentLocation) {
		$(this).addClass('text-purple');
		$(this).removeClass('text-secondary');
	}
});

// CUSTOM FILE INPUT
$(document).on("change", ".custom-file-input", function(e) {
	var fileName = e.target.files;
	var fname = [];
	for (i=0; i<fileName.length; i++){
		fname.push(fileName[i].name)
	}
	$(this).siblings(".custom-file-label").addClass("selected").html(fname.join(', '));
});