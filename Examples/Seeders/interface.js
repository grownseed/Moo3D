window.addEvent('load', function()
{
	var scene_height = 80;
	
	var scene = new Moo3D(
	{
		onUpdate: function()
		{
			//update stars
			for (var i = 1; i <= 3; i++)
			{
				$('stars' + i).setStyle('background-position', ((scene.options.rotationAxis.z % Math.PI) * 10 / Math.PI) * i + '% ' + (scene_height * 10 / 80) * i + '%');
			}
		},
		rotationAxis: {x: Math.PI / 2}
	});
	
	//add planets to scene
	var planets = $$('#container_scene .planet'),
		planets_nb = planets.length,
		planet_points = [],
		angle = (2 * Math.PI) / planets_nb;
	
	var radius_list = [{radius: 100, zindex: 2}, {radius: 85, zindex: 4}, {radius: 70, zindex: 6}, {radius: 55, zindex: 8}, {radius: 42, zindex: 10}, {radius: 30, zindex: 12}];
	
	planets.each(function(p, i)
	{
		var p_coords = p.getCoordinates();
		
		if (p.hasClass('sun'))
		{
			planet_points.push(
			{
				element: p,
				x: 0,
				y: 0,
				z: 0,
				modifiers:
				{
					'left': function(){return this.projection.x + '%';},
					'top': function(){return this.projection.y + '%';},
					'margin-left': function(){return 0 - p_coords.width / 2;},
					'margin-top': function(){return 0 - p_coords.height / 2;}
				}
			});
		}else{
			var point_angle = angle * i - Math.PI,
				random_radius = radius_list.getRandom(),
				pointX = Math.round(random_radius.radius * Math.cos(point_angle)),
				pointZ = Math.round(random_radius.radius * Math.sin(point_angle));
			
			planet_points.push(
			{
				element: p,
				x: pointX,
				y: 0,
				z: pointZ,
				modifiers:
				{
					'position': 'absolute',
					'left': function(){return this.projection.x + '%';},
					'top': function(){return this.projection.y + '%';},
					'z-index': function(){return this.projection.y >= 0 ? 26 - random_radius.zindex : random_radius.zindex },
					'margin-left': function(){return 0 - p_coords.width / 2;},
					'margin-top': function(){return 0 - p_coords.height / 2;},
					'background-position': function(){return this.projection.x + '% center';}
				}
			});
		}
	});
	
	scene.add(planet_points);
	
	scene.render();
	
	//Navigator
	
	//vertical
	$('container_scene').setStyle('height', '80%');

	var xFx = new Fx.Tween($('container_scene'), {property: 'height', unit: '%'}),
		xAxisFx = new Fx.Tween($('y'), {property: 'height', unit: '%'}),
		starsFx = [];

	for (var i = 1; i <= 3; i++)
	{
		starsFx[i] = new Fx.Tween($('stars' + i), {property: 'background-position', unit: '%'});
	}
	
	var animateVertical = function ()
	{
		xFx.start(scene_height);
		xAxisFx.start(scene_height);
		
		for (var i = 1; i <= 3; i++)
		{
			bg_position = $('stars' + i).getStyle('background-position').split(' ');
			starsFx[i].start(bg_position[0] + ' ' + (scene_height * 10 / 80) * i + '%');
		}
	};
	
	$('navigator_up').addEvent('click', function()
	{
		scene_height += (scene_height <= 70 ? 10 : 0);
		animateVertical();
	});
	$('navigator_down').addEvent('click', function()
	{
		scene_height -= (scene_height >= 10 ? 10 : 0);
		animateVertical();
	});
	
	//horizontal
	var zFx = new Moo3DFx(scene.options.rotationAxis, scene, {duration: 1200, wait: true, renderPoints: false}),
		zAxisFx = new Fx.Tween($('x'), {property: 'width', duration: 1200, unit: '%'});

	$('navigator_left').addEvent('click', function(){zFx.start({z: Math.PI / 2}); zAxisFx.start( Math.abs(100 - (Math.abs((scene.options.rotationAxis.z + Math.PI / 2) % Math.PI) * 100 / (Math.PI / 2))));});
	$('navigator_right').addEvent('click', function(){zFx.start({z: 0 - Math.PI / 2}); zAxisFx.start( Math.abs(100 - (Math.abs((scene.options.rotationAxis.z + Math.PI / 2) % Math.PI) * 100 / (Math.PI / 2))));});
	
	//pad
	$('x').setStyle('width', Math.abs(100 - (Math.abs(scene.options.rotationAxis.z % Math.PI) * 100 / (Math.PI / 2))) + '%');

	var pad_active = false,
		mouse_coords = null;

	$('navigator_pad').addEvents(
	{
		'mousedown': function(e)
		{
			e.stop();
			pad_active = true;
			mouse_coords = e.client;
		},
		'mouseup': function()
		{
			pad_active = false;
		},
		'mouseleave': function()
		{
			pad_active = false;
		},
		'mousemove': function(e)
		{
			if (pad_active)
			{
				var mouse_diff = {x: mouse_coords.x - e.client.x, y: mouse_coords.y - e.client.y};
				scene_height = (scene_height + mouse_diff.y * 1.5).limit(0, 80);
				$('container_scene').setStyle('height', scene_height + '%');
				$('y').setStyle('height', scene_height + '%');
				
				scene.options.rotationAxis.z += mouse_diff.x / 20;
				scene.render();
				
				$('x').setStyle('width', Math.abs(100 - (Math.abs(scene.options.rotationAxis.z % Math.PI) * 100 / (Math.PI / 2))) + '%');
				
				mouse_coords = e.client;
			}
		}
	});
});