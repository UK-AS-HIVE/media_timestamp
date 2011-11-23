jQuery(document).ready(function() {

	// timestamp is hours:minutes:seconds,frame
	// TODO: for now, let's just round to the second
	function convertTimestampToTime(timestampString)
	{
		var hms = timestampString.split(',')[0].split(':');
		return parseInt(hms[2]) + 60*parseInt(hms[1]) + 3600*parseInt(hms[0]);
	}

	// use a slight delay to make sure everything else has executed already
	setTimeout(function() {
		var player = new MediaElementPlayer(jQuery('video')[0]);
			
		player.media.play();

		// TODO: make sure this works... some FLV lack proper metadata!
		//var duration = player.media.duration;
		var duration = 319; // for mockup purposes of EasterCemetaryVisit.mov

		setInterval(function() {
				// TODO: implement scrolling to keep track of time
				//console.log('play position: ' + player.media.currentTime + ' of ' + player.media.duration);
				// TODO: div.scrollable text should be a text render style ideally - currently implemented directly in theme templates
				var currentTime = player.media.currentTime;
				jQuery('.scrolling-text').each(function(index, el) {
					var timestamps = jQuery(el).find('a.timestamp');
					var prevTs = null
					var nextTs = null;
					timestamps.each(function(ti,tel) {
						if (parseInt(jQuery(tel).attr('timestamp')) <= currentTime)
						{
							prevTs = jQuery(tel);

						}
					});
					if (prevTs !== null)
					{
						jQuery(el).animate({scrollTop: prevTs.position().top + jQuery(el).scrollTop() - jQuery(el).position().top }, 1000);
					}

				});
		}, 1000);

		// find timestamps and convert them to links
		var timerail = jQuery('.mejs-time-rail');
		var timerail_width = jQuery('.mejs-time-rail .mejs-time-total').css('width');
		console.log('timerail width: ' + timerail_width);
		console.log('duration: ' + duration);

		timerail.css('position', 'relative');
		jQuery('span.timestamp').each(function (index) {
			index = index+1 // start from 1 instead of 0
			var time = convertTimestampToTime(jQuery(this).text());
			//console.log('timespan ' + index + ' @ ' + jQuery(this).text() + ' (' + time + ')');
			
			timerail.append('<div id="marker_' + index + '">'+index+'</div>');
			jQuery('.mejs-time-rail #marker_'+index).css({
				'position': 'absolute',
				'color': 'white',
				'left': (time*parseInt(timerail_width)*1.0/duration)+'px',
				'bottom': '-14px'});
			
			jQuery(this).replaceWith('<a href="#" onclick="jQuery(\'video\')[0].player.setCurrentTime('+time+');return false;" class="timestamp" timestamp="' + time + '">' + index + '</a>');
		});
	}, 500);
});

