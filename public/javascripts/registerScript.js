/*
if($("#status_message").length) {
    $("#form_register").submit();
} else {
    $("#form_login").submit();
}
*/

$(".input-effect input").focusout(function(){
    if($(this).val() != "") {
        $(this).addClass("has-content");
    } else {
        $(this).removeClass("has-content");
    }
    if ($(".has-content").length == 2) {
        $("input[type='submit']").removeClass("disabled");
    } else {
        $("input[type='submit']").addClass("disabled");
    }
});

$(".ion-chevron-down").click(function() {
    window.scrollTo(0,200);
});