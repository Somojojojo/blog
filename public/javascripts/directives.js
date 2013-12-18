app.directive("clock", function()
{
	return {
		restrict: 'A',
		link: function(scope, element)
		{
			var ctx = element[0].getContext('2d');

			function backingScale(context)
			{
				if ('devicePixelRatio' in window)
				{
					if (window.devicePixelRatio > 1)
					{
						return window.devicePixelRatio;
					}
				}

				return 1;
			}
			var scaleFactor = backingScale(ctx);

			var width = 20 * scaleFactor, height = 20 * scaleFactor;

			element[0].setAttribute('width', width*scaleFactor);
			element[0].setAttribute('height', height*scaleFactor);

			element[0].style.width = width;
			element[0].style.height = height;

			ctx.scale(scaleFactor, scaleFactor);

			var d = new Date(scope.post.originalDate),
				seconds = d.getSeconds(),
				minutes = d.getMinutes(),
				hours = (d.getHours() > 12) ? d.getHours() - 12 : d.getHours();

			// Draw clock border
			ctx.beginPath();
			ctx.arc(width/2, height/2, (height/2)-2, 0, 2 * Math.PI, false);
			ctx.lineWidth = 2 * scaleFactor;
			ctx.strokeStyle = "#FFF";
			ctx.stroke();

			ctx.lineCap = 'round';

			// Draw the minute hand
			ctx.save();
			ctx.translate(width/2, height/2);
			var minuteRotation = Math.PI + ((Math.PI / 30) * minutes);
			ctx.rotate( minuteRotation );
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineWidth = 2 * scaleFactor;
			ctx.lineTo(0, (height/2)-(4*scaleFactor));
			ctx.stroke();
			ctx.restore();

			// Draw the hour hand
			ctx.save();
			ctx.translate(width/2, height/2);
			var minuteRotation = Math.PI + ((Math.PI / 6) * hours);
			ctx.rotate( minuteRotation );
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineWidth = 2 * scaleFactor;
			ctx.lineTo(0, (height/2)-(6*scaleFactor));
			ctx.strokeStyle = "#A5A5A5";
			ctx.stroke();
			ctx.restore();

			// Draw the second hand
			ctx.save();
			ctx.translate(width/2, height/2);
			var minuteRotation = Math.PI + ((Math.PI / 30) * seconds);
			ctx.rotate( minuteRotation );
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineWidth = 1 * scaleFactor;
			ctx.lineTo(0, (height/2)-(4*scaleFactor));
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();
			ctx.restore();
		}
	}
})