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
    $(location.pathname.replace("/", "#")).addClass("selected");
} catch(err) {}


$("#menu li span").on("click", function() {
    location.href = "http://localhost:8888/" + $(this).text();
});
$("#menu svg").on("click", function() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $("#menu svg.selected").removeClass("selected");
        $(this).addClass("selected");
    }
});

$("#settings .fa-plus").on("click", function() {
    $("#newCategory").toggle();
});


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

$(".expense").on("click", function() {
    var p = location.pathname.split("/");
    location.href = `${location.origin}/${p[1]}/${p[2]}/${$(this).text()}`;
});



/*---------------------
----------AJAX---------
---------------------*/
// create expense entry
$('#expenseEntryForm').on('submit', function(e) {
	e.preventDefault();
	var data = $(this).serialize();
	$.post('/createExpenseEntry', data, function(res) {
        var obj = JSON.parse(res);
        if (obj.success) {
            $("tbody").append(obj.html);
        } else {
            alert("error");
        }
	});
});