var oldName = $("#categoryName").val();
var p = location.pathname.split("/");

$("#categoryName").change(function() {
    var val = $(this).val();
    if (val != oldName) {  
        $.post("/edit/category", {name: val, oldName: p[2], sheet: p[1]}, function(res) {
            var obj = JSON.parse(res);
            if (obj.success) {
                location.href = obj.url;
            } else {
                $("#categoryName").val(oldName);
            }        
        });
    }
});

$("#categoryName").css("width", $("#categoryName").val().length * 16);
$("#categoryName").keyup(function() {
    $(this).css("width", $(this).val().length * 16);
});

// Create Expense
$("#categoryAddExpense").click(function() {
    var name = prompt("Name");
    if (name) {
        $.post('/createExpense', {sheet: p[1], category: p[2], name: name}, function(res) {
            var obj = JSON.parse(res);
            if (obj.success) {
                $("tbody").append(obj.html);
            } else {
                alert("error");
            }
        });
    }
});

// Remove Category
$("#categoryRemove").click(function() {
    if(confirm("Are you sure you want to delete this category?")) {       
        $.post('/removeCategory', {sheet: p[1], name: p[2]}, function(res) {
            if (JSON.parse(res).success) {
                $("#"+p[2]).remove();
                $("#content").html("<p>The Category was successfully deleted.");
            } else {
                alert("error");
            }
        });
    }
});

// Search for Expense
var tr = $("tbody tr");
$("#categorySearch").on("keyup", function() {
    filter = $(this).val().toUpperCase();
    for (var i = 0; i < tr.length; i++) {
        var td = $(tr[i]).find("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                $(tr[i]).show();
            } else {
                $(tr[i]).hide();
            }
        } 
    }
});

/* Currently not used
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
*/