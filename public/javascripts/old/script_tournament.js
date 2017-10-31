// Set .stage width
$(".stage").css("width", 100/$("#playoffs").children().length + "%" )

// Set .match height
$(".stage").each(function(){
    var l = $(this).children().length-1;
    $(this).children(".match").css("height", 100 / l + "%");
});