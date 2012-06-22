window.addEvent('load', function()
{
	var scene = new Moo3D(),
		images = $$('#moo3dfxexample img'),
		points = [],
		points_nb = images.length,
		radius = 200,
		angle = (2 * Math.PI) / points_nb,
		pointsDiff = [],
		pointsFx = [],
		animating = false,
		current = 0;
	
	//adding each image as a point around a circle
	images.each(function(image, i)
	{
		var point_angle = angle * i - Math.PI / 1.9,
			image_width = image.width,
			image_height = image.height,
			pointX = Math.round(radius * Math.cos(point_angle)),
			pointZ = Math.round(radius * Math.sin(point_angle));
		
		//calculate the the difference between normal and expanded coordinates
		pointsDiff.push({x: Math.round(radius * 2 * Math.cos(point_angle)) - pointX, z: Math.round(radius * 2 * Math.sin(point_angle)) - pointZ});
		
		points.push(
		{
			element: image,
			x: pointX,
			y: 0,
			z: pointZ,
			modifiers:
			{
				'left': function(){return this.projection.x;},
				'top': function(){return this.projection.y;},
				'width': function(){return this.projection.scale * image_width;},
				'height': function(){return this.projection.scale * image_height;},
				'z-index': function(){return Math.round(this.projection.scale * 100);}
			}
		});
		
		//creating Fx for this point
		pointsFx.push(new Moo3DFx(points.getLast(), scene, {duration: 800, transition: Fx.Transitions.Elastic.easeOut, renderPoints: true}));
		
		i++;
	});
	
	scene.add(points);
	
	//setting the first point to expanded
	points[0].x += pointsDiff[0].x;
	points[0].z += pointsDiff[0].z;
	
	scene.render();
	
	//creating rotation Fx - renderPoints to false since rotationAxis is not a point as such, so render whole scene
	var fx = new Moo3DFx(scene.options.rotationAxis, scene, {duration: 1200, transition: Fx.Transitions.Elastic.easeOut, wait: true, renderPoints: false});
	
	//whenever a click is triggered, start animation
	window.addEvent('click', function()
	{
		if (!animating)
		{
			animating = true;
			
			//move current point back
			pointsFx[current].start({x: 0 - pointsDiff[current].x, z: 0 - pointsDiff[current].z});
			
			//rotate scene
			(function(){fx.start({y: angle})}).delay(1200);
			
			//move new point forward
			current = (current + 1) % points_nb;
			(function()
			{
				pointsFx[current].start({x: pointsDiff[current].x, z: pointsDiff[current].z});
				(function(){animating = false;}).delay(800);
			}).delay(2000);
		}
	});
});