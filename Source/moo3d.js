/*
---
description: Moo3D - A MooTools class that helps render basic 3D with JavaScript

license: MIT-style

authors:
- Hadrien Jouet

requires:
- MooTools 1.4
- Options

provides: [Moo3D]

*/

var Moo3D = new Class(
{
	Implements: [Options],
	
	options:
	{
		rotationAxis:
		{
			x: 0,
			y: 0,
			z: 0
		},
		camera:
		{
			x: 0,
			y: 0,
			z: 0,
			focalLength: 1000
		},
		origins:
		{
			x: 0,
			y: 0
		}
	},
	
	initialize: function(options)
	{
		this.setOptions(options);
		this.objects = [];
	},
	
	/*
	 * Add an Object:
	 * An object is a series of none or more 3D points
	 */
	add: function(object)
	{
		object = this.transform3DPointsTo2DPoints(object);
		
		//complete object's points
		object.each(function(point)
		{
			if (point.modifiers == undefined)
				point.modifiers = {};
			
			if (point.modifiers.left == undefined)
				point.modifiers.left = function(){return this.projection.x;};
			if (point.modifiers.top == undefined)
				point.modifiers.top = function(){return this.projection.y;};
			
			point.modifiers.position = 'absolute';
			
			point.modifiers = new Hash(point.modifiers);
		}.bind(this));
		
		this.objects.push(object);
	},
	
	transform3DPointsTo2DPoints: function(points)
	{
		var sx = Math.sin(this.options.rotationAxis.x),
			cx = Math.cos(this.options.rotationAxis.x),
			sy = Math.sin(this.options.rotationAxis.y),
			cy = Math.cos(this.options.rotationAxis.y),
			sz = Math.sin(this.options.rotationAxis.z),
			cz = Math.cos(this.options.rotationAxis.z);
		
		var x, y, z, xy, xz, yx, yz, zx, zy, scale;
		
		var i = points.length;
		
		while (i--)
		{	
			x = points[i].x - this.options.camera.x;
			y = points[i].y - this.options.camera.y;
			z = points[i].z - this.options.camera.z;
			
			//rotation around x
			xy = cx*y - sx*z;
			xz = sx*y + cx*z;
			//rotation around y
			yz = cy*xz - sy*x;
			yx = sy*xz + cy*x;
			//rotation around z
			zx = cz*yx - sz*xy;
			zy = sz*yx + cz*xy;
			
			scale = this.options.camera.focalLength / (this.options.camera.focalLength + yz);
			
			points[i].projection =
			{
				scale: scale,
				x: Math.round(zx * scale),
				y: Math.round(zy * scale),
				depth: -yz
			};
		}
		
		return points;
	},
	
	/*
	 * render points' properties.
	 * if object is passed, then only that object's points will be updated,
	 * otherwise all objects' points will be updated
	 */
	render: function(object)
	{
		var objects;
		
		if (object != undefined)
			objects = [object];
		else
			objects = this.objects;
		
		objects.each(function(obj)
		{
			obj = this.transform3DPointsTo2DPoints(obj);
			
			obj.each(function(point)
			{
				point.modifiers.each(function(value, style)
				{
					point.element.setStyle(style, (typeof(value) == 'function' ? value.attempt([], point) : value));
				});
			});
		}.bind(this));
	}
});