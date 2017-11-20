if($("#status_message").length) {
    $("#form_register").submit();
} else {
    $("#form_login").submit();
}

try {
    var p = location.pathname.split("/");
    $("#"+p[p.length-1]).addClass("selected");
} catch(err) {}

var selectedSheet;
$("#menu .iconPlus").on("click", function() {
    var t = $(this).parent();
    selectedSheet = t.attr("id");
    t.after("<li><input id='newCategoryInput' placeholder='Category'></li>");
});

// Shows Category's Expenses in menu
$("#menu .iconChevron").on("click", function() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $("#menu .iconChevron.selected").removeClass("selected");
        $(this).addClass("selected");
    }
});

// Sets the average monthly use for each Expense
$("tbody tr").each(function() {
    var c = 0;
    $(this).find("input").each(function(){
        if($(this).val() > 0) c++
    });
    var avg = (parseFloat($(this).find(".expenseTotal").text()) / c).toFixed(0);
    if (isNaN(avg)) avg = 0;
    $(this).find(".expenseAvg").text(avg);
});

// Redirects to Expense page
$(".expense").on("click", function() {
    var p = location.pathname.split("/");
    location.href = `${location.origin}/${p[1]}/${p[2]}/${$(this).text()}`;
});


/*---------------------
----------AJAX---------
---------------------*/
function ajaxForm(e, t, cb) {
    e.preventDefault();
    var data = $(t).serialize();
    $.post(t.action, data, cb);
}

// Create Category
$("#menu").on("blur", "#newCategoryInput", function() {
    var input = $(this);
    $.post('/createCategory', {name: $(this).val(), sheet: selectedSheet}, function(res) {
        var obj = JSON.parse(res);
        if (obj.success) {
            input.parent().html(obj.html);
        } else {
            alert("error");
        }
    });
});

/* No longer used. Exists in categoryScript.js
$("#enableDelete").click(function() {
    $("#menu .iconChevron").hide();
    $("#menu .iconDelete").show();
});
$(".iconDelete").click(function() {
    var t = $(this);
    if(confirm("Are you sure you want to delete this category?")) {
        var a = t.siblings("a").attr("href").split("/");
        var data = {
            sheet: a[1],
            name: a[2]
        }
        $.post('/removeCategory', data, function(res) {
            var obj = JSON.parse(res);
            if (obj.success) {
                t.parent().remove();
                $("#menu .iconDelete").hide();
                $("#menu .iconChevron").show();
            } else {
                alert("error");
            }
        });
    }
});
*/


/*
$("#settings .fa-plus").on("click", function() {
    $("#newCategory").toggle();
});
*/