$('#local').on('click', function() {
	$('#loginswag').fadeOut(function() {
		$('#login_signup').fadeIn();
	});
});


$('.fa-chevron-down').on('click', function() {
	$('body').animate({
		scrollTop : 400
	}, 1000);
});

$(".attend").on("click", function() {
	console.log( "Unattend: " + $(this).parents(".temp")[0].id );
});



/*---------------------
----------AJAX---------
---------------------*/
// search
$('.fa-search').on('click', function() {
	$.ajax({
		type: 'get',
		url: '/search?q='+$('#inputEvent').val()
	});
});
// event settings
$('#form_settings').on('submit', function(event) {
	event.preventDefault();
	var data = $('#form_settings').serialize();
	$.post('/event/settings', data, function(res) {
		popupMessage(res);
	});
});
// attend event
$('#event_attend, .attend').on('click', function() {
	var self = $(this);
	$.ajax({
		method: "post", 
		url: "/pug/attend", 
		//data: {action: 'attend', event_id: window.location.pathname.replace('/event/', '')} 
		data: {action: 'attend', event_id: self.parents(".temp")[0].id} 
	}).done(function(response){
		popupMessage(response);
		self.children("h3").text("Unattend");
		self.addClass("unattend").removeClass("attend");
	});
});

// un-attend event
$('#event_un-attend, .pugActions').on('click', '.unattend', function() {
	var self = $(this);
	$.ajax({
		method: "post", 
		url: "/pug/attend", 
		//data: {action: 'un-attend', event_id: window.location.pathname.replace('/event/', '')} 
		data: {action: 'un-attend', event_id: self.parents(".temp")[0].id} 
	}).done(function(response){
		popupMessage(response);
		self.children("h3").text("Attend");
		self.addClass("attend").removeClass("unattend");
	});
});
// change event privacy status
$('#event_private').on('click', function() {
	$.ajax({
		method: "post", 
		url: "/event/private", 
		data: { event_id: window.location.pathname.replace('/event/', '') } 
	}).done(function(response){
		popupMessage(response);
	});
});
// deletes event
$('#event_delete').on('click', function() {
	if (confirm('Are you sure you wish to permanently delete this event?') ) {
		var url = window.location.pathname;
		var re = /event\/(.+)\//;
		var event_id = re.exec(url)[1];
		$.ajax({
			method: "post", 
			url: "/event/delete", 
			data: { event_id: event_id } 
		}).done(function(response){
			window.location.href = "/";
		});
	}	
});
// votes on poll
$('.poll form').on('submit', function(event) {
	event.preventDefault();
	$.ajax({
		url: '/poll/vote',
		type: 'post',
		data: 
		{ 
			event_id: window.location.pathname.replace('/event/', ''),
			poll_id: this.id,
			choice: $(this).children('select').val()
		}	
	}).done(function(response){
		popupMessage(response);
	});
});
// send message on event
$('#form_messages input[type="submit"]').on('click', function(event) {
	event.preventDefault();
	var message = $('#form_messages input[name="message"]').val();
	$.ajax({
		url: '/messages',
		type: 'post',
		data: { message: message, event_id: $('#form_messages input[name="event_id"]').val() }	
	}).done(function(response){
		popupMessage(response);
		$('#chat_messages').prepend('<li><img src="/images/profile_default_green.png" id="chat_image"><p class="chat_sender">'+user.firstName + ' ' + user.lastName + ' ' + Date() +'</p><p class="chat_message">'+message+'</p></li>');
	});
});
// invite person to event
$('#form_invite').on('submit', function(event) {
	event.preventDefault();
	$.ajax({
		url: '/event/invite',
		type: 'post',
		data: 
		{ 
			event_id: window.location.pathname.replace('/event/', ''),
			username:  $('#form_invite input[name="username"]').val()
		}	
	}).done(function(response){
		popupMessage(response);
	});
});
// changes users settings
$('#form_user_settings').on('submit', function(event) {
	event.preventDefault();
	
	var data = $(this).serialize();
	$.post('/settings', data, function(res) {
		popupMessage(res);
	});
});

// changes users custom url
$('#form_url input[type="submit"]').on('click', function(event) {
	event.preventDefault();
	if ($('#form_url input[name="url"]').val() !== "") {
		$.ajax({
			url: '/url',
			type: 'post',
			data: { url: $('#form_url input[name="url"]').val() }	
		}).done(function(response){
			popupMessage(response);
		});
	} else {
		popupMessage('Must enter something');
	}
});




/* SHOW POPUP LOGIN */
$('#popup_login_button').on('click', function() {
	$('#shader, #popup_login').show();
});


var previewImage = function(event) {
	input = event.target;
	reader = new FileReader();
	reader.onload = function(){
		var dataURL = reader.result;
		$("#previewImages").append("<img src='"+dataURL+"'>");
	};
	reader.readAsDataURL(input.files[0]);
};


