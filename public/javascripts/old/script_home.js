document.getElementById("searchDistance").min = 1;
document.getElementById("searchDistance").max = 20;
$("#searchDistance").on("change", function() {
	$("#searchDistanceDisplay").text(this.value + "km");
});


$("#mapControls .close_container").on("click", function() {
    $("#mapControls").hide();
    $(".fa-filter").show();
});
$(".fa-filter").on("click", function() {
    $("#mapControls").show();
    $(this).hide();
});


$("#pugs .close_container:eq(0)").on("click", function() {
    $("#pugs").hide();
    $(".fa-list").show();
});
$(".fa-list").on("click", function() {
    $("#pugs").show();
    $(this).hide();
});

var pugInfoHidden = true;

$("#pugList li").on("click", function() {
    var id = this.id.split("_")[1];
    showPugInfo(id);
});

$(".temp .close_container").on("click", function() {
    hidePugInfo();
});

function showPugInfo(id) {
    $("#pugList").animate({right: 300}, 500); 
    $("#pugInfo").animate({right: 0}, 500); 
    $("#"+id).show();
    pugInfoHidden = false;
}

function hidePugInfo() {
    $("#pugInfo").animate({right: -300}, 500, function() {
        $(".temp:visible").hide();
    }); 
    $("#pugList").animate({right: 0}, 500);  
    pugInfoHidden = true;
}

function showNewPugInfo(id) {
    $(".temp:visible").hide();
    $("#"+id).show();
}