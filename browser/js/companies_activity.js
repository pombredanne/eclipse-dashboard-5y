/* 
 * Copyright (C) 2012-2013 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 *
 */

var CompaniesActivity = {};

(function() {

    var activity_json = "data/json/scm-companies-activity.json";
    var activity = null;
    var default_metrics = ['commits'];
    var default_years = ['all','2014'];


    function loadActivity (cb) {
        $.when($.getJSON(activity_json)
            ).done(function(metrics) {
                activity = metrics;
                cb();
        });
    }

    CompaniesActivity.selection = function(kind, item) {
        var test = item;
    };

    function displaySelectors() {
        selectors = "";
        years = ['2014','2013','2012','all'];
        metrics = ['commits','actions','authors'];

        // Years selector
        selectors += '<div class="dropdown pull-left">';
        selectors += '<a class="dropdown-toggle btn" data-toggle="dropdown" href="#">';
        selectors += 'Select years<b class="caret"></b></a>';
        selectors += '<ul class="dropdown-menu dropdown-menu-form" role="menu">';
        $.each(years, function(i, year) {
            selectors += '<li><label class="checkbox">';
            selectors += '<input id="'+year+'_check" type="checkbox" ';
            selectors += 'onClick="CompaniesActivity.selection(\'years\',\''+year+'\');" ';
            if ($.inArray(year, default_years)>-1) selectors += 'checked ';
            selectors += '>';
            selectors += year + '</label></li>';
        });
        selectors += '</div>\n';

        // Metrics selector
        selectors += '<div class="dropdown pull-left">';
        selectors += '<a class="dropdown-toggle btn" data-toggle="dropdown" href="#">';
        selectors += 'Select metrics<b class="caret"></b></a>';
        selectors += '<ul class="dropdown-menu dropdown-menu-form" role="menu">';
        $.each(metrics, function(i, metric) {
            selectors += '<li><label class="checkbox">';
            selectors += '<input  id="'+metric+'_check" type="checkbox" ';
            selectors += 'onClick="CompaniesActivity.selection(\'metrics\',\''+metric+'\');" ';
            if ($.inArray(metric, default_metrics)>-1) selectors += 'checked ';
            selectors += '>';
            selectors += metric + '</label></li>';
        });
        selectors += '</div>\n';
        return selectors;
    }

    function addTableSortable(id) {
        // Adding sorting capability for BS3
        $.extend($.tablesorter.themes.bootstrap, {
            // these classes are added to the table. To see other table classes available,
            // look here: http://twitter.github.com/bootstrap/base-css.html#tables
            table      : 'table table-bordered',
            caption    : 'caption',
            header     : 'bootstrap-header', // give the header a gradient background
            footerRow  : '',
            footerCells: '',
            icons      : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
            sortNone   : 'bootstrap-icon-unsorted',
            sortAsc    : 'icon-chevron-up glyphicon glyphicon-chevron-up',     // includes classes for Bootstrap v2 & v3
            sortDesc   : 'icon-chevron-down glyphicon glyphicon-chevron-down', // includes classes for Bootstrap v2 & v3
            active     : '', // applied when column is sorted
            hover      : '', // use custom css here - bootstrap class may not override it
            filterRow  : '', // filter row class
            even       : '', // odd row zebra striping
            odd        : ''  // even row zebra striping
        });

        // call the tablesorter plugin and apply the uitheme widget
        $("#"+id).tablesorter({
            // this will apply the bootstrap theme if "uitheme" widget is included
            theme : "bootstrap",
            widthFixed: true,
            headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

            // widget code contained in the jquery.tablesorter.widgets.js file
            // use the zebra stripe widget if you plan on hiding any rows (filter widget)
            widgets : [ "uitheme", "filter", "zebra" ],

            widgetOptions : {
                // using the default zebra striping class name, so it actually isn't included in the theme variable above
                // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
                zebra : ["even", "odd"],

                // reset filters button
                filter_reset : ".reset"
            }
        });
    }

    function getActiveYears() {
        return ['2014','2013'];
    }

    function getActiveMetrics() {
        return ['commits'];
    }


    function displayTable(id) {
        years = getActiveYears();
        metrics = getActiveMetrics();
        table = "<div>";
        table += "<table id='"+id+"' class='table table-hover'>";
        table += "<thead>";
        // First columns should be pos, name
        total = activity['name'].length;
        table += "<th></th>";
        table += "<th>Affiliation</th>";
        $.each(activity, function(key, value) {
            if (key === "name") return;
            metric = key.split("_")[0];
            year = key.split("_")[1];
            if ($.inArray(metric, metrics)>-1 && 
                $.inArray(year, years)>-1) {
                table += "<th>"+key+"</th>";
            }
        });
        table += "</thead>";
        var pos = 0;
        for (var i = 0; i<total; i++) {
            table += "<tr>";
            // First column should be pos, name
            table += "<td>"+(++pos)+"</td>";
            table += "<td>"+activity['name'][i]+"</td>";
            $.each(activity, function(key, value) {
                if (key === "name") return;
                metric = key.split("_")[0];
                year = key.split("_")[1];
                if ($.inArray(metric, metrics)>-1 && 
                        $.inArray(year, years)>-1) {
                    table += "<td>"+value[i]+"</td>";
                }
            });
            table += "</tr>";
        }
        table += "</table>";
        table += "</div>";
        return table;
    }

    function display(div) {
        var table_id = "companies_activity";
        html = displaySelectors();
        html += displayTable(table_id);
        $("#"+div).html(html);
        addTableSortable(table_id);
    }

    CompaniesActivity.display = function() {
        var mark = "CompaniesActivity";
        var divs = $("."+mark);
        if (divs.length > 0) {
            var unique = 0;
            $.each(divs, function(id, div) {
                div.id = mark + (unique++);
                display(div.id);
            });
        }
        // Dropdown remains opened
        $('.dropdown-menu').on('click', function(e) {
            if ($(this).hasClass('dropdown-menu-form')) {
                e.stopPropagation();
            }
        });
    };

    CompaniesActivity.build = function() {
        loadActivity(CompaniesActivity.display);
    };
})();

Loader.data_ready(function() {
    CompaniesActivity.build();
});
