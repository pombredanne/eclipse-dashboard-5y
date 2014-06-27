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

var CompaniesTable = {};

(function() {

    var activity_json = "data/json/scm-companies-activity.json";
    var activity = null;

    function loadActivity (cb) {
        $.when($.getJSON(activity_json)
            ).done(function(metrics) {
                activity = metrics;
                cb();
        });
    }

    function display(div) { 
        html = "";
        html += "<table id='companies_activity' class='table table-hover'>";
        html += "<thead>";
        // First columns should be pos, name
        total = activity['name'].length;
        html += "<th></th>";
        html += "<th>Affiliation</th>";
        $.each(activity, function(key, value) {
            if (key === "name") return;

            html += "<th>"+key+"</th>";
        });
        html += "</thead>";
        var pos = 0;
        for (var i = 0; i<total; i++) {
            html += "<tr>";
            // First column should be the name
            html += "<td>"+(++pos)+"</td>";
            html += "<td>"+activity['name'][i]+"</td>";
            $.each(activity, function(key, value) {
                if (key === "name") return;
                html += "<td>"+value[i]+"</td>";
            });
            html += "</tr>";
        }

        html += "</table>";
        $("#"+div).html(html);
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
        $("#companies_activity").tablesorter({
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

    CompaniesTable.display = function() {
        var mark = "CompaniesTable";
        var divs = $("."+mark);
        if (divs.length > 0) {
            var unique = 0;
            $.each(divs, function(id, div) {
                div.id = mark + (unique++);
                display(div.id);
            });
        }
    };

    CompaniesTable.build = function() {
        loadActivity(CompaniesTable.display);
    };
})();

Loader.data_ready(function() {
    CompaniesTable.build();
});
