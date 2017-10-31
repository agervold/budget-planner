var sections = $(".section").length;


function createRGB() {
	return 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
}


function createEvent() {
	return $('<a href="/event/1" class="event" style="background:'+createRGB()+'"><div></div></a>');
}

// for each .section
for (var d = 2; d < sections-2; d++) {
	// loops 4-9 times
	for (var n = 0; n < Math.round(Math.random() * (20 - 6) + 6); n++) {
		createEvent().appendTo($(".section")[d]);
	}
}

for (var d = 0; d < 6; d++) {
	$("#featured_events").append('<a href="/event/1" class="event" style="background:'+createRGB()+'"><div></div></a>');
}




/*
$("#messageForm").submit(function(event){
    event.preventDefault();

    var formData = new FormData($(this)[0]);

    $.ajax({
        url: 'http://fwra.me/templates/organizer/messageScript.php',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log("Message Posted");
            var post = $('.status-box').val();
            $('<li>').html(data + post).prependTo('.posts');
            $('.status-box').val('');
            $('.counter').text('140');
            $('#postButton').prop("disabled", true);
        }
    });
    return false;
});


var total = 0;
var results = [];

$('.poll').children('.poll_choice').children('.poll_choice_percent').each(function(){
	total += parseInt( $(this).text() );
	results.push( parseInt( $(this).text() ) );
});

function createPoll(a,b,c){
	var total = a + b + c;

	var a_p = a / total;
	var b_p = b / total;
	var c_p = c / total;

	var total_width = 300;

	var a_w = total_width * a_p;
	var a_w2 = a_w.toString() + "px";

	var b_w = total_width * b_p;
	var b_w2 = b_w.toString() + "px";

	var c_w = total_width * c_p;
	var c_w2 = c_w.toString() + "px";

	$("#bar1").css("width", a_w2);
	$("#bar2").css("width", b_w2);
	$("#bar3").css("width", c_w2);

	//$("#bar1").siblings(".count").text( $("#bar1").siblings(".count").text() + " votes (" + Math.round(a_p*100) + "%)" );
    //$("#bar2").siblings(".count").text( $("#bar2").siblings(".count").text() + " votes (" + Math.round(b_p*100) + "%)" );
    //$("#bar3").siblings(".count").text( $("#bar3").siblings(".count").text() + " votes (" + Math.round(c_p*100) + "%)" );
}

createPoll(results[0], results[1], results[2]);
*/