/* MORE EVENT INFO*/
/*
$('.event').on({
	mouseenter: function() {
		$(this).children('div').animate({'height':'100%'});
	}, 
	mouseleave: function() {
		$(this).children('div').animate({'height':'30px'});
	}
})
*/

/* show social */
$('#socials .fa').on({
	mouseenter: function() {
		$(this).children('a').show();
	},
	mouseleave: function() {
		$(this).children('a').hide();
	}
});



/*Invite*/
$('#invite_button').on('click', function() {
	$('#shader, #invite').show();
});

$('#shader').on('click', function() {
	$('#shader, #invite, #image_container, #popup_login').hide();
});


/*POPUP MESSAGE*/
function popupMessage(msg) {
	$('header').animate({'top':'30px'}, 1000);
	$('#popup_message').show().animate({'top':'0'}, 1000);
	$('#popup_message').text(msg);
	setTimeout(function(){
		$('header').animate({'top':'0'}, 1000);
		$('#popup_message').animate({'top':'-30px'}, 1000);
	}, 5000);
}



/*SHOW POLL FORM*/
$('#event_poll').on('click', function() {
	$('#form_poll').toggle();
});

/*FIX MESSAGE DATES*/
function convert(str) {
	var re = /\/(.+)\//;
	var clean = re.exec(str)[0];
	var date = new Date(clean).toString('d/M/yy HH:mm');
	return str.replace(re, date);
}


$('#chat_messages .chat_sender').each(function(){ 
	$(this).text( convert( $(this).text() ) );
});

/*SEARCH PLACEHOLDER*/
/*
(function() {
	var items = ['events', 'people', 'articles'];
	var input = $('#inputEvent');
	var i = 0;		
	setInterval(function() {
		input.attr('placeholder', 'Search ' + items[i]);
		i++;
		if (i == items.length) {
			i = 0;
		}
	}, 3000);			
})();
*/
/*
(function() {
	var items = ['events', 'people', 'articles'];
	var input = $('#inputEvent');
	
	var i = 0; // item	
	setInterval(function() {
		var l = 0; // letter
		setInterval(function() {
			var old = input.attr('placeholder'); // old placeholder
			input.attr('placeholder', old += items[i][l]); // updated placeholder
			l++;
			if (l == items[i].length) { // if current letter doesn't exist
				return;
			}
		}, 300); // each 300 ms
		i++;
		console.log('i was incremented');
		if (i == items.length) { // if current item doesn't exist
			i = 0; // reset item iteration count
			console.log('i was reset');
		}
	}, 3000); // each 3000 ms			
})();
*/
/*
(function() {
	var items = ['events', 'people', 'articles'];
	var input = $('#inputEvent');
	for (var i = 0; i < items.length; i++) {
		(function myLoop (i) {          
			setTimeout(function () {   
				console.log(i);        //  your code here                
				if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
			}, 3000)
		})(items[i].length); 
	}		
})();


(function myLoop (i) {          
	setTimeout(function () {   
		console.log(items[0][i-1]);        //  your code here                
		if (++i) myLoop(i);      //  decrement i and call myLoop again if i > 0
	}, 1000)
})(items[0].length); 



(function myLoop (i) {          
	setTimeout(function () {   
		console.log(items[0][i-1]);        //  your code here                
		if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
	}, 1000)
})(items[0].length); 
*/

/*
var items = [' events', 'people', 'articles'];
var input = $('#inputEvent');
(function myLoop (i, c) {        
	setTimeout(function () {   
		console.log(items[0][c]);
		var old = input.attr('placeholder'); // old placeholder
		input.attr('placeholder', old += items[0][c]); // updated placeholder     
		if (++c < i) myLoop(i, c);
	}, 200)
})(items[0].length, 0);
*/


$(".selector").on({
	mouseenter: function() {
		//$(this).children().css("display", "inline-block");
		$(this).children().show();
		$(this).children(".selectorTitle").hide();	
	}, mouseleave: function() {
		$(this).children().hide();	
		$(this).children(".selectorTitle").show();
	}
});


// Binds and Centers createDropdown below menuCreate
$('#menu').on('click', '#menuCreate', function() {
	$('.dropdownMenu').hide();
	$('#createDropdown').show();
});
$("#createDropdown").css("right", 210 + parseInt($("#menu").css("width")));

// Binds and Centers notificationsDropdown below menuNotifications
$('.fa-bell').on('click', function() {
	$('.dropdownMenu').hide();
	$('#notification_dropdown').show();
});

// Binds and Centers profileDropdown below menuProfile
$('#menu').on('click', '#menuProfile', function() {
	$('.dropdownMenu').hide();
	$('#profileDropdown').show();
});
$("#profileDropdown").css("right", 220 + parseInt($("#menuProfile").css("width"))/2);