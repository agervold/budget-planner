/*
$(".categories > li").on({
    mouseenter: function() {
        //$(this).find("ul").stop().animate({height: "150px"});
        var ul = $(this).find("ul");
        if (ul.children().length > 0)
        ul.stop().slideDown("slow");
    }, mouseleave: function() {
        //$(this).find("ul").stop().animate({height: "0"});
        var ul = $(this).find("ul");
        if (ul.children().length > 0)
        ul.stop().slideUp("slow");
    }
});

$(".categories > li ul").slideUp("fast");
*/

$(".category").click(function() {
    $(this).find(".outline").toggle();
    $(this).find(".full").toggle();
});

$("button").click(function() {
    var t = $(this);
    if (t.text() == "NEXT") {
        $("h3").text("Set your Starting Balance");
        $("h4").text("Optionally set your starting balance so we can more properly calculate your ending balance throughout");
        $("#categories").hide();
        $("#balance").show();
        t.text("COMPLETE");
    } else {
        location.href = "/";
    }
});