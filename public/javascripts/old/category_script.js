var categories = 
{
	nightlife: ['clubbing', 'bar', 'party', 'jazz', 'kappa'],
	sports: ['football', 'basketball', 'tennis', 'esports'],
	seminars: [],
	entertainment: ['opera', 'comedy'],
	nature: ['hiking', 'rock climbing', 'kayaking'],
	tech: [],
	music: ['concert'],
	travelling: ['city', 'resort', 'adventure', 'work'],
	creative: ['painting', 'sculpting'],
	culinary: ['food', 'wine tasting']
}

var category = $("#category").text().toLowerCase();

var subs = categories[category].length;

for (var d = 0; d < 26; d++) {
	var rng = Math.round(Math.random() * ((subs-1) - 0) + 0);
	$("#category_events").append('<a href="/event/1" class="event '+categories[category][rng]+'" style="background:'+createRGB()+'"></a>');
}

$('.sub').on('click', function() {
	console.log(this.id);
	$('.event').hide();
	$('.'+this.id).show();
});