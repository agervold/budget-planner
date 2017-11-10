/*
$.ajax({
    method: "GET",
    url: "http://localhost:8888/"+location.hash,
    success: function (data) {
        $('body').append(data);
    }
});
*/
if($("#status_message").length) {
    $("#form_register").submit();
} else {
    $("#form_login").submit();
}
try {
    //$(location.pathname.replace("/", "#")).addClass("selected");
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

// Updates the monthly total when an input is changed
var temp; // Stores value of input before changed
$("table input").focus(function() {
    temp = parseFloat($(this).val());
    if (isNaN(temp)) temp = 0;
});
$("table input").change(function() {
    var value = parseFloat($(this).val()); // New value entered
    var col = $(this).parents("tr").find("td").index($(this).parent())-1; // Finds what column (Month) was changed
    var t = $("thead tr")[1].children[col]; // Month Total Element
    var oldValue = parseFloat(t.innerText); // Old Month Total Value
    if (!isNaN(value)) { // If proper number was entered       
        t.innerText = oldValue + value - temp;     
    } else {
        t.innerText = oldValue - temp;
    }
});


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

// Create Expense
$("#expenseForm").on("submit", function(e) {
    ajaxForm(e, this, function(res) {
        var obj = JSON.parse(res);
        if (obj.success) {
            $("tbody").append(obj.html);
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