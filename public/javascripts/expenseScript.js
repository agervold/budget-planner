var p = location.pathname.split("/");
// Makes Entries editable
var editable = false;
var toChange;
$("#expenseEntryEdit").click(function() {
    editable = !editable;
    if (editable) {
        $(this).text("Save");
        $("tbody input").attr("disabled", false);
    } else {
        $(this).text("Edit Entries");
        $("tbody input").attr("disabled", true);
        if (toChange.length > 0) {
            var data = {sheet: p[1], category: p[2], name: p[3], entries: JSON.stringify(toChange)};
            $.post('/editExpenseEntry', data, function(res) {
                var obj = JSON.parse(res);
                if (obj.success) {
                    $("#expenseTotal span").text(obj.total);
                } else {
                    alert(obj.err);
                }
            });
        }
    }
    toChange = [];
});

$("td input").change(function() {
    var id = $(this).parents("tr").find(".entryId").text();
    var field = $(this).attr("class");
    var val = $(this).val();
    toChange.push([id,field,val]);
});

// Filters Entries based on search input
var tr = $("tr");
$("#expenseInput").on("keyup", function() {
    filter = $(this).val().toUpperCase();
    for (var i = 1; i < tr.length; i++) {
        var td = $(tr[i]).find("td")[2];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                $(tr[i]).show();
            } else {
                $(tr[i]).hide();
            }
        } 
    }
});

// Removes Expense
$("#expenseRemove").click(function() {
    if(confirm("Are you sure you want to delete this expense?")) {
        var data = {sheet: p[1], category: p[2], name: p[3]};
        $.post('/removeExpense', data, function(res) {
            var obj = JSON.parse(res);
            if (obj.success) {
                location.href = location.href.replace("/"+data.name, "");
            } else {
                alert(obj.err);
            }
        });
    }
});

// Enables or disables 'Remove Entry Functionality'
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

// Removes selected Entries
$("#expenseEntryRemove").click(function() {
    if ($(this).hasClass("disabled")) return;
    var ids = [];

    $("#expenseTable tr.selected").each(function() {
        ids.push($(this).find(".entryId").text());
    });

    var data = {sheet: p[1], category: p[2], name: p[3], ids: ids};
    $.post('/removeEntry', {data: JSON.stringify(data)}, function(res) {
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

// Create Expense Entry
$('#expenseEntryForm').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.post(this.action, data, function(res) {
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

// Sets expenses in specified order
$("#sort, #ascending").on("change", function() {
    var sort = $("#sort option:selected").text().toLowerCase();
    var ascending = $("#ascending option:selected").text() == "Ascending" ? 1 : 0;
    location.search = `?sort=${sort}&ascending=${ascending}`;
});