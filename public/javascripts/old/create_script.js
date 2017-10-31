var categories = 
{
  nightlife: ['clubbing', 'bar', 'party', 'jazz', 'kappa'],
  sports: ['football', 'basketball', 'tennis', 'esports'],
  seminars: [],
  entertainment: ['opera', 'comedy'],
  nature: ['hiking', 'rock climbing', 'kayacking'],
  tech: [],
  music: ['concert'],
  travelling: ['city', 'resort', 'adventure', 'work'],
  creative: ['painting', 'sculpting'],
  culinary: ['food', 'wine tasting']
}


$("select[name='category']").on("change", function() {
  
  var cat = $(this).val();

  var subs = categories[cat.toLowerCase()];
  
  if (subs.length !== 0) {
    $("select[name='subcategory']").show();
    
    $("select[name='subcategory']").empty();
  
    $.each(subs, function(i, sub) {
      $("select[name='subcategory']").append('<option>'+sub+'</option>');
    });
  }

});


// CREATE TEAM
$('#formCreateTeam').on('submit', function(event) {
	event.preventDefault();
	
	var data = $(this).serialize();
	$.post('/create/team', data, function(res) {
    if (res === "error" || res === "Name already taken") {
		  popupMessage(res);
    } else {
      window.location.href = res;
    }
	});
});