/* 
 * ITS.js: Library for visualizing Bitergia ITS data
 */

var ITS = {};

(function() {

ITS.displayBasic = displayBasic;
ITS.displayData = displayData;
ITS.displayEvo = displayEvo;

function displayEvo (id, its_file, markers, config) {
	$.getJSON(its_file, function(history) {
		envisionEvo(id, history, markers, config);
	});
}

function displayData(filename) {
	$.getJSON(filename, function(data) {
		$("#itsFirst").text(data.first_date);
		$("#itsLast").text(data.last_date);
		$("#itsTickets").text(data.tickets);
		$("#itsOpeners").text(data.openers);
	});
}

function displayBasic(its_file) {
	$.getJSON(its_file, function(history) {
		basicEvo(history);
	});
}

function basicEvo (history) {
	M0.displayBasicLines('container_open_bugs', history, "open", 1, "open");
	M0.displayBasicLines('container_openers', history, "openers", 1, "openers");
	M0.displayBasicLines('container_close_bugs', history, "closed", 1, "closed");
	M0.displayBasicLines('container_closers', history, "closers", 1, "closers");
	M0.displayBasicLines('container_changes', history, "changed", 1, "changed");
	M0.displayBasicLines('container_changers', history, "changers", 1, "changers");
}

function envisionEvo(id, history, markers, envision_cfg) {
	var V = envision, firstMonth = history.id[0], options, vis;
	var container = document.getElementById(id);
	
	options = {
		container : container,
		data : {
			summary : [ history.id, history.open ],
			open : [ history.id, history.open ],
			close : [ history.id, history.closed ],
			change : [ history.id, history.changed ],
			openers : [ history.id, history.openers ],
			closers : [ history.id, history.closers ],
			changers : [ history.id, history.changers ],
			markers : markers,
			dates : history.date,
			envision_its_hide: envision_cfg.its_hide
		},
		trackFormatter : function(o) {
			var
			//   index = o.index,
			data = o.series.data, index = data[o.index][0]
					- firstMonth, value;

			value = history.date[index] + ": ";
			value += history.closed[index] + " closed, ";
			value += history.open[index] + " opened, ";
			value += history.changed[index] + " changed";
			value += "<br/>" + history.closers[index]
					+ " closers, ";
			value += history.openers[index] + " openers, ";
			value += history.changers[index] + " changers";

			return value;
		},
		xTickFormatter : function(index) {
			var label = history.date[index - firstMonth];
			if (label === "0") label = "";
			return label;
			// return Math.floor(index/12) + '';
		},
		yTickFormatter : function(n) {
			return n + '';
		},
		// Initial selection
		selection : {
			data : {
				x : {
					min : history.id[0],
					max : history.id[history.id.length - 1]
				}
			}
		}
	};
	// Create the TimeSeries
	vis = new envision.templates.ITS_Milestone0(options);	
}
})();