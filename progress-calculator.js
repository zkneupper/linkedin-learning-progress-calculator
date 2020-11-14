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
			slice(viewed_string.length, item_array_new[i][0].length);

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








