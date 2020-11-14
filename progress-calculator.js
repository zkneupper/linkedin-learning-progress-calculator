// linkedin-learning-progress-calculator

function get_course_progress_array() {

	var toc_items = document.querySelectorAll(".classroom-toc-item");
	
	var item_array = [];
	
	for (i = 0; i < toc_items.length; i++) {

		var section_label = toc_items[i].
			querySelector(".classroom-toc-item__title").
			textContent.
			trim();

		var section_length = toc_items[i].
			querySelector(".t-12.t-white--light").
			textContent.
			trim();

		item_array.push([section_label, section_length]);
	}

	let pattern = /\d+m \d+s|\d+m|\d+s/;

	var item_array_new = [];

	for (i = 0; i < item_array.length; i++) {
		if (pattern.test(item_array[i][1])) {
			item_array_new.push(item_array[i]);
		}
	}

	var viewed_string = "(Viewed)";

	for (i = 0; i < item_array_new.length; i++) {

		var trailing_string = item_array_new[i][0].
			slice(-viewed_string.length, item_array_new[i][0].length);

		var viewed = (trailing_string == viewed_string);

		item_array_new[i].push(viewed);
	}

	for (i = 0; i < item_array_new.length; i++) {

		var viewed = item_array_new[i][2];

		if (viewed) {
			item_array_new[i][0] = item_array_new[i][0].
				slice(0, -viewed_string.length).
				trim()
		}
	}

	for (i = 0; i < item_array_new.length; i++) {
		item_array_new[i][0] = '"' + item_array_new[i][0] + '"';
	}

	let pattern_digits = /(\d+)/;

	for (i = 0; i < item_array_new.length; i++) {
		var section_length = item_array_new[i][1];
		var minutes = section_length.match(/(\d+m)/);
		var seconds = section_length.match(/(m\s\d+s)/);

		if (minutes == null) {
			minutes = 0;
		} else {
			minutes = parseInt(minutes[0].match(pattern_digits)[0]);
		}

		if (seconds == null) {
			seconds = 0;
		} else {
			seconds = parseInt(seconds[0].match(pattern_digits)[0]);
		}

		item_array_new[i].push(minutes);
		item_array_new[i].push(seconds);
	}

	return item_array_new;
}


function download_csv(data) {
	
	var csv = "title,length,viewed,minutes,seconds\n";

	data.forEach(
		function(row) {
			csv += row.join(",");
			csv += "\n";
		}
	);

	console.log(csv);

	var hiddenElement = document.createElement("a");

	hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
	hiddenElement.target = "_blank";
	hiddenElement.download = "data.csv";
	hiddenElement.click();
}


function show_progress_summary(data) {
	var minutes_total = 0;
	var minutes_viewed = 0;
	var minutes_unviewed = 0;

	var seconds_total = 0;
	var seconds_viewed = 0;
	var seconds_unviewed = 0;

	for (i = 0; i < data.length; i++) {

		var viewed = data[i][2];
		var minutes = data[i][3];
		var seconds = data[i][4];

		minutes_total += minutes;
		seconds_total += seconds;

		if (viewed) {
			minutes_viewed += minutes;
			seconds_viewed += seconds;
		} else {
			minutes_unviewed += minutes;
			seconds_unviewed += seconds;
		}
	}

	var additional_minutes_total = (Math.floor(seconds_total / 60));
	var additional_minutes_viewed = (Math.floor(seconds_viewed / 60));
	var additional_minutes_unviewed = (Math.floor(seconds_unviewed / 60));

	var remainder_seconds_total = (seconds_total % 60);
	var remainder_seconds_viewed = (seconds_viewed % 60);
	var remainder_seconds_unviewed = (seconds_unviewed % 60);

	minutes_total += additional_minutes_total;
	minutes_viewed += additional_minutes_viewed;
	minutes_unviewed += additional_minutes_unviewed;

	seconds_total += remainder_seconds_total;
	seconds_viewed += remainder_seconds_viewed;
	seconds_unviewed += remainder_seconds_unviewed;

	var hours_total = (Math.floor(minutes_total / 60));
	var hours_viewed = (Math.floor(minutes_viewed / 60));
	var hours_unviewed = (Math.floor(minutes_unviewed / 60));

	minutes_total = (minutes_total % 60);
	minutes_viewed = (minutes_viewed % 60);
	minutes_unviewed = (minutes_unviewed % 60);

	var total_seconds_total = (
		seconds_total + 
		(minutes_total * 60) + 
		(hours_total * 60 * 60)
		);

	var total_seconds_viewed = (
		seconds_viewed + 
		(minutes_viewed * 60) + 
		(hours_viewed * 60 * 60)
		);

	var total_seconds_unviewed = (
		seconds_unviewed + 
		(minutes_unviewed * 60) + 
		(hours_unviewed * 60 * 60)
		);

	var percent_complete = (100 * (total_seconds_viewed / total_seconds_total));
	var percent_complete_str = percent_complete.toFixed(2) + "%";

	var summary_text = "";
	summary_text += "Total:            " + hours_total + "h " + minutes_total + "m " + seconds_total + "s ";
	summary_text += "\n";
	summary_text += "Viewed            " + hours_viewed + "h " + minutes_viewed + "m " + seconds_viewed + "s ";
	summary_text += "\n";
	summary_text += "Remaining:        " + hours_unviewed + "h " + minutes_unviewed + "m " + seconds_unviewed + "s ";
	summary_text += "\n";
	summary_text += "Percent complete: " + percent_complete_str;

	console.log(summary_text);
}
	

course_progress = get_course_progress_array();

// download_csv(course_progress);

show_progress_summary(course_progress);