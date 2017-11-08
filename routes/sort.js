var getMonthlyTotal = function(expenses) {
    var months = [0,0,0,0,0,0,0,0,0,0,0,0];

    for (var i = 0; i < expenses.length; i++) {
        var entries = expenses[i].entries;
        for (var e = 0; e < entries.length; e++) {
            months[entries[e].date.getMonth()] += entries[e].cost;
        }
    }
    return months;
}

var findCategory = function(categories, name) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == name) {
            return categories[i].expenses;
        }
    }
}

var findExpense = function(categories, category, name) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == category) {
            var exs = categories[i].expenses;
            for (var e = 0; e < exs.length; e++) {
                if (exs[e].name == name) {
                    return exs[e];
                }
            }
        }
    }
}

var sortExpenseEntries = function(entries, sort, ascending) {
    if (sort == "date" || sort == "cost") {
        if (ascending) {
            entries.sort(function(a, b) {
                return a[sort] - b[sort];
            });
        } else {
            entries.sort(function(a, b) {
                return b[sort] - a[sort];
            });
        }
    } else if (sort == "source") {
        if (ascending) {
            entries.sort(function(a, b) {
                return a.source.localeCompare(b.source);
            });
        } else {
            entries.sort(function(a, b) {
                return b.source.localeCompare(a.source);
            });
        }
    }
    return entries;
}

module.exports.getMonthlyTotal = getMonthlyTotal;
module.exports.findCategory = findCategory;
module.exports.findExpense = findExpense;
module.exports.sortExpenseEntries = sortExpenseEntries;