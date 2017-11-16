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

$("#menu .iconChevron").on("click", function() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $("#menu .iconChevron.selected").removeClass("selected");
        $(this).addClass("selected");
    }
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

$("#expenseRemove").click(function() {
    var p = location.pathname.split("/");
    var data = {sheet: p[1], category: p[2], name: p[3]};
    $.post('/removeExpense', data, function(res) {
        var obj = JSON.parse(res);
        if (obj.success) {
            location.href = location.href.replace("/"+data.name, "");
        } else {
            alert(obj.err);
        }
    });
});
/*
$("#settings .fa-plus").on("click", function() {
    $("#newCategory").toggle();
});
*/


$("tbody tr").each(function() {
    var c = 0;
    $(this).find("input").each(function(){
        if($(this).val() > 0) c++
    });
    var avg = (parseFloat($(this).find(".expenseTotal").text()) / c).toFixed(2);
    if (isNaN(avg)) avg = 0;
    $(this).find(".expenseAvg").text(avg);
});


$(".expense").on("click", function() {
    var p = location.pathname.split("/");
    location.href = `${location.origin}/${p[1]}/${p[2]}/${$(this).text()}`;
});

$("#expenseSort, #expenseAscending").on("change", function() {
    var sort = $("#expenseSort option:selected").text().toLowerCase();
    var ascending = $("#expenseAscending option:selected").text() == "Ascending" ? 1 : 0;
    location.search = `?sort=${sort}&ascending=${ascending}`;
});

var tr = $("tr");
var td;
$("#expenseInput").on("keyup", function() {
    filter = $(this).val().toUpperCase();
    for (var i = 1; i < tr.length; i++) {
        td = $(tr[i]).find("td")[2];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                $(tr[i]).show();
            } else {
                $(tr[i]).hide();
            }
        } 
    }
});

$("#expenseTable").on("click", "tbody tr", function() {
    $(this).toggleClass("selected");
    var len = $("#expenseTable tbody tr.selected").length;
    if (len > 0) {
        $("#expenseEntryRemove").removeClass("disabled");
        if (len > 1) {
            $("#expenseEntryRemove").text("Remove Entries");
        } else {
            $("#expenseEntryRemove").text("Remove Entry");
        }
    } else {
        $("#expenseEntryRemove").addClass("disabled");
    }
});

$("#expenseEntryRemove").click(function() {
    if ($(this).hasClass("disabled")) return;
    var ids = [];

    $("#expenseTable tr.selected").each(function() {
        ids.push($(this).find(".entryId").text());
    });

    var p = location.pathname.split("/");
    var data = {sheet: p[1], category: p[2], name: p[3], ids: ids};
    var d = {data: JSON.stringify(data)};
    $.post('/removeEntry', d, function(res) {
        var obj = JSON.parse(res);
        if (obj.success) {
            $("#expenseTable tr.selected").remove();
            var newTotal = parseFloat($("#expenseTotal span").text())-obj.dec;
            var len = $("tbody tr").length;
            $("#expenseTotal span").text(newTotal);
            $("#expenseAvg span").text((newTotal / len).toFixed(2));
        } else {
            alert(obj.err);          
        }
    });
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

// Create ExpenseEntry
$('#expenseEntryForm').on('submit', function(e) {
    ajaxForm(e, this, function(res) {
        var obj = JSON.parse(res);
        if (obj.success) {
            $("tbody").append(obj.html);
            var newTotal = parseFloat($("#expenseTotal span").text())+obj.cost;
            var len = $("tbody tr").length;
            $("#expenseTotal span").text(newTotal);
            $("#expenseAvg span").text((newTotal / len).toFixed(2));
            //TODO: Potentially increment 'sources'
        } else {
            alert("error");
        }
    });
});