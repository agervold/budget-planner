$("#categoryAddExpense").click(function() {
    var name = prompt("Name");
    if (name) {
        var p = location.pathname.split("/");
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
    var p = location.pathname.split("/");
    if(confirm("Are you sure you want to delete this category?")) {
        var data = {
            sheet: p[1],
            name: p[2]
        }
        $.post('/removeCategory', data, function(res) {
            var obj = JSON.parse(res);
            if (obj.success) {
                $("#"+p[2]).remove();
                $("#content").html("<p>The Category was successfully deleted.");
            } else {
                alert("error");
            }
        });
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