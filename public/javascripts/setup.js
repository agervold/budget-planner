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
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $(this).addClass("selected");
    }
});

var step = "income";
$("button").click(function() {
    var t = $(this);
    if (step == "income") {
        //$("h3").text("Set your Starting Balance");
        //$("h4").text("Optionally set your starting balance so we can more properly calculate your ending balance throughout");
        $("#incomeSection").hide();
        $("#expensesSection").show();
        step = "expense";
    } else if (step == "expense") {
        $("#expensesSection").hide();
        $("#balanceSection").show();
        step = "balance";
    } else {
        var incomeSelected = [];
        $("#incomeSection .selected").each(function() {
            incomeSelected.push(this.id);
        });

        var expensesSelected = [];
        $("#expensesSection .selected").each(function() {
            expensesSelected.push(this.id);
        });

        /*
        $.post("/setup", {data: JSON.stringify({incomeSelected: ["Wages"], expensesSelected: selected, "balance": balance})}, function(res) {
            console.log(res);
        });
        */
        var input = {
            incomeSelected: JSON.stringify(incomeSelected), 
            expensesSelected: JSON.stringify(expensesSelected), 
            balance: $("#balance input").val() || 0
        };
        var form = $('<form />', {
            action: '/setup',
            method: 'post',
            style: 'display: none;'
        });
        $.each(input, function (name, value) {
            $('<input />', {
                type: 'hidden',
                name: name,
                value: value
            }).appendTo(form);
        });
        form.appendTo('body').submit();
    }
});