window.addEvent('load', function()
{
	//coordinates of the container for the scene
	var container_coords = $('moo3dexample').getCoordinates();
	
	/*
	 declare the Moo3D scene:
	 - the rotation axis is given a slight angle to make it look like we're looking from higher
	 - the origins will simply help put our images at the right place on the page
	 - you could also use camera:{x,y,z,focalLength} to position the camera and/or change its focal length
	*/
	var scene = new Moo3D({rotationAxis: {x: 0.1}, origins: {x: container_coords.left + container_coords.width / 2, y: container_coords.top + container_coords.height / 2}});
	
	//array to contain 3D points
	var line = [];
	
	//collection of all images
	var images = $('moo3dexample').getElements('img');
	
	//add a red border to images
	images.setStyle('border', 'solid 1px #ac0000');
	
	//number of images
	var points_nb = images.length;
	
	//distance between images
	var distance = 100;
	
	//go through all images
	images.each(function(image, i)
	{
		var image_width = image.width,
			image_height = image.height;
		
		/*
		 adding each image as a 3D point to line
		 - the element to be transformed
		 - x, y and z define the position in the scene
		 - the CSS modifiers accept a function that has 'this' referring to the point itself, or a fixed value
		*/
		line.push(
		{
			element: image,
			x: 0 - image_width / 2,
			y: 0 - 50,
			z: i * distance,
			modifiers:
			{
				'left': function(){return this.projection.x + scene.options.origins.x;},
				'top': function(){return this.projection.y + scene.options.origins.y;},
				'width': function(){return this.projection.scale * image_width},
				'height': function(){return this.projection.scale * image_height},
				'opacity': function(){return this.projection.scale.limit(0, 1);},
				'z-index': function(){return Math.round(this.projection.scale * 100);}
			}
		});
	});
	
	//add line to the scene
	scene.add(line);
	
	//animation set up
	
	var front_image = 0,
		back_image = points_nb - 1;
	
	//animation paths
	var animation_path_forward =
	[
		{y: line[front_image].y - 180, z: line[front_image].z, duration: 200},
		{y: line[front_image].y - 180, z: line[back_image].z, duration: 600},
		{y: line[front_image].y, z: line[back_image].z, duration: 200}
	];
	var animation_path_backward =
	[
		{y: line[back_image].y - 180, z: line[back_image].z, duration: 200},
		{y: line[back_image].y - 180, z: line[front_image].z, duration: 600},
		{y: line[back_image].y, z: line[front_image].z, duration: 200}
	];
	//total animation time
	var total_animation_time = 1000;
	
	//render interval in milliseconds
	var refresh = 20;
	
	//z increment per render for basic animation
	var z_step = refresh * distance / total_animation_time;
	
	var animating = false;
	
	$('moo3dexample').addEvents(
	{
		//change rotation axis depending on mouse position
		'mousemove': function(e)
		{
			scene.options.rotationAxis.x = 0.1 + (container_coords.height / 2 - e.page.y + container_coords.top) / 800;
			scene.options.rotationAxis.y = (0 - (container_coords.width / 2 - e.page.x + container_coords.left)) / 1000;
			if (!animating) scene.render();
		},
		//trigger animation in mousewheel direction
		'mousewheel': function(e)
		{
			e = new Event(e);
			e.stop();
			
			if (!animating)
			{
				//cumulates time
				var total_refresh = 0;
				
				//progression
				var animation_step = 0;
				
				//total duration
				var total_duration = 0;
				
				if (e.wheel == 1)
				{
					var starting_coords = {y: line[front_image].y, z: line[front_image].z};
					var animation_path = animation_path_forward;
				}else{
					var starting_coords = {y: line[back_image].y, z: line[back_image].z};
					var animation_path = animation_path_backward;
				}
				
				var animate = function()
				{
					line.each(function(image, i)
					{
						if ((e.wheel == 1 && i == front_image) || (e.wheel == -1 && i == back_image))
						{
							image.y = starting_coords.y + (total_refresh - total_duration) * (animation_path[animation_step].y - starting_coords.y) / animation_path[animation_step].duration;
							image.z = starting_coords.z + (total_refresh - total_duration) * (animation_path[animation_step].z - starting_coords.z) / animation_path[animation_step].duration;
							
							if ((total_refresh - total_duration) >= animation_path[animation_step].duration)
							{
								starting_coords.y = image.y;
								starting_coords.z = image.z;
								total_duration += animation_path[animation_step].duration;
								animation_step++;
							}
						}else{
							image.z -= e.wheel * z_step;
						}
					});
					
					scene.render();
					
					//stop rendering if total animation time reached
					if (total_refresh >= total_animation_time)
					{
						animating = false;
						clearInterval(animation);
						
						//update front and back images
						if (e.wheel == 1)
						{
							back_image = front_image;
							front_image = (front_image < points_nb - 1 ? front_image + 1 : 0);
						}else{
							front_image = back_image;
							back_image = (back_image > 0 ? back_image - 1 : points_nb - 1);
						}
					}
					
					total_refresh += refresh;
				}
				
				animating = true;
				animation = animate.periodical(refresh);
			}
		}
	});
	
	//tie up and down keys to wheel up and wheel down for people without a wheel
	window.addEvent('keyup', function(e)
	{
		e = new Event(e);
		
		if (e.key == 'up' || e.key == 'down')
		{
			e.stop();
			e.wheel = (e.key == 'up' ? 1 : -1);
			$('moo3dexample').fireEvent('mousewheel', e);
		}
	});
	
	//render the entire scene - could also do "scene.render(line);" which would only render the one object
	scene.render();
});